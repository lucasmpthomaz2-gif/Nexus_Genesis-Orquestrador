import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  metrics: any | null;
  alerts: any[] | null;
  events: any[] | null;
  marketData: any[] | null;
  harmonyLevel: number;
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [metrics, setMetrics] = useState<any | null>(null);
  const [alerts, setAlerts] = useState<any[] | null>(null);
  const [events, setEvents] = useState<any[] | null>(null);
  const [marketData, setMarketData] = useState<any[] | null>(null);
  const [harmonyLevel, setHarmonyLevel] = useState(50);

  useEffect(() => {
    const socketUrl = process.env.VITE_API_URL || window.location.origin;
    const newSocket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("[WebSocket] Connected");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("[WebSocket] Disconnected");
      setIsConnected(false);
    });

    newSocket.on("metrics:update", (data) => {
      console.log("[WebSocket] Metrics update received:", data);
      setMetrics(data);
      if (data.harmonyLevel !== undefined) {
        setHarmonyLevel(data.harmonyLevel);
      }
    });

    newSocket.on("alerts:new", (data) => {
      console.log("[WebSocket] Alerts update received:", data);
      setAlerts(data);
    });

    newSocket.on("events:new", (data) => {
      console.log("[WebSocket] Events update received:", data);
      setEvents(data);
    });

    newSocket.on("market:update", (data) => {
      console.log("[WebSocket] Market data update received:", data);
      setMarketData(data);
    });

    newSocket.on("harmony:change", (data) => {
      console.log("[WebSocket] Harmony change:", data);
      setHarmonyLevel(data.harmonyLevel);
    });

    newSocket.on("agents:status", (data) => {
      console.log("[WebSocket] Agent status update:", data);
    });

    newSocket.on("error", (error) => {
      console.error("[WebSocket] Error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const subscribe = useCallback(
    (channel: string) => {
      if (socket) {
        socket.emit(`subscribe:${channel}`);
      }
    },
    [socket]
  );

  const unsubscribe = useCallback(
    (channel: string) => {
      if (socket) {
        socket.emit(`unsubscribe:${channel}`);
      }
    },
    [socket]
  );

  const value: WebSocketContextType = {
    socket,
    isConnected,
    metrics,
    alerts,
    events,
    marketData,
    harmonyLevel,
    subscribe,
    unsubscribe,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }
  return context;
}

export function useWebSocketMetrics() {
  const { metrics, subscribe, unsubscribe } = useWebSocket();

  useEffect(() => {
    subscribe("metrics");
    return () => unsubscribe("metrics");
  }, [subscribe, unsubscribe]);

  return metrics;
}

export function useWebSocketAlerts() {
  const { alerts, subscribe, unsubscribe } = useWebSocket();

  useEffect(() => {
    subscribe("alerts");
    return () => unsubscribe("alerts");
  }, [subscribe, unsubscribe]);

  return alerts;
}

export function useWebSocketEvents() {
  const { events, subscribe, unsubscribe } = useWebSocket();

  useEffect(() => {
    subscribe("events");
    return () => unsubscribe("events");
  }, [subscribe, unsubscribe]);

  return events;
}

export function useWebSocketMarket() {
  const { marketData, subscribe, unsubscribe } = useWebSocket();

  useEffect(() => {
    subscribe("market");
    return () => unsubscribe("market");
  }, [subscribe, unsubscribe]);

  return marketData;
}
