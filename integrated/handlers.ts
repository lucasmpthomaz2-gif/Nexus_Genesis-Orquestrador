/**
 * Handlers de eventos WebSocket
 * Define como processar eventos do orquestrador e transmiti-los aos clientes
 */

import { getBroadcaster } from "./broadcaster";
import {
  OrchestrationEventPayload,
  OrchestrationCommandPayload,
  NucleusStatePayload,
  HomeostaseMetricPayload,
  GenesisExperiencePayload,
  TsraSyncPayload,
  SystemAlertPayload,
  WebSocketEvent,
} from "./events";

/**
 * Broadcast de um evento de orquestração
 */
export function broadcastOrchestrationEvent(payload: OrchestrationEventPayload): void {
  const broadcaster = getBroadcaster();
  const event: WebSocketEvent = {
    type: "orchestration:event",
    payload,
    timestamp: new Date(),
  };
  broadcaster.broadcast(event);
}

/**
 * Broadcast de um comando de orquestração
 */
export function broadcastOrchestrationCommand(payload: OrchestrationCommandPayload): void {
  const broadcaster = getBroadcaster();
  const event: WebSocketEvent = {
    type: "orchestration:command",
    payload,
    timestamp: new Date(),
  };
  broadcaster.broadcast(event);
}

/**
 * Broadcast de mudança de estado de um núcleo
 */
export function broadcastNucleusStateChange(payload: NucleusStatePayload): void {
  const broadcaster = getBroadcaster();
  const event: WebSocketEvent = {
    type: "nucleus:state-changed",
    payload,
    timestamp: new Date(),
  };
  broadcaster.broadcast(event);
}

/**
 * Broadcast de métrica de homeostase
 */
export function broadcastHomeostaseMetric(payload: HomeostaseMetricPayload): void {
  const broadcaster = getBroadcaster();
  const event: WebSocketEvent = {
    type: "homeostase:metric",
    payload,
    timestamp: new Date(),
  };
  broadcaster.broadcast(event);
}

/**
 * Broadcast de experiência do Genesis
 */
export function broadcastGenesisExperience(payload: GenesisExperiencePayload): void {
  const broadcaster = getBroadcaster();
  const event: WebSocketEvent = {
    type: "genesis:experience",
    payload,
    timestamp: new Date(),
  };
  broadcaster.broadcast(event);
}

/**
 * Broadcast de sincronização TSRA
 */
export function broadcastTsraSync(payload: TsraSyncPayload): void {
  const broadcaster = getBroadcaster();
  const event: WebSocketEvent = {
    type: "tsra:sync",
    payload,
    timestamp: new Date(),
  };
  broadcaster.broadcast(event);
}

/**
 * Broadcast de alerta do sistema
 */
export function broadcastSystemAlert(payload: SystemAlertPayload): void {
  const broadcaster = getBroadcaster();
  const event: WebSocketEvent = {
    type: "system:alert",
    payload,
    timestamp: new Date(),
  };
  broadcaster.broadcast(event);
}

/**
 * Broadcast para um usuário específico
 */
export function broadcastToUser(
  userId: number,
  eventType: string,
  payload: any
): void {
  const broadcaster = getBroadcaster();
  const event: WebSocketEvent = {
    type: eventType as any,
    payload,
    timestamp: new Date(),
    userId,
  };
  broadcaster.broadcastToUser(userId, event);
}

/**
 * Broadcast para uma sala específica
 */
export function broadcastToRoom(
  room: string,
  eventType: string,
  payload: any
): void {
  const broadcaster = getBroadcaster();
  const event: WebSocketEvent = {
    type: eventType as any,
    payload,
    timestamp: new Date(),
  };
  broadcaster.broadcastToRoom(room, event);
}

/**
 * Obtém estatísticas do WebSocket
 */
export function getWebSocketStats() {
  const broadcaster = getBroadcaster();
  return broadcaster.getStats();
}
