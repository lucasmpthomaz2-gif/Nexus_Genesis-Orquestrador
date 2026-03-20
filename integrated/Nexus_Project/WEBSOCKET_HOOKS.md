# Documentação de Hooks WebSocket

Este documento descreve os hooks customizados para integração com WebSocket em tempo real.

## Visão Geral

O sistema WebSocket fornece uma camada de comunicação em tempo real entre o frontend e o servidor. Todos os hooks estão centralizados no contexto `WebSocketContext` e podem ser utilizados em qualquer componente React.

## Hooks Disponíveis

### `useWebSocket()`

Hook principal que fornece acesso ao contexto completo do WebSocket.

**Retorno:**
```typescript
{
  socket: Socket | null;                    // Instância Socket.IO
  isConnected: boolean;                     // Status de conexão
  isReconnecting: boolean;                  // Status de reconexão
  error: string | null;                     // Mensagem de erro
  metrics: any | null;                      // Dados de métricas
  alerts: any[] | null;                     // Lista de alertas
  events: any[] | null;                     // Lista de eventos
  marketData: any[] | null;                 // Dados de mercado
  harmonyLevel: number;                     // Nível de harmonia (0-100)
  agentsStatus: any | null;                 // Status dos agentes
  subscribe: (channel: string) => void;     // Subscrever a um canal
  unsubscribe: (channel: string) => void;   // Desinscrever de um canal
  clearError: () => void;                   // Limpar mensagem de erro
}
```

**Exemplo de Uso:**
```typescript
import { useWebSocket } from "@/contexts/WebSocketContext";

export function MyComponent() {
  const { isConnected, metrics, subscribe } = useWebSocket();

  useEffect(() => {
    if (isConnected) {
      subscribe("metrics");
    }
  }, [isConnected, subscribe]);

  return <div>{metrics?.activeAgents || "Carregando..."}</div>;
}
```

### `useWebSocketMetrics()`

Hook especializado para subscrição automática a dados de métricas.

**Retorno:**
```typescript
{
  activeAgents: number;
  harmonyLevel: number;
  avgHealth: number;
  avgEnergy: number;
  marketSentiment: string;
  missionsCompleted: number;
  // ... outros campos
} | null
```

**Exemplo de Uso:**
```typescript
import { useWebSocketMetrics } from "@/contexts/WebSocketContext";

export function Dashboard() {
  const metrics = useWebSocketMetrics();

  return (
    <div>
      <p>Agentes Ativos: {metrics?.activeAgents}</p>
      <p>Harmonia: {metrics?.harmonyLevel}%</p>
    </div>
  );
}
```

### `useWebSocketAlerts()`

Hook para subscrição automática a alertas do sistema.

**Retorno:**
```typescript
Array<{
  id: number;
  title: string;
  message: string;
  severity: "low" | "medium" | "high";
  createdAt: string;
}> | null
```

**Exemplo de Uso:**
```typescript
import { useWebSocketAlerts } from "@/contexts/WebSocketContext";

export function AlertPanel() {
  const alerts = useWebSocketAlerts();

  return (
    <div>
      {alerts?.map((alert) => (
        <div key={alert.id}>{alert.message}</div>
      ))}
    </div>
  );
}
```

### `useWebSocketEvents()`

Hook para subscrição automática a eventos do ecossistema.

**Retorno:**
```typescript
Array<{
  id: number;
  eventType: string;
  content: string;
  agentId?: number;
  createdAt: string;
}> | null
```

**Exemplo de Uso:**
```typescript
import { useWebSocketEvents } from "@/contexts/WebSocketContext";

export function EventLog() {
  const events = useWebSocketEvents();

  return (
    <div>
      {events?.map((event) => (
        <div key={event.id}>{event.content}</div>
      ))}
    </div>
  );
}
```

### `useWebSocketMarket()`

Hook para subscrição automática a dados de mercado.

**Retorno:**
```typescript
Array<{
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  marketCap?: number;
  volume24h?: number;
}> | null
```

