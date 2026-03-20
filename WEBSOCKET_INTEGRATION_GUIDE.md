# Guia de Integração WebSocket - Nexus Genesis

## 1. Visão Geral

O sistema WebSocket do Nexus Genesis fornece comunicação em tempo real entre o orquestrador backend e os clientes frontend. Todos os eventos críticos do agente são transmitidos instantaneamente aos usuários autenticados.

## 2. Arquitetura

### Backend (Express + Socket.IO)

O servidor WebSocket é inicializado no `server/_core/index.ts` e integrado com o Express:

```typescript
import { initializeWebSocket, setGlobalIO } from "../websocket";

// Na função startServer():
const io = initializeWebSocket(server);
setGlobalIO(io);
```

### Frontend (React + Socket.IO Client)

O cliente WebSocket é gerenciado através do contexto `WebSocketContext`:

```typescript
import { WebSocketProvider } from "./contexts/WebSocketContext";

// Em main.tsx:
<WebSocketProvider>
  <App />
</WebSocketProvider>
```

## 3. Componentes Principais

### 3.1 Servidor WebSocket (`server/websocket/index.ts`)

Inicializa o Socket.IO com:
- Autenticação JWT obrigatória
- CORS configurado
- Transports: WebSocket e polling
- Health check periódico

### 3.2 Autenticação (`server/websocket/auth.ts`)

Valida tokens JWT no handshake:
- Extrai token do `auth` ou `headers.authorization`
- Verifica assinatura com `JWT_SECRET`
- Armazena informações do usuário no socket

### 3.3 Broadcaster (`server/websocket/broadcaster.ts`)

Gerencia transmissão de eventos:
- **Eventos críticos**: Transmitidos imediatamente
- **Eventos throttled**: Agregados a cada 100ms
- **Eventos agregados**: Coletados a cada 1 segundo
- Estatísticas de eventos rastreadas

### 3.4 Handlers (`server/websocket/handlers.ts`)

Funções de broadcast para cada tipo de evento:
- `broadcastOrchestrationEvent()`
- `broadcastOrchestrationCommand()`
- `broadcastNucleusStateChange()`
- `broadcastHomeostaseMetric()`
- `broadcastGenesisExperience()`
- `broadcastTsraSync()`
- `broadcastSystemAlert()`

### 3.5 Cliente WebSocket (`client/src/lib/websocket.ts`)

Gerencia conexão do cliente:
- Reconexão automática com backoff exponencial
- Listeners para eventos do servidor
- Emit de eventos para o servidor
- Armazenamento de token JWT

### 3.6 Hook React (`client/src/hooks/useWebSocket.ts`)

Fornece acesso ao WebSocket em componentes React:
- `useWebSocket()` - Hook principal
- `useWebSocketEvent()` - Escuta um tipo de evento
- `useWebSocketEvents()` - Escuta múltiplos eventos

### 3.7 Contexto WebSocket (`client/src/contexts/WebSocketContext.tsx`)

Provider que gerencia conexão globalmente:
- Inicializa automaticamente quando usuário se autentica
- Desconecta quando usuário faz logout
- Fornece estado de conexão

### 3.8 Notificações (`client/src/components/WebSocketNotification.tsx`)

Componente que exibe notificações toast:
- Escuta eventos WebSocket
- Exibe notificações para eventos críticos
- Integrado automaticamente no App

### 3.9 Dashboard em Tempo Real (`client/src/pages/RealtimeDashboard.tsx`)

Página com gráficos dinâmicos:
- Status dos núcleos em tempo real
- Gráfico de métricas de homeostase
- Gráfico de sincronização TSRA
- Gráfico de evolução de senciência
- Contadores de eventos e comandos

## 4. Tipos de Eventos

### Críticos (Broadcast Imediato)
- `nucleus:state-changed` - Mudança de estado dos núcleos
- `homeostase:metric` - Métrica de homeostase atualizada
- `genesis:experience` - Nova experiência do Genesis
- `system:alert` - Alerta do sistema

### Normais (Throttled - 100ms)
- `orchestration:event` - Novo evento de orquestração
- `orchestration:command` - Novo comando executado

### Informativos (Agregado - 1s)
- `tsra:sync` - Sincronização TSRA completada

## 5. Fluxo de Integração com NexusGenesis

