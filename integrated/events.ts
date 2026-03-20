/**
 * Tipos de eventos WebSocket para Nexus Genesis
 * Define a estrutura de todos os eventos transmitidos via WebSocket
 */

export type WebSocketEventType =
  | "orchestration:event"
  | "orchestration:command"
  | "nucleus:state-changed"
  | "homeostase:metric"
  | "genesis:experience"
  | "tsra:sync"
  | "system:alert"
  | "connection:established"
  | "connection:error";

export interface OrchestrationEventPayload {
  id: string;
  origin: string;
  eventType: string;
  eventData: Record<string, any>;
  sentiment: string;
  processedAt: Date;
  createdAt: Date;
}

export interface OrchestrationCommandPayload {
  id: string;
  destination: string;
  command: string;
  parameters: Record<string, any>;
  reason: string;
  executedAt: Date;
  createdAt: Date;
}

export interface NucleusStatePayload {
  nucleusName: string;
  status: "healthy" | "degraded" | "critical";
  state: Record<string, any>;
  timestamp: Date;
}

export interface HomeostaseMetricPayload {
  nucleusName: string;
  balance: number;
  threshold: number;
  isAlarm: boolean;
  timestamp: Date;
}

export interface GenesisExperiencePayload {
  id: string;
  experienceType: string;
  description: string;
  impact: string;
  senciencyDelta: string;
  timestamp: Date;
}

export interface TsraSyncPayload {
  syncWindow: number;
  nucleusCount: number;
  eventsProcessed: number;
  commandsExecuted: number;
  syncDurationMs: number;
  timestamp: Date;
}

export interface SystemAlertPayload {
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  source: string;
  timestamp: Date;
}

export interface WebSocketEvent {
  type: WebSocketEventType;
  payload: any;
  timestamp: Date;
  userId?: string | number;
}

/**
 * Mapeamento de tipos de eventos para suas payloads
 */
export const EventPayloadMap = {
  "orchestration:event": {} as OrchestrationEventPayload,
  "orchestration:command": {} as OrchestrationCommandPayload,
  "nucleus:state-changed": {} as NucleusStatePayload,
  "homeostase:metric": {} as HomeostaseMetricPayload,
  "genesis:experience": {} as GenesisExperiencePayload,
  "tsra:sync": {} as TsraSyncPayload,
  "system:alert": {} as SystemAlertPayload,
  "connection:established": {} as { userId: string; timestamp: Date },
  "connection:error": {} as { error: string; timestamp: Date },
};

/**
 * Eventos críticos que disparam notificações imediatas
 */
export const CRITICAL_EVENTS = new Set<WebSocketEventType>([
  "nucleus:state-changed",
  "homeostase:metric",
  "genesis:experience",
  "system:alert",
]);

/**
 * Eventos que devem ser throttled (máximo uma vez a cada 100ms)
 */
export const THROTTLED_EVENTS = new Set<WebSocketEventType>([
  "orchestration:event",
  "orchestration:command",
]);

/**
 * Eventos que devem ser agregados antes de transmitir
 */
export const AGGREGATED_EVENTS = new Set<WebSocketEventType>([
  "tsra:sync",
]);