**Exemplo de Uso:**
```typescript
import { useWebSocketMarket } from "@/contexts/WebSocketContext";

export function MarketTicker() {
  const marketData = useWebSocketMarket();

  return (
    <div>
      {marketData?.map((data) => (
        <div key={data.symbol}>
          {data.symbol}: ${data.price}
        </div>
      ))}
    </div>
  );
}
```

### `useWebSocketConnection()`

Hook para monitorar status de conexão.

**Retorno:**
```typescript
{
  isConnected: boolean;
  isReconnecting: boolean;
  error: string | null;
}
```

**Exemplo de Uso:**
```typescript
import { useWebSocketConnection } from "@/contexts/WebSocketContext";

export function ConnectionStatus() {
  const { isConnected, isReconnecting, error } = useWebSocketConnection();

  return (
    <div>
      {isConnected && <span>✓ Conectado</span>}
      {isReconnecting && <span>⟳ Reconectando...</span>}
      {error && <span>✗ {error}</span>}
    </div>
  );
}
```

### `useWebSocketAgents()`

Hook para subscrição automática a status de agentes.

**Retorno:**
```typescript
{
  agents: Array<{
    id: number;
    name: string;
    health: number;
    energy: number;
    reputation: number;
    specialization: string;
  }>;
} | null
```

## Canais de Subscrição

Os seguintes canais estão disponíveis para subscrição:

| Canal | Descrição | Frequência |
|-------|-----------|-----------|
| `metrics` | Métricas gerais do ecossistema | 5 segundos |
| `alerts` | Alertas do sistema | Sob demanda |
| `events` | Eventos do ecossistema | Sob demanda |
| `market` | Dados de mercado | 10 segundos |

## Reconexão Automática

O sistema implementa reconexão automática com as seguintes características:

- **Delay inicial:** 1 segundo
- **Delay máximo:** 5 segundos
- **Tentativas máximas:** 5
- **Transporte:** WebSocket com fallback para polling

Quando a reconexão falha após o máximo de tentativas, uma notificação toast é exibida.

## Notificações

O sistema integra notificações toast automáticas para os seguintes eventos:

- ✓ Conexão estabelecida
- ⟳ Tentativa de reconexão
- ✗ Falha de reconexão
- ⚠ Novos alertas recebidos
- ℹ Mudanças no nível de harmonia

## Tratamento de Erros

Todos os erros são capturados e armazenados no estado `error` do contexto. Para limpar um erro:

```typescript
const { error, clearError } = useWebSocket();

// Limpar erro
clearError();
```

## Exemplo Completo

```typescript
import { useWebSocketMetrics, useWebSocketAlerts, useWebSocketConnection } from "@/contexts/WebSocketContext";

export function Dashboard() {
  const metrics = useWebSocketMetrics();
  const alerts = useWebSocketAlerts();
  const { isConnected, error } = useWebSocketConnection();

  if (error) {
    return <div className="text-red-500">Erro: {error}</div>;
  }

  if (!isConnected) {
    return <div className="text-yellow-500">Conectando...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Agentes: {metrics?.activeAgents}</p>
      <p>Alertas: {alerts?.length}</p>
    </div>
  );
}
```

## Boas Práticas

1. **Sempre use hooks especializados** em vez de `useWebSocket()` quando possível, pois eles gerenciam subscrições automaticamente.

2. **Verifique `isConnected`** antes de usar dados, pois eles podem ser `null` durante a desconexão.

3. **Limpe erros** após exibir mensagens de erro ao usuário.

4. **Use `useEffect` para subscrições manuais** apenas quando necessário:
   ```typescript
   useEffect(() => {
     subscribe("custom-channel");
     return () => unsubscribe("custom-channel");
   }, [subscribe, unsubscribe]);
   ```

5. **Implemente loading states** enquanto aguarda dados iniciais.

## Troubleshooting

### Dados não atualizam
- Verifique se `isConnected` é `true`
- Confirme que a subscrição foi feita corretamente
- Verifique os logs do console para erros

### Reconexão não funciona
- Verifique a conexão de rede
- Confirme que o servidor está rodando
- Verifique a URL do servidor em `VITE_API_URL`

### Notificações não aparecem
- Confirme que o `Toaster` está renderizado no App
- Verifique se as notificações estão habilitadas no navegador
