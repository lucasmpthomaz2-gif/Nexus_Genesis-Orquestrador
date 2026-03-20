import { Server as HTTPServer } from "http";
import { initializeWebSocket } from "./websocket";

let wsInitialized = false;

export function setupWebSocket(httpServer: HTTPServer) {
  if (wsInitialized) {
    console.log("[WebSocket] Already initialized");
    return;
  }

  try {
    const nexusWS = initializeWebSocket(httpServer);
    console.log("[WebSocket] Initialized successfully");
    wsInitialized = true;
    return nexusWS;
  } catch (error) {
    console.error("[WebSocket] Failed to initialize:", error);
    throw error;
  }
}

export function isWebSocketInitialized() {
  return wsInitialized;
}
