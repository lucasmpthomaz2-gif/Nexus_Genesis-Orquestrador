/**
 * Autenticação WebSocket usando JWT
 * Valida tokens na conexão e gerencia sessões por socket
 */

import { Socket } from "socket.io";
import { jwtVerify } from "jose";
import { ENV } from "../_core/env";
import { getUserByOpenId } from "../db";

export interface AuthenticatedSocket extends Socket {
  userId?: number;
  userOpenId?: string;
  authenticatedAt?: Date;
}

/**
 * Extrai e valida o token JWT do handshake
 */
export async function validateWebSocketToken(
  socket: AuthenticatedSocket
): Promise<boolean> {
  try {
    // Tenta extrair token de múltiplas fontes
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.authorization?.replace("Bearer ", "") ||
      socket.handshake.query.token;

    if (!token) {
      console.warn("[WebSocket Auth] Token não fornecido");
      return false;
    }

    // Verifica se o token é válido
    const secret = new TextEncoder().encode(ENV.cookieSecret);
    const verified = await jwtVerify(token as string, secret);

    if (!verified.payload.sub) {
      console.warn("[WebSocket Auth] Token sem identificador de usuário");
      return false;
    }

    // Busca o usuário no banco de dados
    const user = await getUserByOpenId(verified.payload.sub as string);
    if (!user) {
      console.warn("[WebSocket Auth] Usuário não encontrado:", verified.payload.sub);
      return false;
    }

    // Armazena informações do usuário no socket
    socket.userId = user.id;
    socket.userOpenId = user.openId;
    socket.authenticatedAt = new Date();

    console.log(
      `[WebSocket Auth] Usuário autenticado: ${user.openId} (ID: ${user.id})`
    );
    return true;
  } catch (error) {
    console.error("[WebSocket Auth] Erro ao validar token:", error);
    return false;
  }
}

/**
 * Middleware de autenticação para Socket.IO
 */
export function createAuthMiddleware() {
  return async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
    const isAuthenticated = await validateWebSocketToken(socket);

    if (!isAuthenticated) {
      return next(new Error("Autenticação falhou"));
    }

    next();
  };
}

/**
 * Verifica se um socket está autenticado
 */
export function isSocketAuthenticated(socket: AuthenticatedSocket): boolean {
  return !!socket.userId && !!socket.userOpenId;
}

/**
 * Obtém o ID do usuário de um socket autenticado
 */
export function getSocketUserId(socket: AuthenticatedSocket): number | undefined {
  return socket.userId;
}

/**
 * Obtém o OpenID do usuário de um socket autenticado
 */
export function getSocketUserOpenId(socket: AuthenticatedSocket): string | undefined {
  return socket.userOpenId;
}