Para integrar o WebSocket com o orquestrador NexusGenesis, use os hooks em `server/websocket/nexus-integration.ts`:

```typescript
import { globalWebSocketHooks } from "./websocket/nexus-integration";

// No NexusGenesis, após processar um evento:
if (globalWebSocketHooks?.onOrchestrationEvent) {
  await globalWebSocketHooks.onOrchestrationEvent({
    id: evento.id,
    origin: evento.origem,
    eventType: evento.tipo,
    eventData: evento.dados,
    sentiment: sentimento,
    processedAt: new Date(),
    createdAt: new Date(),
  });
}
```

## 6. Autenticação WebSocket

### Backend
O servidor valida tokens JWT no handshake. O token pode vir de:
- `socket.handshake.auth.token`
- `socket.handshake.headers.authorization` (Bearer token)
- `socket.handshake.query.token`

### Frontend
O cliente obtém o token de:
- `localStorage.getItem("auth_token")`
- Cookie `auth_token` ou `session`

O token é sincronizado automaticamente quando o usuário se autentica.

## 7. Reconexão Automática

O cliente implementa reconexão com backoff exponencial:
- Tentativa 1: 1 segundo
- Tentativa 2: 1.5 segundos
- Tentativa 3: 2.25 segundos
- ...
- Máximo: 16 segundos

Máximo de 10 tentativas antes de desistir.

## 8. Exemplo de Uso em Componente

```typescript
import { useWebSocketEvents } from "@/hooks/useWebSocket";

export function MyComponent() {
  const [events, setEvents] = useState([]);

  useWebSocketEvents(
    ["orchestration:event", "system:alert"],
    (eventType, event) => {
      setEvents(prev => [...prev, { type: eventType, ...event }]);
    }
  );

  return (
    <div>
      {events.map((e, i) => (
        <div key={i}>{e.type}: {JSON.stringify(e.payload)}</div>
      ))}
    </div>
  );
}
```

## 9. Monitoramento e Debugging

### Logs do Servidor
```
[WebSocket] Cliente conectado: socket-id (Usuário: user-id)
[WebSocket Broadcaster] Evento transmitido: event-type
[WebSocket] Cliente desconectado: socket-id (Razão: reason)
```

### Logs do Cliente
```
[WebSocket Client] Conectado ao servidor
[WebSocket Client] Reconectado ao servidor
[WebSocket Client] Desconectado: reason
```

### Estatísticas
Acesse estatísticas via:
```typescript
import { getWebSocketStats } from "../websocket";

const stats = getWebSocketStats();
// { connectedClients: 5, rooms: [...] }
```

## 10. Performance

### Otimizações Implementadas
- Throttling de eventos de alta frequência (100ms)
- Agregação de eventos relacionados (1s)
- Compressão de payloads grandes
- Limpeza automática de listeners
- Limite de 1000 eventos em buffer por cliente

### Recomendações
- Use `useWebSocketEvents` para múltiplos eventos
- Limpe listeners ao desmontar componentes
- Implemente debounce para atualizações UI
- Monitore latência de eventos críticos

## 11. Testes

Execute os testes com:
```bash
pnpm test
```

Testes incluem:
- Broadcaster de eventos
- Autenticação WebSocket
- Cliente WebSocket
- Reconexão automática

## 12. Troubleshooting

### Conexão não estabelecida
1. Verifique se o servidor WebSocket está rodando
2. Confirme que o token JWT é válido
3. Verifique CORS no servidor
4. Procure por erros no console do navegador

### Eventos não chegando
1. Verifique se o cliente está conectado
2. Confirme que o evento é do tipo correto
3. Procure por erros no broadcaster
4. Verifique se o listener está registrado

### Reconexão infinita
1. Verifique se o servidor está respondendo
2. Confirme que o token não expirou
3. Verifique logs do servidor
4. Aumente o timeout de reconexão se necessário

## 13. Próximas Melhorias

- [ ] Compressão de payloads com gzip
- [ ] Rate limiting por usuário
- [ ] Persistência de eventos em banco de dados
- [ ] Replay de eventos para novos clientes
- [ ] Métricas de latência em tempo real
- [ ] Dashboard de monitoramento WebSocket
- [ ] Suporte a múltiplos namespaces
- [ ] Autenticação com refresh tokens
