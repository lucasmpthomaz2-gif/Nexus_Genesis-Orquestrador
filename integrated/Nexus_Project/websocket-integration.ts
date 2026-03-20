import { Server as HTTPServer } from "http";
import { NexusWebSocketServer } from "./websocket";

let nexusWS: NexusWebSocketServer | null = null;

/**
 * Inicializa o servidor WebSocket NEXUS
 */
export function initializeNexusWebSocket(httpServer: HTTPServer): NexusWebSocketServer {
  if (!nexusWS) {
    nexusWS = new NexusWebSocketServer(httpServer);
    console.log("[NEXUS] WebSocket Server inicializado com sucesso");
  }
  return nexusWS;
}

/**
 * Obtém instância do servidor WebSocket
 */
export function getNexusWebSocket(): NexusWebSocketServer | null {
  return nexusWS;
}

/**
 * Emite evento para todos os clientes
 */
export function broadcastEvent(eventType: string, data: any) {
  if (nexusWS) {
    nexusWS.broadcast(eventType, data);
  }
}

/**
 * Emite evento para agente específico
 */
export function emitToAgent(agentId: string, eventType: string, data: any) {
  if (nexusWS) {
    nexusWS.emitToAgent(agentId, eventType, data);
  }
}
