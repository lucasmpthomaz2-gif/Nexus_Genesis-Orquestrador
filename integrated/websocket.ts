/**
 * Cliente WebSocket para Nexus Genesis
 * Gerencia conexão, reconexão automática e listeners de eventos
 */

import { io, Socket } from "socket.io-client";
import { WebSocketEvent, WebSocketEventType } from "../../../server/websocket/events";

export interface WebSocketClientConfig {
  url?: string;
  token?: string;
  reconnection?: boolean;
  reconnectionDelay?: number;
  reconnectionDelayMax?: number;
  reconnectionAttempts?: number;
}

export class WebSocketClient {
  private socket: Socket | null = null;
  private config: Required<WebSocketClientConfig>;
  private listeners: Map<WebSocketEventType | string, Set<(event: WebSocketEvent) => void>> =
    new Map();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private backoffMultiplier: number = 1.5;
  private isConnecting: boolean = false;

  constructor(config: WebSocketClientConfig = {}) {
    this.config = {
      url: config.url || `${window.location.origin}`,
      token: config.token || "",
      reconnection: config.reconnection !== false,
      reconnectionDelay: config.reconnectionDelay || 1000,
      reconnectionDelayMax: config.reconnectionDelayMax || 16000,
      reconnectionAttempts: config.reconnectionAttempts || 10,
    };
  }

  /**
   * Conecta ao servidor WebSocket
   */
  public async connect(): Promise<void> {
    if (this.isConnecting || this.socket?.connected) {
      return;
    }

    this.isConnecting = true;

    try {
      // Obtém o token da sessão
      const token = this.config.token || this.getTokenFromSession();

      if (!token) {
        console.warn("[WebSocket Client] Token não disponível, aguardando autenticação");
        this.isConnecting = false;
        return;
      }

      this.socket = io(this.config.url, {
        auth: {
          token,
        },
        reconnection: this.config.reconnection,
        reconnectionDelay: this.config.reconnectionDelay,
        reconnectionDelayMax: this.config.reconnectionDelayMax,
        reconnectionAttempts: this.config.reconnectionAttempts,
        transports: ["websocket", "polling"],
      });

      // Configura handlers
      this.setupHandlers();

      // Aguarda conexão
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Timeout ao conectar ao WebSocket"));
        }, 10000);

        this.socket?.once("connection:established", () => {
          clearTimeout(timeout);
          this.reconnectAttempts = 0;
          console.log("[WebSocket Client] Conectado ao servidor");
          resolve();
        });

        this.socket?.once("connect_error", (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

      this.isConnecting = false;
    } catch (error) {
      console.error("[WebSocket Client] Erro ao conectar:", error);
      this.isConnecting = false;
      this.handleReconnect();
    }
  }

  /**
   * Configura handlers de eventos
   */
  private setupHandlers(): void {
    if (!this.socket) return;

    // Conexão estabelecida
    this.socket.on("connection:established", (event: WebSocketEvent) => {
      console.log("[WebSocket Client] Conexão estabelecida:", event);
      this.emit("connection:established", event);
    });

    // Reconexão
    this.socket.on("reconnect", () => {
      console.log("[WebSocket Client] Reconectado ao servidor");
      this.reconnectAttempts = 0;
      this.emit("reconnect", {
        type: "connection:established" as any,
        payload: { timestamp: new Date() },
        timestamp: new Date(),
      });
    });

    // Tentativa de reconexão
    this.socket.on("reconnect_attempt", () => {
      this.reconnectAttempts++;
      console.log(
        `[WebSocket Client] Tentativa de reconexão ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
      );
    });

    // Erro de conexão
    this.socket.on("connect_error", (error: Error) => {
      console.error("[WebSocket Client] Erro de conexão:", error);
      this.emit("connection:error", {
        type: "connection:error" as any,
        payload: { error: error.message },
        timestamp: new Date(),
      });
    });

    // Desconexão
    this.socket.on("disconnect", (reason: string) => {
      console.log("[WebSocket Client] Desconectado:", reason);
      this.emit("disconnect", {
        type: "connection:error" as any,
        payload: { reason },
        timestamp: new Date(),
      });
    });

    // Listeners para eventos do servidor
    this.setupEventListeners();
  }

  /**
   * Configura listeners para todos os tipos de eventos
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    const eventTypes: WebSocketEventType[] = [
      "orchestration:event",
      "orchestration:command",
      "nucleus:state-changed",
      "homeostase:metric",
      "genesis:experience",
      "tsra:sync",
      "system:alert",
    ];

    eventTypes.forEach((eventType) => {
      this.socket?.on(eventType, (event: WebSocketEvent) => {
        this.emit(eventType, event);
      });
    });
  }

  /**
   * Registra um listener para um tipo de evento
   */
  public on(
    eventType: WebSocketEventType | string,
    callback: (event: any) => void
  ): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }

    this.listeners.get(eventType)?.add(callback);

    // Retorna função para remover o listener
    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }

  /**
   * Remove um listener
   */
  public off(
    eventType: WebSocketEventType | string,
    callback: (event: any) => void
  ): void {
    this.listeners.get(eventType)?.delete(callback);
  }

  /**
   * Emite um evento para todos os listeners
   */
  private emit(eventType: string, event: any): void {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(event);
        } catch (error) {
          console.error(`[WebSocket Client] Erro ao executar listener para ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Envia um evento para o servidor
   */
  public emit_server(eventType: string, data: any): void {
    if (!this.socket?.connected) {
      console.warn("[WebSocket Client] Socket não conectado");
      return;
    }

    this.socket.emit(eventType, data);
  }

  /**
   * Desconecta do servidor
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  /**
   * Verifica se está conectado
   */
  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Obtém o ID do socket
   */
  public getSocketId(): string | undefined {
    return this.socket?.id;
  }

  /**
   * Trata reconexão com backoff exponencial
   */
  private handleReconnect(): void {
    if (!this.config.reconnection || this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("[WebSocket Client] Máximo de tentativas de reconexão atingido");
      this.emit("reconnect:failed", {
        type: "connection:error" as any,
        payload: { error: "Máximo de tentativas de reconexão atingido" },
        timestamp: new Date(),
      });
      return;
    }

    const delay = Math.min(
      this.config.reconnectionDelay * Math.pow(this.backoffMultiplier, this.reconnectAttempts),
      this.config.reconnectionDelayMax
    );

    console.log(
      `[WebSocket Client] Reconectando em ${delay}ms (tentativa ${this.reconnectAttempts + 1})`
    );

    setTimeout(() => {
      this.connect().catch((error) => {
        console.error("[WebSocket Client] Erro ao reconectar:", error);
        this.handleReconnect();
      });
    }, delay);
  }

  /**
   * Obtém token da sessão (do cookie ou localStorage)
   */
  private getTokenFromSession(): string {
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
   * Atualiza o token
   */
  public setToken(token: string): void {
    this.config.token = token;
    localStorage.setItem("auth_token", token);
  }
}

// Instância global do cliente WebSocket
let globalWebSocketClient: WebSocketClient | null = null;

/**
 * Obtém ou cria a instância global do cliente WebSocket
 */
export function getWebSocketClient(config?: WebSocketClientConfig): WebSocketClient {
  if (!globalWebSocketClient) {
    globalWebSocketClient = new WebSocketClient(config);
  }
  return globalWebSocketClient;
}

/**
 * Inicializa o cliente WebSocket globalmente
 */
export async function initializeWebSocketClient(config?: WebSocketClientConfig): Promise<WebSocketClient> {
  const client = getWebSocketClient(config);
  await client.connect();
  return client;
}
