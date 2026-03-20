# Plano de Integração de Hooks WebSocket no Orquestrador NexusGenesis

**Autor:** Manus AI
**Data:** 10 de Março de 2026

## 1. Visão Geral

Este documento detalha o plano para integrar hooks de WebSocket no `NexusOrchestrator`. O objetivo é transmitir eventos em tempo real sobre o estado do orquestrador, os ciclos de sincronização, a saúde dos núcleos e os comandos gerados. A integração será feita utilizando o `WebSocketBroadcaster` existente, que já gerencia a transmissão de eventos para clientes conectados via Socket.IO.

## 2. Arquitetura de Eventos

A arquitetura de eventos já está parcialmente definida em `events.ts`. Utilizaremos os tipos de eventos existentes e os emitiremos nos pontos apropriados do ciclo de vida do orquestrador. O `broadcaster.ts` já fornece a lógica para lidar com diferentes categorias de eventos (críticos, com *throttle* e agregados), que será aproveitada.

## 3. Pontos de Integração no `orchestrator.ts`

A tabela a seguir mapeia os eventos do WebSocket aos métodos correspondentes na classe `NexusOrchestrator`, onde os hooks de transmissão serão implementados.

| Evento WebSocket          | Método no Orquestrador         | Localização (Linha Aprox.) | Descrição da Ação                                                                                             |
| ------------------------- | ------------------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `tsra:sync`               | `executeSyncCycle`             | ~109                       | Transmitir um resumo do ciclo de sincronização bem-sucedido, contendo duração, janelas e resultados.          |
| `system:alert` (Erro)     | `executeSyncCycle` (catch)     | ~115                       | Transmitir um alerta crítico quando ocorrer um erro não tratado durante o ciclo de sincronização.             |
| `nucleus:state-changed`   | `collectNucleusStates`         | ~142                       | Para cada núcleo, transmitir uma atualização de estado se os dados coletados forem diferentes do estado anterior. |
| `system:alert` (Saúde)    | `collectNucleusStates`         | ~138                       | Transmitir um alerta de aviso (`warning`) se um núcleo for considerado não saudável.                           |
| `homeostase:metric`       | `analyzeHomeostase`            | ~211                       | Transmitir as métricas de homeostase e o status de equilíbrio do ecossistema após cada análise.             |
| `orchestration:command`   | `orchestrateCommands`          | ~264                       | Transmitir um evento para cada novo comando de orquestração gerado para reequilíbrio do sistema.             |

## 4. Detalhes da Implementação

Para cada ponto de integração, o `WebSocketBroadcaster` será invocado para emitir o evento correspondente. O `broadcaster` será obtido através da função `getBroadcaster()`.

### Exemplo de Implementação (`tsra:sync`)

No final do método `logSyncCycle`, após o registro no banco de dados, o seguinte código será adicionado para transmitir o evento:

```typescript
import { getBroadcaster } from './broadcaster';
import { WebSocketEvent } from './events';

// Dentro de logSyncCycle, após o try-catch do DB
const broadcaster = getBroadcaster();
const event: WebSocketEvent = {
  type: 'tsra:sync',
  payload: {
    syncWindow: data.syncWindow,
    nucleusCount: data.nucleiSynced.length,
    eventsProcessed: data.eventsProcessed,
    commandsExecuted: data.commandsOrchestrated,
    syncDurationMs: data.syncDurationMs,
    timestamp: new Date(),
  },
  timestamp: new Date(),
};
broadcaster.broadcast(event);
```

Uma lógica similar, adaptada para cada payload de evento específico, será aplicada aos outros pontos de integração identificados.

## 5. Próximos Passos

Com este plano definido, a próxima fase será a implementação do código, modificando o arquivo `orchestrator.ts` para adicionar os hooks de WebSocket conforme detalhado. Após a implementação, serão realizados testes para validar se os eventos estão sendo transmitidos corretamente.
