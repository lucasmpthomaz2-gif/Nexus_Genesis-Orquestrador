/**
 * Hook React para gerenciar conexão WebSocket
 * Fornece acesso aos eventos do servidor em tempo real
 */

import { useEffect, useRef, useCallback, useState } from "react";
import {
  getWebSocketClient,
  initializeWebSocketClient,
  WebSocketClient,
} from "@/lib/websocket";
import { WebSocketEventType } from "../../../server/websocket/events";

export interface UseWebSocketOptions {
  autoConnect?: boolean;
  url?: string;
  token?: string;
}

export interface UseWebSocketReturn {
  client: WebSocketClient | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  on: (eventType: WebSocketEventType | string, callback: (event: any) => void) => () => void;
  emit: (eventType: string, data: any) => void;
}

/**
 * Hook para usar WebSocket no React
 */
export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const { autoConnect = true, url, token } = options;

  const clientRef = useRef<WebSocketClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Inicializa o cliente
  useEffect(() => {
    if (!autoConnect) return;

    const initClient = async () => {
      try {
        setIsConnecting(true);
        const client = await initializeWebSocketClient({ url, token });
        clientRef.current = client;
        setIsConnected(true);
        setError(null);

        // Listeners para mudanças de estado
        client.on("connection:established", () => {
          setIsConnected(true);
          setError(null);
        });

        client.on("connection:error", (event: any) => {
          setError(new Error(event.payload?.error || "Erro de conexão"));
        });

        client.on("disconnect", () => {
          setIsConnected(false);
        });

        client.on("reconnect", () => {
          setIsConnected(true);
          setError(null);
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        console.error("[useWebSocket] Erro ao inicializar:", error);
      } finally {
        setIsConnecting(false);
      }
    };

    initClient();

    // Cleanup
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
        clientRef.current = null;
      }
    };
  }, [autoConnect, url, token]);

  // Função para conectar manualmente
  const connect = useCallback(async () => {
    if (clientRef.current?.isConnected()) return;

    try {
      setIsConnecting(true);
      const client = getWebSocketClient({ url, token });
      await client.connect();
      clientRef.current = client;
      setIsConnected(true);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error("[useWebSocket] Erro ao conectar:", error);
    } finally {
      setIsConnecting(false);
    }
  }, [url, token]);

  // Função para desconectar
  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
      setIsConnected(false);
    }
  }, []);

  // Função para registrar listeners
  const on = useCallback(
    (eventType: WebSocketEventType | string, callback: (event: any) => void) => {
      const client = clientRef.current || getWebSocketClient();
      return client.on(eventType, callback);
    },
    []
  );

  // Função para emitir eventos
  const emit = useCallback((eventType: string, data: any) => {
    const client = clientRef.current || getWebSocketClient();
    client.emit_server(eventType, data);
  }, []);

  return {
    client: clientRef.current,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    on,
    emit,
  };
}

/**
 * Hook para escutar um tipo específico de evento
 */
export function useWebSocketEvent(
  eventType: WebSocketEventType | string,
  callback: (event: any) => void,
  dependencies: any[] = []
) {
  const { on } = useWebSocket();

  useEffect(() => {
    const unsubscribe = on(eventType, callback);
    return unsubscribe;
  }, [eventType, callback, on, ...dependencies]);
}

/**
 * Hook para escutar múltiplos tipos de eventos
 */
export function useWebSocketEvents(
  eventTypes: (WebSocketEventType | string)[],
  callback: (eventType: string, event: any) => void,
  dependencies: any[] = []
) {
  const { on } = useWebSocket();

  useEffect(() => {
    const unsubscribers = eventTypes.map((eventType) =>
      on(eventType, (event) => callback(eventType, event))
    );

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [eventTypes, callback, on, ...dependencies]);
}
