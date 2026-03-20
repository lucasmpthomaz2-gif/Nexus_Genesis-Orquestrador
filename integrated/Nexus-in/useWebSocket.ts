import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/_core/hooks/useAuth";

type EventListener<T = any> = (data: T) => void;

export function useWebSocket() {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const listenersRef = useRef<Map<string, Set<EventListener>>>(new Map());

  // Initialize WebSocket connection
  useEffect(() => {
    if (!user?.id) return;

    const socket = io(window.location.origin, {
      query: { userId: user.id },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("[WebSocket] Connected");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("[WebSocket] Disconnected");
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("[WebSocket] Connection error:", error);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.id]);

  // Subscribe to an event
  const on = useCallback(<T,>(event: string, listener: EventListener<T>) => {
    if (!socketRef.current) return;

    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, new Set());

      // Set up the actual socket listener only once per event
      socketRef.current.on(event, (data) => {
        const listeners = listenersRef.current.get(event);
        if (listeners) {
          listeners.forEach((fn) => fn(data));
        }
      });
    }

    const listeners = listenersRef.current.get(event)!;
    listeners.add(listener);

    // Return unsubscribe function
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Emit an event
  const emit = useCallback((event: string, data?: any) => {
    if (!socketRef.current) return;
    socketRef.current.emit(event, data);
  }, []);

  // Join a room
  const joinRoom = useCallback((room: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("join-room", { room });
  }, []);

  // Leave a room
  const leaveRoom = useCallback((room: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("leave-room", { room });
  }, []);

  return {
    isConnected,
    on,
    emit,
    joinRoom,
    leaveRoom,
    socket: socketRef.current,
  };
}

// Hook for specific event subscription with automatic cleanup
export function useWebSocketEvent<T = any>(event: string, listener: EventListener<T>) {
  const { on } = useWebSocket();

  useEffect(() => {
    const unsubscribe = on(event, listener);
    return unsubscribe;
  }, [event, listener, on]);
}

// Hook for listening to multiple events
export function useWebSocketEvents<T extends Record<string, EventListener>>(events: T) {
  const { on } = useWebSocket();

  useEffect(() => {
    const unsubscribes = Object.entries(events).map(([event, listener]) => on(event, listener));

    return () => {
      unsubscribes.forEach((unsub) => unsub?.());
    };
  }, [events, on]);
}
