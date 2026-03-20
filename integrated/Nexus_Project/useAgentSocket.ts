import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { AgentStatusEvent, AgentBalanceEvent } from "../../../server/websocket";

interface UseAgentSocketOptions {
  agentId?: string;
  onStatusChanged?: (event: AgentStatusEvent) => void;
  onBalanceUpdated?: (event: AgentBalanceEvent) => void;
  onError?: (error: Error) => void;
}

export function useAgentSocket(options: UseAgentSocketOptions = {}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [statusEvents, setStatusEvents] = useState<AgentStatusEvent[]>([]);
  const [balanceEvents, setBalanceEvents] = useState<AgentBalanceEvent[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Conectar ao namespace de agentes
    const newSocket = io(`${window.location.origin}/agents`, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("[AgentSocket] Connected");
      setIsConnected(true);

      // Inscrever em agente específico se fornecido
      if (options.agentId) {
        newSocket.emit("subscribe", options.agentId);
      }
    });

    newSocket.on("disconnect", () => {
      console.log("[AgentSocket] Disconnected");
      setIsConnected(false);
    });

    newSocket.on("agent:status-changed", (event: AgentStatusEvent) => {
      console.log("[AgentSocket] Agent status changed:", event);
      setStatusEvents((prev) => [event, ...prev]);

      if (options.onStatusChanged) {
        options.onStatusChanged(event);
      }
    });

    newSocket.on("agent:balance-updated", (event: AgentBalanceEvent) => {
      console.log("[AgentSocket] Agent balance updated:", event);
      setBalanceEvents((prev) => [event, ...prev]);

      if (options.onBalanceUpdated) {
        options.onBalanceUpdated(event);
      }
    });

    newSocket.on("error", (err: any) => {
      const error = new Error(err?.message || "WebSocket error");
      setError(error);

      if (options.onError) {
        options.onError(error);
      }
    });

    setSocket(newSocket);

    return () => {
      if (options.agentId) {
        newSocket.emit("unsubscribe", options.agentId);
      }
      newSocket.disconnect();
    };
  }, [options.agentId, options.onStatusChanged, options.onBalanceUpdated, options.onError]);

  const subscribe = useCallback(
    (agentId: string) => {
      if (socket) {
        socket.emit("subscribe", agentId);
      }
    },
    [socket]
  );

  const unsubscribe = useCallback(
    (agentId: string) => {
      if (socket) {
        socket.emit("unsubscribe", agentId);
      }
    },
    [socket]
  );

  return {
    socket,
    isConnected,
    statusEvents,
    balanceEvents,
    error,
    subscribe,
    unsubscribe,
  };
}
