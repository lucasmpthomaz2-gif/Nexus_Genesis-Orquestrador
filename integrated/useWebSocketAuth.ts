/**
 * Hook para gerenciar autenticação WebSocket
 * Sincroniza token JWT com a sessão do usuário
 */

import { useEffect, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getWebSocketClient } from "@/lib/websocket";

/**
 * Hook que sincroniza autenticação WebSocket com a sessão do usuário
 */
export function useWebSocketAuth() {
  const { user, isAuthenticated } = useAuth();

  // Atualiza token quando o usuário se autentica
  useEffect(() => {
    if (isAuthenticated && user) {
      const client = getWebSocketClient();

      // Se o cliente está conectado, atualiza o token
      if (client.isConnected()) {
        // Obtém o token do cookie ou localStorage
        const token = getTokenFromSession();
        if (token) {
          client.setToken(token);
        }
      }
    }
  }, [isAuthenticated, user]);

  // Desconecta quando o usuário faz logout
  useEffect(() => {
    if (!isAuthenticated) {
      const client = getWebSocketClient();
      if (client.isConnected()) {
        client.disconnect();
      }
    }
  }, [isAuthenticated]);

  return {
    isAuthenticated,
    user,
  };
}

/**
 * Obtém o token JWT da sessão
 */
export function getTokenFromSession(): string {
  // Tenta obter do localStorage
  const token = localStorage.getItem("auth_token");
  if (token) return token;

  // Tenta obter do cookie
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "auth_token" || name === "session") {
      return decodeURIComponent(value);
    }
  }

  return "";
}

/**
 * Armazena o token JWT na sessão
 */
export function storeTokenInSession(token: string): void {
  localStorage.setItem("auth_token", token);
}

/**
 * Remove o token JWT da sessão
 */
export function removeTokenFromSession(): void {
  localStorage.removeItem("auth_token");
}
