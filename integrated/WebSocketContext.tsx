/**
 * Contexto React para WebSocket
 * Fornece acesso ao cliente WebSocket em toda a aplicação
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { WebSocketClient, getWebSocketClient, initializeWebSocketClient } from "@/lib/websocket";
import { useWebSocketAuth } from "@/hooks/useWebSocketAuth";

interface WebSocketContextType {
  client: WebSocketClient | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

/**
 * Provider de WebSocket
 */
export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useWebSocketAuth();
  const [client, setClient] = useState<WebSocketClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Inicializa o cliente WebSocket quando o usuário se autentica
  useEffect(() => {
    if (!isAuthenticated) {
      // Desconecta quando o usuário faz logout
      if (client?.isConnected()) {
        client.disconnect();
        setClient(null);
        setIsConnected(false);
      }
      return;
    }

    // Conecta quando o usuário se autentica
    const initClient = async () => {
      try {
        setIsConnecting(true);
        const wsClient = await initializeWebSocketClient();
        setClient(wsClient);
        setIsConnected(true);
        setError(null);

        // Listeners para mudanças de estado
        wsClient.on("connection:established", () => {
          setIsConnected(true);
          setError(null);
        });

        wsClient.on("connection:error", (event: any) => {
          setError(new Error(event.payload?.error || "Erro de conexão"));
        });

        wsClient.on("disconnect", () => {
          setIsConnected(false);
        });

        wsClient.on("reconnect", () => {
          setIsConnected(true);
          setError(null);
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        console.error("[WebSocketContext] Erro ao inicializar:", error);
      } finally {
        setIsConnecting(false);
      }
    };

    initClient();

    // Cleanup
    return () => {
      if (client?.isConnected()) {
        client.disconnect();
      }
    };
  }, [isAuthenticated]);

  const connect = async () => {
    if (client?.isConnected()) return;

    try {
      setIsConnecting(true);
      const wsClient = getWebSocketClient();
      await wsClient.connect();
      setClient(wsClient);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error("[WebSocketContext] Erro ao conectar:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    if (client) {
      client.disconnect();
      setClient(null);
      setIsConnected(false);
    }
  };

  const value: WebSocketContextType = {
    client,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

/**
 * Hook para usar o contexto de WebSocket
 */
export function useWebSocketContext(): WebSocketContextType {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocketContext deve ser usado dentro de WebSocketProvider");
  }
  return context;
}
