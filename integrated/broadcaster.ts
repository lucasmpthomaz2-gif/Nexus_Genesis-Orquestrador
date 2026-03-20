/**
 * Broadcaster de eventos WebSocket
 * Gerencia a transmissão de eventos do orquestrador para clientes conectados
 */

import { Server as SocketIOServer } from "socket.io";
import {
  WebSocketEvent,
  WebSocketEventType,
  CRITICAL_EVENTS,
  THROTTLED_EVENTS,
  AGGREGATED_EVENTS,
} from "./events";

interface ThrottledEventBuffer {
  events: WebSocketEvent[];
  timeout: NodeJS.Timeout | null;
}

export class WebSocketBroadcaster {
  private io: SocketIOServer;
  private throttledBuffers: Map<WebSocketEventType, ThrottledEventBuffer> =
    new Map();
  private aggregatedBuffer: Map<WebSocketEventType, WebSocketEvent[]> = new Map();
  private eventCounts: Map<WebSocketEventType, number> = new Map();

  constructor(io: SocketIOServer) {
    this.io = io;
    this.initializeBuffers();
  }

  /**
   * Inicializa buffers para eventos throttled e agregados
   */
  private initializeBuffers(): void {
    THROTTLED_EVENTS.forEach((eventType) => {
      this.throttledBuffers.set(eventType, { events: [], timeout: null });
    });

    AGGREGATED_EVENTS.forEach((eventType) => {
      this.aggregatedBuffer.set(eventType, []);
    });
  }

  /**
   * Broadcast de um evento para todos os clientes conectados
   */
  public broadcast(event: WebSocketEvent): void {
    const eventType = event.type;

    // Incrementa contador de eventos
    this.eventCounts.set(
      eventType,
      (this.eventCounts.get(eventType) ?? 0) + 1
    );

    // Eventos críticos são transmitidos imediatamente
    if (CRITICAL_EVENTS.has(eventType)) {
      this.sendEvent(event);
      return;
    }

    // Eventos throttled são agregados e enviados em lote
    if (THROTTLED_EVENTS.has(eventType)) {
      this.bufferThrottledEvent(event);
      return;
    }

    // Eventos agregados são coletados e enviados periodicamente
    if (AGGREGATED_EVENTS.has(eventType)) {
      this.bufferAggregatedEvent(event);
      return;
    }

    // Outros eventos são transmitidos normalmente
    this.sendEvent(event);
  }

  /**
   * Envia um evento para todos os clientes
   */
  private sendEvent(event: WebSocketEvent): void {
    this.io.emit(event.type, event);
    console.log(
      `[WebSocket Broadcaster] Evento transmitido: ${event.type} (${event.timestamp.toISOString()})`
    );
  }

  /**
   * Buffer para eventos throttled
   */
  private bufferThrottledEvent(event: WebSocketEvent): void {
    const eventType = event.type;
    const buffer = this.throttledBuffers.get(eventType);

    if (!buffer) return;

    buffer.events.push(event);

    // Se já há um timeout agendado, não faz nada
    if (buffer.timeout) return;

    // Agenda o envio para 100ms depois
    buffer.timeout = setTimeout(() => {
      if (buffer.events.length > 0) {
        // Envia todos os eventos agregados
        buffer.events.forEach((e) => this.sendEvent(e));
        buffer.events = [];
      }
      buffer.timeout = null;
    }, 100);
  }

  /**
   * Buffer para eventos agregados
   */
  private bufferAggregatedEvent(event: WebSocketEvent): void {
    const eventType = event.type;
    const buffer = this.aggregatedBuffer.get(eventType) ?? [];

    buffer.push(event);
    this.aggregatedBuffer.set(eventType, buffer);

    // Envia agregado a cada 1 segundo
    if (buffer.length === 1) {
      setTimeout(() => {
        const events = this.aggregatedBuffer.get(eventType) ?? [];
        if (events.length > 0) {
          this.sendEvent({
            type: eventType,
            payload: {
              count: events.length,
              events: events,
            },
            timestamp: new Date(),
          });
          this.aggregatedBuffer.set(eventType, []);
        }
      }, 1000);
    }
  }

  /**
   * Broadcast para um usuário específico
   */
  public broadcastToUser(userId: number, event: WebSocketEvent): void {
    const room = `user:${userId}`;
    this.io.to(room).emit(event.type, event);
    console.log(
      `[WebSocket Broadcaster] Evento transmitido para usuário ${userId}: ${event.type}`
    );
  }

  /**
   * Broadcast para uma sala específica
   */
  public broadcastToRoom(room: string, event: WebSocketEvent): void {
    this.io.to(room).emit(event.type, event);
    console.log(
      `[WebSocket Broadcaster] Evento transmitido para sala ${room}: ${event.type}`
    );
  }

  /**
   * Obtém estatísticas de eventos
   */
  public getStats(): {
    totalEvents: number;
    eventCounts: Record<string, number>;
    connectedClients: number;
  } {
    const totalEvents = Array.from(this.eventCounts.values()).reduce(
      (a, b) => a + b,
      0
    );

    const eventCounts: Record<string, number> = {};
    this.eventCounts.forEach((count, eventType) => {
      eventCounts[eventType] = count;
    });

    return {
      totalEvents,
      eventCounts,
      connectedClients: this.io.engine.clientsCount,
    };
  }

  /**
   * Limpa buffers e reseta contadores
   */
  public reset(): void {
    this.throttledBuffers.forEach((buffer) => {
      if (buffer.timeout) {
        clearTimeout(buffer.timeout);
      }
      buffer.events = [];
      buffer.timeout = null;
    });

    this.aggregatedBuffer.clear();
    this.eventCounts.clear();
  }
}

// Instância global do broadcaster
let broadcasterInstance: WebSocketBroadcaster | null = null;

/**
 * Obtém ou cria a instância do broadcaster
 */
export function getBroadcaster(io?: SocketIOServer): WebSocketBroadcaster {
  if (!broadcasterInstance && io) {
    broadcasterInstance = new WebSocketBroadcaster(io);
  }

  if (!broadcasterInstance) {
    throw new Error("WebSocket broadcaster não inicializado");
  }

  return broadcasterInstance;
}

/**
 * Inicializa o broadcaster
 */
export function initializeBroadcaster(io: SocketIOServer): WebSocketBroadcaster {
  broadcasterInstance = new WebSocketBroadcaster(io);
  return broadcasterInstance;
}
