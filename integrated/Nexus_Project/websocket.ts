import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import {
  getLatestMetrics,
  getUnreadAlerts,
  getRecentEvents,
  getLatestMarketData,
} from "./db-helpers";

export interface WebSocketEvents {
  "metrics:update": (data: any) => void;
  "alerts:new": (data: any) => void;
  "events:new": (data: any) => void;
  "market:update": (data: any) => void;
  "harmony:change": (data: { harmonyLevel: number }) => void;
  "agents:status": (data: any) => void;
}

export class NexusWebSocketServer {
  private io: SocketIOServer;
  private metricsInterval: NodeJS.Timeout | null = null;
  private marketInterval: NodeJS.Timeout | null = null;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.VITE_FRONTEND_URL || "*",
        methods: ["GET", "POST"],
      },
      transports: ["websocket", "polling"],
    });

    this.setupConnectionHandlers();
  }

  private setupConnectionHandlers() {
    this.io.on("connection", (socket: Socket) => {
      console.log(`[WebSocket] Client connected: ${socket.id}`);

      socket.on("disconnect", () => {
        console.log(`[WebSocket] Client disconnected: ${socket.id}`);
      });

      socket.on("subscribe:metrics", () => {
        socket.join("metrics");
        console.log(`[WebSocket] Client ${socket.id} subscribed to metrics`);
      });

      socket.on("subscribe:alerts", () => {
        socket.join("alerts");
        console.log(`[WebSocket] Client ${socket.id} subscribed to alerts`);
      });

      socket.on("subscribe:events", () => {
        socket.join("events");
        console.log(`[WebSocket] Client ${socket.id} subscribed to events`);
      });

      socket.on("subscribe:market", () => {
        socket.join("market");
        console.log(`[WebSocket] Client ${socket.id} subscribed to market`);
      });
    });
  }

  broadcast(event: string, data: any) {
    this.io.emit(event, data);
  }

  emitToAgent(agentId: string, event: string, data: any) {
    this.io.to(`agent:${agentId}`).emit(event, data);
  }

  async broadcastMetrics() {
    try {
      const metrics = await getLatestMetrics();
      if (metrics) {
        this.io.to("metrics").emit("metrics:update", metrics);
      }
    } catch (error) {
      console.error("[WebSocket] Failed to broadcast metrics:", error);
    }
  }

  async broadcastAlerts() {
    try {
      const alerts = await getUnreadAlerts();
      if (alerts.length > 0) {
        this.io.to("alerts").emit("alerts:new", alerts);
      }
    } catch (error) {
      console.error("[WebSocket] Failed to broadcast alerts:", error);
    }
  }

  async broadcastEvents() {
    try {
      const events = await getRecentEvents(10);
      if (events.length > 0) {
        this.io.to("events").emit("events:new", events);
      }
    } catch (error) {
      console.error("[WebSocket] Failed to broadcast events:", error);
    }
  }

  async broadcastMarketData(symbols: string[]) {
    try {
      const marketDataPromises = symbols.map((symbol) =>
        getLatestMarketData(symbol)
      );
      const marketData = await Promise.all(marketDataPromises);

      const filteredData = marketData.filter((data) => data !== undefined);
      if (filteredData.length > 0) {
        this.io.to("market").emit("market:update", filteredData);
      }
    } catch (error) {
      console.error("[WebSocket] Failed to broadcast market data:", error);
    }
  }

  startPeriodicUpdates() {
    this.metricsInterval = setInterval(async () => {
      await this.broadcastMetrics();
      await this.broadcastAlerts();
      await this.broadcastEvents();
    }, 5000);

    this.marketInterval = setInterval(async () => {
      await this.broadcastMarketData(["BTC", "ETH", "ADA", "SOL"]);
    }, 10000);

    console.log("[WebSocket] Periodic updates started");
  }

  stopPeriodicUpdates() {
    if (this.metricsInterval) clearInterval(this.metricsInterval);
    if (this.marketInterval) clearInterval(this.marketInterval);
    console.log("[WebSocket] Periodic updates stopped");
  }
}

let nexusWebSocket: NexusWebSocketServer | null = null;

export function initializeWebSocket(httpServer: HTTPServer): NexusWebSocketServer {
  if (!nexusWebSocket) {
    nexusWebSocket = new NexusWebSocketServer(httpServer);
    nexusWebSocket.startPeriodicUpdates();
  }
  return nexusWebSocket;
}

export function getNexusWebSocket(): NexusWebSocketServer | null {
  return nexusWebSocket;
}
