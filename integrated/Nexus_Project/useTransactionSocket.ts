import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { TransactionEvent } from "../../../server/websocket";

interface UseTransactionSocketOptions {
  agentId?: string;
  onNewTransaction?: (transaction: TransactionEvent) => void;
  onError?: (error: Error) => void;
}

export function useTransactionSocket(options: UseTransactionSocketOptions = {}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transactions, setTransactions] = useState<TransactionEvent[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Conectar ao namespace de transações
    const newSocket = io(`${window.location.origin}/transactions`, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("[TransactionSocket] Connected");
      setIsConnected(true);

      // Inscrever em agente específico se fornecido
      if (options.agentId) {
        newSocket.emit("subscribe", options.agentId);
      }
    });

    newSocket.on("disconnect", () => {
      console.log("[TransactionSocket] Disconnected");
      setIsConnected(false);
    });

    newSocket.on("transaction:new", (transaction: TransactionEvent) => {
      console.log("[TransactionSocket] New transaction received:", transaction);
      setTransactions((prev) => [transaction, ...prev]);

      if (options.onNewTransaction) {
        options.onNewTransaction(transaction);
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
  }, [options.agentId, options.onNewTransaction, options.onError]);

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
    transactions,
    error,
    subscribe,
    unsubscribe,
  };
}
