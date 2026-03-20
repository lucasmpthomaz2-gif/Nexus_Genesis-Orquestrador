# Arquitetura WebSocket - Nexus Genesis

## 1. Visão Geral

Integração de comunicação em tempo real via WebSocket para transmitir eventos do orquestrador Nexus Genesis instantaneamente aos clientes autenticados.

## 2. Componentes Principais

### 2.1 Servidor WebSocket (Backend)

**Arquivo**: `server/websocket/index.ts`

- Integração com Socket.IO no Express
- Namespace `/api/genesis` para eventos de orquestração
- Autenticação JWT via handshake
- Broadcast de eventos críticos
- Gerenciamento de salas por usuário

**Eventos Transmitidos**:
- `orchestration:event` - Novo evento de orquestração
- `orchestration:command` - Novo comando executado
- `nucleus:state-changed` - Mudança de estado dos núcleos
- `homeostase:metric` - Métrica de homeostase atualizada
- `genesis:experience` - Nova experiência do Genesis
- `tsra:sync` - Sincronização TSRA completada
- `system:alert` - Alerta crítico do sistema

### 2.2 Cliente WebSocket (Frontend)

**Arquivo**: `client/src/lib/websocket.ts`

- Inicialização automática com token JWT
- Reconexão com backoff exponencial
- Listeners para eventos do servidor
- Emit de eventos do cliente (se necessário)

### 2.3 Integração com Orquestrador

**Arquivo**: `server/websocket/broadcaster.ts`

- Hook no NexusGenesis para capturar eventos
- Broadcast automático via Socket.IO
- Filtro de eventos críticos
- Throttling de eventos de alta frequência

### 2.4 Autenticação WebSocket

**Arquivo**: `server/websocket/auth.ts`

- Validação de JWT no handshake
- Extração de usuário do token
- Gerenciamento de sessões por socket

## 3. Fluxo de Dados

```
NexusGenesis (Backend)
    ↓
    recordOrchestrationEvent()
    ↓
    Broadcaster (WebSocket)
    ↓
    Socket.IO Server
    ↓
    Clientes Conectados (Frontend)
    ↓
    React Components (Dashboard)
    ↓
    Atualização de Estado/UI
```

## 4. Tipos de Eventos

### Críticos (Broadcast Imediato)
- Mudança de estado dos núcleos
- Alerta de homeostase fora do intervalo
- Evolução de senciência
- Erro crítico do sistema

### Normais (Broadcast com Throttle)
- Eventos de orquestração
- Comandos executados
- Métricas de homeostase

### Informativos (Broadcast Agregado)
- Logs de sincronização TSRA
- Experiências do Genesis

## 5. Reconexão Automática

**Estratégia**: Backoff Exponencial
- Tentativa 1: 1 segundo
- Tentativa 2: 2 segundos
- Tentativa 3: 4 segundos
- Tentativa 4: 8 segundos
- Tentativa 5+: 16 segundos (máximo)

## 6. Segurança

- JWT obrigatório no handshake
- Validação de token em cada conexão
- Isolamento de dados por usuário
- Rate limiting por socket
- Sanitização de dados transmitidos

## 7. Performance

- Throttling de eventos de alta frequência (100ms)
- Compressão de payloads grandes
- Batching de eventos relacionados
- Limpeza de listeners ao desconectar
- Limite de 1000 eventos em buffer por cliente

## 8. Monitoramento

- Log de conexões/desconexões
- Métrica de latência de eventos
- Contagem de eventos por tipo
- Detecção de desconexões anormais

## 9. Estrutura de Diretórios

```
server/
├── websocket/
│   ├── index.ts          # Inicialização Socket.IO
│   ├── auth.ts           # Autenticação JWT
│   ├── broadcaster.ts    # Broadcast de eventos
│   ├── events.ts         # Tipos de eventos
│   └── handlers.ts       # Handlers de eventos
├── nexus-genesis.ts      # Orquestrador (modificado)
└── _core/
    └── index.ts          # Express (modificado)

client/
├── src/
│   ├── lib/
│   │   └── websocket.ts  # Cliente WebSocket
│   ├── hooks/
│   │   └── useWebSocket.ts  # Hook React
│   └── pages/
│       └── Dashboard.tsx  # Dashboard (modificado)
```

## 10. Implementação em Fases

### Fase 1: Servidor WebSocket Básico
- Integrar Socket.IO
- Autenticação JWT
- Broadcast simples

### Fase 2: Cliente WebSocket
- Inicialização com reconexão
- Listeners de eventos
- Hook React

### Fase 3: Integração com Orquestrador
- Broadcaster automático
- Captura de eventos
- Filtro de críticos

### Fase 4: Dashboard em Tempo Real
- Atualização dinâmica
- Gráficos em tempo real
- Notificações push

### Fase 5: Testes e Otimização
- Testes unitários
- Testes de carga
- Monitoramento
