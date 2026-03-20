import { io, Socket } from "socket.io-client";
import crypto from "crypto";

export type NucleusType = "nexus_in" | "nexus_hub" | "fundo_nexus";

export interface SyncMessage {
  id: string;
  origin: NucleusType;
  type: string;
  data: Record<string, any>;
  timestamp: Date;
  signature: string;
  requiresAck: boolean;
}

export interface MessageAck {
  messageId: string;
  status: "received" | "processed" | "error";
  timestamp: Date;
  error?: string;
}

export interface LatencyMetrics {
  nucleus: NucleusType;
  messageId: string;
  sentAt: Date;
  receivedAt: Date;
  processedAt?: Date;
  latencyMs: number;
  roundTripMs?: number;
}

export class NexusWebSocketClient {
  private socket: Socket | null = null;
  private nucleus: NucleusType;
  private apiSecret: string;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private latencyMetrics: LatencyMetrics[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(nucleus: NucleusType, apiSecret: string) {
    this.nucleus = nucleus;
    this.apiSecret = apiSecret;
  }

  /**
   * Conectar ao servidor WebSocket
   */
  public connect(serverUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(serverUrl, {
          auth: {
            nucleus: this.nucleus,
          },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: this.maxReconnectAttempts,
          transports: ["websocket", "polling"],
        });

        this.socket.on("connect", () => {
          console.log(`✅ ${this.nucleus} conectado ao Nexus Genesis`);
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        });

        this.socket.on("disconnect", () => {
          console.log(`⚠️ ${this.nucleus} desconectado`);
          this.stopHeartbeat();
        });

        this.socket.on("connect_error", (error) => {
          console.error(`❌ Erro de conexão em ${this.nucleus}:`, error);
          this.reconnectAttempts++;
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            reject(error);
          }
        });

        this.setupMessageHandlers();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Configurar manipuladores de mensagens
   */
  private setupMessageHandlers(): void {
    if (!this.socket) return;

    // Receber mensagens de sincronização
    this.socket.on("sync:message", (message: SyncMessage) => {
      console.log(`📨 Mensagem recebida: ${message.type}`);

      // Registrar latência
      this.recordLatency({
        nucleus: message.origin,
        messageId: message.id,
        sentAt: new Date(message.timestamp),
        receivedAt: new Date(),
        latencyMs: Date.now() - new Date(message.timestamp).getTime(),
      });

      // Chamar handler se registrado
      const handler = this.messageHandlers.get(message.type);
      if (handler) {
        handler(message.data);
      }

      // Enviar ACK
      if (message.requiresAck) {
        this.sendAck(message.id, "processed");
      }
    });

    // Receber requisição de ACK
    this.socket.on("sync:ack_request", (data: any) => {
      this.sendAck(data.messageId, "received");
    });

    // Receber broadcast
    this.socket.on("sync:broadcast", (data: any) => {
      console.log(`📡 Broadcast de ${data.origin}: ${data.message.type}`);
    });

    // Receber confirmação
    this.socket.on("sync:confirmed", (data: any) => {
      console.log(`✅ Confirmação: ${data.messageId} (${data.status})`);
    });

    // Receber resposta de heartbeat
    this.socket.on("heartbeat:response", (data: any) => {
      const latency = Date.now() - new Date(data.timestamp).getTime();
      console.log(`💓 Heartbeat: ${latency}ms`);
    });

    // Receber erro
    this.socket.on("sync:error", (data: any) => {
      console.error(`❌ Erro: ${data.error}`);
    });
  }

  /**
   * Registrar handler para tipo de mensagem
   */
  public onMessage(type: string, handler: (data: any) => void): void {
    this.messageHandlers.set(type, handler);
  }

  /**
   * Enviar mensagem de sincronização
   */
  public sendMessage(
    type: string,
    data: Record<string, any>,
    requiresAck: boolean = true
  ): string {
    if (!this.socket || !this.socket.connected) {
      console.error(`❌ ${this.nucleus} não está conectado`);
      return "";
    }

    const messageId = crypto.randomUUID();
    const timestamp = new Date();

    const message: SyncMessage = {
      id: messageId,
      origin: this.nucleus,
      type,
      data,
      timestamp,
      signature: "",
      requiresAck,
    };

    // Assinar mensagem
    message.signature = this.signMessage(message);

    // Enviar
    this.socket.emit("sync:message", message);
    console.log(`📤 Mensagem enviada: ${type}`);

    return messageId;
  }

  /**
   * Enviar ACK
   */
  private sendAck(messageId: string, status: "received" | "processed" | "error"): void {
    if (!this.socket) return;

    const ack: MessageAck = {
      messageId,
      status,
      timestamp: new Date(),
    };

    this.socket.emit("sync:ack", ack);
  }

  /**
   * Assinar mensagem
   */
  private signMessage(message: Omit<SyncMessage, "signature">): string {
    const payload = JSON.stringify({
      id: message.id,
      origin: message.origin,
      type: message.type,
      data: message.data,
      timestamp: message.timestamp,
    });

    // Usar crypto do Node.js se disponível, caso contrário usar Web Crypto
    if (typeof window === "undefined") {
      const crypto = require("crypto");
      return crypto
        .createHmac("sha256", this.apiSecret)
        .update(payload)
        .digest("hex");
    } else {
      // Para cliente web, usar Web Crypto API
      return ""; // Será implementado com Web Crypto
    }
  }

  /**
   * Registrar métrica de latência
   */
  private recordLatency(metric: LatencyMetrics): void {
    this.latencyMetrics.push(metric);

    if (this.latencyMetrics.length > 1000) {
      this.latencyMetrics.shift();
    }
  }

  /**
   * Obter latência média
   */
  public getAverageLatency(): number {
    if (this.latencyMetrics.length === 0) return 0;
    const sum = this.latencyMetrics.reduce((acc, m) => acc + m.latencyMs, 0);
    return sum / this.latencyMetrics.length;
  }

  /**
   * Iniciar heartbeat
   */
  private startHeartbeat(): void {
    if (this.heartbeatInterval) return;

    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.socket.connected) {
        this.socket.emit("heartbeat", { timestamp: new Date() });
      }
    }, 5000); // A cada 5 segundos
  }

  /**
   * Parar heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Verificar se está conectado
   */
  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Desconectar
   */
  public disconnect(): void {
    this.stopHeartbeat();
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  /**
   * Obter métricas
   */
  public getMetrics() {
    return {
      connected: this.isConnected(),
      averageLatency: this.getAverageLatency(),
      totalMessages: this.latencyMetrics.length,
      reconnectAttempts: this.reconnectAttempts,
    };
  }
}

export default NexusWebSocketClient;
