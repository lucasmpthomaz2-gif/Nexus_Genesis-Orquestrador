# Guia de Implantação em Produção: WebSocket NexusGenesis

**Autor:** Manus AI
**Data:** 10 de Março de 2026
**Versão:** 1.0.0

## 1. Introdução

Este guia fornece as diretrizes necessárias para implantar a integração WebSocket do orquestrador **NexusGenesis** em um ambiente de produção robusto, escalável e seguro. A arquitetura baseia-se em **Node.js**, **Socket.IO** e **Redis** para garantir a sincronização de eventos em tempo real através de múltiplos nós de servidor.

## 2. Requisitos de Infraestrutura

Para suportar alta disponibilidade e escalabilidade horizontal, a infraestrutura mínima recomendada consiste em:

| Componente | Especificação Recomendada | Papel |
| :--- | :--- | :--- |
| **Servidores de Aplicação** | 2+ instâncias (mín. 2 vCPU, 4GB RAM) | Execução do orquestrador e servidor Socket.IO. |
| **Redis** | Cluster ou Instância Gerenciada (v7.0+) | Broker de mensagens para o `@socket.io/redis-adapter`. |
| **Load Balancer** | Nginx, AWS ALB ou HAProxy | Terminação SSL e suporte a *Sticky Sessions*. |
| **Banco de Dados** | TiDB ou MySQL | Persistência de logs e comandos de orquestração. |

## 3. Configuração de Escalabilidade (Redis Adapter)

Para que múltiplos servidores WebSocket se comuniquem, é obrigatório o uso do adaptador Redis.

### 3.1 Instalação de Dependências
```bash
npm install @socket.io/redis-adapter redis
```

### 3.2 Implementação no `index.ts`
Substitua a inicialização padrão pela configuração com adaptador:

```typescript
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);

const io = new Server(httpServer, {
  adapter: createAdapter(pubClient, subClient),
  // ... outras opções
});
```

## 4. Segurança em Produção

A segurança do WebSocket é crítica, pois mantém conexões persistentes com o núcleo do orquestrador.

### 4.1 Autenticação JWT
O middleware de autenticação deve validar rigorosamente os tokens no handshake inicial. Nunca permita conexões anônimas em produção.

### 4.2 Configuração de CORS
Restrinja as origens permitidas explicitamente:
```typescript
cors: {
  origin: ["https://nexus-genesis.com"],
  methods: ["GET", "POST"],
  credentials: true
}
```

### 4.3 Rate Limiting
Implemente limites de taxa para evitar ataques de negação de serviço (DoS) via WebSocket. Recomenda-se o uso da biblioteca `rate-limiter-flexible`.

```typescript
import { RateLimiterMemory } from "rate-limiter-flexible";
const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 eventos
  duration: 1, // por segundo
});

socket.onAny(async (event) => {
  try {
    await rateLimiter.consume(socket.handshake.address);
  } catch (rejRes) {
    socket.emit("error", "Rate limit exceeded");
  }
});
```

## 5. Configuração do Load Balancer (Nginx)

O Nginx deve ser configurado para suportar o upgrade de protocolo e garantir que o cliente permaneça no mesmo servidor durante o handshake (Sticky Sessions).

```nginx
upstream nexus_websocket {
    ip_hash; # Sticky sessions obrigatório
    server 10.0.0.1:3000;
    server 10.0.0.2:3000;
}

server {
    listen 443 ssl;
    server_name api.nexus-genesis.com;

    location /socket.io/ {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;

        proxy_pass http://nexus_websocket;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## 6. Monitoramento e Observabilidade

Para manter a saúde do sistema em produção:

1.  **Admin UI:** Utilize o `@socket.io/admin-ui` para monitorar salas e conexões em tempo real.
2.  **Prometheus/Grafana:** Exporte métricas de conexões ativas e taxa de mensagens.
3.  **Logs Estruturados:** Utilize `pino` ou `winston` para registrar eventos de conexão/desconexão com metadados do usuário.

## 7. Checklist de Deployment

- [ ] Variáveis de ambiente (`REDIS_URL`, `JWT_SECRET`, `NODE_ENV=production`) configuradas.
- [ ] Certificados SSL/TLS válidos instalados no Load Balancer.
- [ ] Limites de descritores de arquivo (ulimit) aumentados no servidor para suportar milhares de conexões.
- [ ] Health checks configurados no Load Balancer apontando para `/health`.
- [ ] Adaptador Redis validado com teste de broadcast entre instâncias.

---
**Referências:**
1. [Socket.IO Production Checklist](https://socket.io/docs/v4/performance-tuning/)
2. [Redis Adapter Documentation](https://socket.io/docs/v4/redis-adapter/)
3. [Nginx WebSocket Proxying](https://nginx.org/en/docs/http/websocket.html)
