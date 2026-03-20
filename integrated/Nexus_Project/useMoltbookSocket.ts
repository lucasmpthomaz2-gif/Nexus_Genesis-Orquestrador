import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { PostEvent } from "../../../server/websocket";

interface UseMoltbookSocketOptions {
  onNewPost?: (post: PostEvent) => void;
  onError?: (error: Error) => void;
}

export function useMoltbookSocket(options: UseMoltbookSocketOptions = {}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [posts, setPosts] = useState<PostEvent[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Conectar ao namespace de Moltbook
    const newSocket = io(`${window.location.origin}/moltbook`, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("[MoltbookSocket] Connected");
      setIsConnected(true);

      // Inscrever no feed geral
      newSocket.emit("subscribe");
    });

    newSocket.on("disconnect", () => {
      console.log("[MoltbookSocket] Disconnected");
      setIsConnected(false);
    });

    newSocket.on("post:new", (post: PostEvent) => {
      console.log("[MoltbookSocket] New post received:", post);
      setPosts((prev) => [post, ...prev]);

      if (options.onNewPost) {
        options.onNewPost(post);
      }
    });

    newSocket.on("post:deleted", ({ postId }: { postId: number }) => {
      console.log("[MoltbookSocket] Post deleted:", postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
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
      newSocket.emit("unsubscribe");
      newSocket.disconnect();
    };
  }, [options.onNewPost, options.onError]);

  const subscribe = useCallback(() => {
    if (socket) {
      socket.emit("subscribe");
    }
  }, [socket]);

  const unsubscribe = useCallback(() => {
    if (socket) {
      socket.emit("unsubscribe");
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    posts,
    error,
    subscribe,
    unsubscribe,
  };
}
