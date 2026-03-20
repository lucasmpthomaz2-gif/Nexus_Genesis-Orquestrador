/**
 * Testes para o WebSocket Broadcaster
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { WebSocketBroadcaster } from "./broadcaster";
import { WebSocketEvent } from "./events";

describe("WebSocketBroadcaster", () => {
  let broadcaster: WebSocketBroadcaster;
  let mockIO: any;

  beforeEach(() => {
    // Mock do Socket.IO
    mockIO = {
      emit: vi.fn(),
      to: vi.fn().mockReturnValue({
        emit: vi.fn(),
      }),
      engine: {
        clientsCount: 5,
      },
    };

    broadcaster = new WebSocketBroadcaster(mockIO);
  });

  it("deve criar uma instância do broadcaster", () => {
    expect(broadcaster).toBeDefined();
  });

  it("deve fazer broadcast de um evento crítico imediatamente", () => {
    const event: WebSocketEvent = {
      type: "nucleus:state-changed",
      payload: {
        nucleusName: "nexus_in",
        status: "healthy",
        state: {},
        timestamp: new Date(),
      },
      timestamp: new Date(),
    };

    broadcaster.broadcast(event);

    expect(mockIO.emit).toHaveBeenCalledWith(event.type, event);
  });

  it("deve fazer buffer de um evento throttled", (done) => {
    const event: WebSocketEvent = {
      type: "orchestration:event",
      payload: {
        id: "evt-123",
        origin: "nexus_in",
        eventType: "test",
        eventData: {},
        sentiment: "neutral",
        processedAt: new Date(),
        createdAt: new Date(),
      },
      timestamp: new Date(),
    };

    broadcaster.broadcast(event);

    // Aguarda o timeout de throttle (100ms)
    setTimeout(() => {
      expect(mockIO.emit).toHaveBeenCalled();
      done();
    }, 150);
  });

  it("deve fazer broadcast para um usuário específico", () => {
    const event: WebSocketEvent = {
      type: "system:alert",
      payload: {
        severity: "critical",
        title: "Alerta",
        message: "Teste",
        source: "test",
        timestamp: new Date(),
      },
      timestamp: new Date(),
    };

    broadcaster.broadcastToUser(1, event);

    expect(mockIO.to).toHaveBeenCalledWith("user:1");
  });

  it("deve fazer broadcast para uma sala específica", () => {
    const event: WebSocketEvent = {
      type: "system:alert",
      payload: {
        severity: "info",
        title: "Alerta",
        message: "Teste",
        source: "test",
        timestamp: new Date(),
      },
      timestamp: new Date(),
    };

    broadcaster.broadcastToRoom("admin", event);

    expect(mockIO.to).toHaveBeenCalledWith("admin");
  });

  it("deve retornar estatísticas de eventos", () => {
    const event: WebSocketEvent = {
      type: "orchestration:event",
      payload: {
        id: "evt-123",
        origin: "nexus_in",
        eventType: "test",
        eventData: {},
        sentiment: "neutral",
        processedAt: new Date(),
        createdAt: new Date(),
      },
      timestamp: new Date(),
    };

    broadcaster.broadcast(event);

    const stats = broadcaster.getStats();

    expect(stats).toHaveProperty("totalEvents");
    expect(stats).toHaveProperty("eventCounts");
    expect(stats).toHaveProperty("connectedClients");
    expect(stats.connectedClients).toBe(5);
  });

  it("deve resetar buffers e contadores", () => {
    const event: WebSocketEvent = {
      type: "orchestration:event",
      payload: {
        id: "evt-123",
        origin: "nexus_in",
        eventType: "test",
        eventData: {},
        sentiment: "neutral",
        processedAt: new Date(),
        createdAt: new Date(),
      },
      timestamp: new Date(),
    };

    broadcaster.broadcast(event);
    broadcaster.reset();

    const stats = broadcaster.getStats();
    expect(stats.totalEvents).toBe(0);
  });

  it("deve incrementar contador de eventos", () => {
    const event: WebSocketEvent = {
      type: "orchestration:event",
      payload: {
        id: "evt-123",
        origin: "nexus_in",
        eventType: "test",
        eventData: {},
        sentiment: "neutral",
        processedAt: new Date(),
        createdAt: new Date(),
      },
      timestamp: new Date(),
    };

    broadcaster.broadcast(event);
    broadcaster.broadcast(event);

    const stats = broadcaster.getStats();
    expect(stats.eventCounts["orchestration:event"]).toBe(2);
  });
});
