import { Server as HTTPServer } from "http";
import { Express } from "express";
import WebSocketOrchestrator from "../websocket";
import { ENV } from "./env";

let wsOrchestrator: WebSocketOrchestrator | null = null;

/**
 * Inicializar WebSocket
 */
export function initializeWebSocket(app: Express, httpServer: HTTPServer): WebSocketOrchestrator {
  if (wsOrchestrator) {
    return wsOrchestrator;
  }

  wsOrchestrator = new WebSocketOrchestrator(httpServer, ENV.cookieSecret);

  console.log("🔷 WebSocket Orchestrator inicializado");

  return wsOrchestrator;
}

/**
 * Obter instância do WebSocket Orchestrator
 */
export function getWebSocketOrchestrator(): WebSocketOrchestrator | null {
  return wsOrchestrator;
}

/**
 * Fechar WebSocket
 */
export function closeWebSocket(): void {
  if (wsOrchestrator) {
    wsOrchestrator.close();
    wsOrchestrator = null;
  }
}

export default {
  initializeWebSocket,
  getWebSocketOrchestrator,
  closeWebSocket,
};
