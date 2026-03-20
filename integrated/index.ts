/**
 * Inicialização do servidor WebSocket com Socket.IO
 * Integra comunicação em tempo real com o Express
 */

import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { createAuthMiddleware, AuthenticatedSocket, getSocketUserId } from "./auth";
import { initializeBroadcaster } from "./broadcaster";
import { WebSocketEvent } from "./events";

/**
 * Inicializa o servidor Socket.IO
 */
export function initializeWebSocket(httpServer: HTTPServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === "production"
        ? process.env.VITE_FRONTEND_URL || "*"
        : "*",
      credentials: true,
    },
    transports: ["websocket", "polling"],
    // Configurações de performance
    maxHttpBufferSize: 1e6, // 1MB
    pingInterval: 25000,
    pingTimeout: 60000,
  });

  // Inicializa o broadcaster
  initializeBroadcaster(io);

  // Aplica middleware de autenticação
  io.use(createAuthMiddleware());

  // Configura handlers de conexão
  io.on("connection", (socket: AuthenticatedSocket) => {
    const userId = getSocketUserId(socket);
    console.log(`[WebSocket] Cliente conectado: ${socket.id} (Usuário: ${userId})`);

    // Adiciona o socket à sala do usuário
    if (userId) {
      socket.join(`user:${userId}`);
      socket.emit("connection:established", {
        type: "connection:established",
        payload: {
          socketId: socket.id,
          userId: userId,
          timestamp: new Date(),
        },
        timestamp: new Date(),
      });
    }

    // Handler para eventos customizados do cliente
    socket.on("client:event", (data: any) => {
      console.log(`[WebSocket] Evento recebido de ${socket.id}:`, data);
      // Processa eventos do cliente se necessário
    });

    // Handler para health check
    socket.on("ping", (callback: (data: any) => void) => {
      callback({ pong: true, timestamp: new Date() });
    });

    // Handler de desconexão
    socket.on("disconnect", (reason: string) => {
      console.log(
        `[WebSocket] Cliente desconectado: ${socket.id} (Razão: ${reason})`
      );
    });

    // Handler de erro
    socket.on("error", (error: Error) => {
      console.error(`[WebSocket] Erro no socket ${socket.id}:`, error);
    });
  });

  // Health check periódico
  setInterval(() => {
    const sockets = io.sockets.sockets;
    console.log(`[WebSocket] Clientes conectados: ${sockets.size}`);
  }, 60000);

  return io;
}

/**
 * Obtém a instância global do Socket.IO
 */
let globalIO: SocketIOServer | null = null;

export function setGlobalIO(io: SocketIOServer): void {
  globalIO = io;
}

export function getGlobalIO(): SocketIOServer {
  if (!globalIO) {
    throw new Error("Socket.IO não foi inicializado");
  }
  return globalIO;
}

/**
 * Broadcast de um evento para todos os clientes
 */
export function broadcastEvent(event: WebSocketEvent): void {
  const io = getGlobalIO();
  io.emit(event.type, event);
}

/**
 * Broadcast de um evento para um usuário específico
 */
export function broadcastToUser(userId: number, event: WebSocketEvent): void {
  const io = getGlobalIO();
  io.to(`user:${userId}`).emit(event.type, event);
}

/**
 * Broadcast de um evento para uma sala específica
 */
export function broadcastToRoom(room: string, event: WebSocketEvent): void {
  const io = getGlobalIO();
  io.to(room).emit(event.type, event);
}

/**
 * Obtém estatísticas do WebSocket
 */
export function getWebSocketStats() {
  const io = getGlobalIO();
  return {
    connectedClients: io.engine.clientsCount,
    rooms: Array.from(io.sockets.adapter.rooms.entries()),
  };
}
