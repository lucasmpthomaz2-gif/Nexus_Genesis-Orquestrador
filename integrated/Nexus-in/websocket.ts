import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { EventEmitter } from "events";

export const eventEmitter = new EventEmitter();

export interface WebSocketEvent {
  type: string;
  data: Record<string, unknown>;
  timestamp: number;
}

export class WebSocketManager {
  private io: SocketIOServer;
  private userSockets: Map<number, Set<string>> = new Map();

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.io.on("connection", (socket: any) => {
      console.log(`[WebSocket] Client connected: ${socket.id}`);

      socket.on("subscribe", (data: { userId: number }) => {
        const userId = data.userId;
        if (!this.userSockets.has(userId)) {
          this.userSockets.set(userId, new Set());
        }
        this.userSockets.get(userId)!.add(socket.id);
        socket.join(`user:${userId}`);
        console.log(`[WebSocket] User ${userId} subscribed`);
      });

      socket.on("disconnect", () => {
    // Clean up user socket mapping
    const entries = Array.from(this.userSockets.entries());
    for (const [userId, sockets] of entries) {
      if (sockets.has(socket.id)) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }
    }
        console.log(`[WebSocket] Client disconnected: ${socket.id}`);
      });
    });

    // Listen to application events
    eventEmitter.on("feed:post:created", (data: any) => {
      this.io.emit("feed:post:created", data);
    });

    eventEmitter.on("feed:post:liked", (data: any) => {
      this.io.emit("feed:post:liked", data);
    });

    eventEmitter.on("feed:post:commented", (data: any) => {
      this.io.emit("feed:post:commented", data);
    });

    eventEmitter.on("agent:metrics:updated", (data: any) => {
      this.io.emit("agent:metrics:updated", data);
    });

    eventEmitter.on("governance:vote:cast", (data: any) => {
      this.io.emit("governance:vote:cast", data);
    });

    eventEmitter.on("governance:proposal:updated", (data: any) => {
      this.io.emit("governance:proposal:updated", data);
    });

    eventEmitter.on("market:data:updated", (data: any) => {
      this.io.emit("market:data:updated", data);
    });

    eventEmitter.on("treasury:transaction:created", (data: any) => {
      this.io.emit("treasury:transaction:created", data);
    });

    eventEmitter.on("notification:created", (data: any) => {
      const { userId, ...notificationData } = data;
      this.io.to(`user:${userId}`).emit("notification:created", notificationData);
    });
  }

  public getIO(): SocketIOServer {
    return this.io;
  }

  public emitToUser(userId: number, event: string, data: unknown) {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  public broadcast(event: string, data: unknown) {
    this.io.emit(event, data);
  }

  public getConnectedUsers(): number {
    return this.io.engine.clientsCount;
  }
}

let wsManager: WebSocketManager | null = null;

export function initializeWebSocket(httpServer: HTTPServer): WebSocketManager {
  if (!wsManager) {
    wsManager = new WebSocketManager(httpServer);
  }
  return wsManager;
}

export function getWebSocketManager(): WebSocketManager {
  if (!wsManager) {
    throw new Error("WebSocket manager not initialized");
  }
  return wsManager;
}
