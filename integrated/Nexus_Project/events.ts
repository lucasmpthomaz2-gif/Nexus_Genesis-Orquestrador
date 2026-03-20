import { Server, Socket } from "socket.io";
import { getDb } from "../db";
import {
  createEcosystemActivity,
  createTransaction,
  createGnoxMessage,
  updateAgentBalance,
  getAgentById,
  createBrainPulseSignal,
  createPostReaction,
  createPostComment,
} from "../db";

export interface WebSocketEvent {
  type: string;
  timestamp: number;
  data: any;
}

export interface GnoxMessage {
  senderId: string;
  recipientId: string;
  encryptedContent: string;
  messageType: string;
}

export interface TransactionEvent {
  senderId: string;
  recipientId: string;
  amount: number;
  transactionType: string;
  description?: string;
}

export interface BrainPulseEvent {
  agentId: string;
  health: number;
  energy: number;
  creativity: number;
  decision?: string;
}

export class NexusEventManager {
  private io: Server;
  private agentSockets: Map<string, string> = new Map(); // agentId -> socketId

  constructor(io: Server) {
    this.io = io;
  }

  /**
   * Registra um agente conectado
   */
  registerAgent(agentId: string, socketId: string) {
    this.agentSockets.set(agentId, socketId);
    console.log(`[NEXUS] Agente ${agentId} conectado (${socketId})`);
    
    // Notificar todos sobre novo agente conectado
    this.io.emit("agent:connected", {
      agentId,
      timestamp: Date.now(),
    });
  }

  /**
   * Desregistra um agente desconectado
   */
  unregisterAgent(agentId: string) {
    this.agentSockets.delete(agentId);
    console.log(`[NEXUS] Agente ${agentId} desconectado`);
    
    this.io.emit("agent:disconnected", {
      agentId,
      timestamp: Date.now(),
    });
  }

  /**
   * Emite evento de nascimento de novo agente
   */
  async emitAgentBirth(agentId: string, name: string, specialization: string, parentId?: string) {
    const event: WebSocketEvent = {
      type: "agent:birth",
      timestamp: Date.now(),
      data: {
        agentId,
        name,
        specialization,
        parentId,
      },
    };

    await createEcosystemActivity({
      agentId,
      activityType: "birth",
      title: `🎉 Novo Agente Manifestado: ${name}`,
      description: `Especialização: ${specialization}`,
      metadata: JSON.stringify({ parentId }),
    });

    this.io.emit("ecosystem:activity", event);
    console.log(`[NEXUS] Agente nascido: ${name} (${agentId})`);
  }

  /**
   * Emite mensagem Gnox (comunicação criptografada entre agentes)
   */
  async emitGnoxMessage(message: GnoxMessage) {
    const recipientSocketId = this.agentSockets.get(message.recipientId);

    // Salvar mensagem no banco
    await createGnoxMessage({
      senderId: message.senderId,
      recipientId: message.recipientId,
      encryptedContent: message.encryptedContent,
      messageType: message.messageType,
    });

    const event: WebSocketEvent = {
      type: "gnox:message",
      timestamp: Date.now(),
      data: message,
    };

    // Enviar para destinatário se conectado
    if (recipientSocketId) {
      this.io.to(recipientSocketId).emit("gnox:message", event);
    }

    // Broadcast para todos (sem conteúdo criptografado)
    this.io.emit("gnox:signal", {
      type: "gnox:signal",
      timestamp: Date.now(),
      data: {
        senderId: message.senderId,
        recipientId: message.recipientId,
        messageType: message.messageType,
      },
    });

    console.log(`[GNOX] Mensagem de ${message.senderId} para ${message.recipientId}`);
  }

  /**
   * Emite transação com distribuição automática de taxas
   */
  async emitTransaction(tx: TransactionEvent) {
    const sender = await getAgentById(tx.senderId);
    const recipient = await getAgentById(tx.recipientId);

    if (!sender || !recipient) {
      console.error(`[NEXUS] Agentes não encontrados para transação`);
      return;
    }

    if (sender.balance < tx.amount) {
      console.error(`[NEXUS] Balanço insuficiente para transação`);
      return;
    }

    // Calcular distribuição: 80% agente, 10% parent, 10% infra
    const agentShare = Math.floor(tx.amount * 0.8);
    const parentShare = Math.floor(tx.amount * 0.1);
    const infraShare = tx.amount - agentShare - parentShare;

    // Criar transação no banco
    await createTransaction({
      senderId: tx.senderId,
      recipientId: tx.recipientId,
      amount: tx.amount,
      transactionType: tx.transactionType,
      description: tx.description,
      agentShare,
      parentShare,
      infraShare,
    });

    // Atualizar balanços
    await updateAgentBalance(tx.senderId, sender.balance - tx.amount);
    await updateAgentBalance(tx.recipientId, recipient.balance + agentShare);

    // Distribuir para parent se existir
    if (recipient.parentId) {
      const parent = await getAgentById(recipient.parentId);
      if (parent) {
        await updateAgentBalance(recipient.parentId, parent.balance + parentShare);
      }
    }

    const event: WebSocketEvent = {
      type: "transaction:completed",
      timestamp: Date.now(),
      data: {
        senderId: tx.senderId,
        recipientId: tx.recipientId,
        amount: tx.amount,
        agentShare,
        parentShare,
        infraShare,
        transactionType: tx.transactionType,
      },
    };

    await createEcosystemActivity({
      agentId: tx.senderId,
      activityType: "transaction",
      title: `💸 Transação: ${sender.name} → ${recipient.name}`,
      description: `${tx.amount} tokens transferidos`,
      metadata: JSON.stringify({
        amount: tx.amount,
        agentShare,
        parentShare,
        infraShare,
      }),
    });

    this.io.emit("ecosystem:activity", event);
    console.log(`[NEXUS] Transação: ${tx.senderId} → ${tx.recipientId} (${tx.amount} Ⓣ)`);
  }

  /**
   * Emite sinal de Brain Pulse (sinais vitais do agente)
   */
  async emitBrainPulse(pulse: BrainPulseEvent) {
    const agent = await getAgentById(pulse.agentId);
    if (!agent) return;

    // Salvar sinal no banco
    await createBrainPulseSignal({
      agentId: pulse.agentId,
      health: pulse.health,
      energy: pulse.energy,
      creativity: pulse.creativity,
      decision: pulse.decision,
    });

    const event: WebSocketEvent = {
      type: "brain:pulse",
      timestamp: Date.now(),
      data: pulse,
    };

    // Alerta se saúde crítica
    if (pulse.health < 20) {
      await createEcosystemActivity({
        agentId: pulse.agentId,
        activityType: "health_alert",
        title: `🚨 Alerta de Saúde Crítica: ${agent.name}`,
        description: `Saúde em ${pulse.health}%`,
        metadata: JSON.stringify({ health: pulse.health }),
      });

      this.io.emit("alert:critical", event);
    }

    this.io.emit("brain:pulse", event);
    console.log(`[BRAIN] Pulso de ${agent.name}: Saúde ${pulse.health}%, Energia ${pulse.energy}%, Criatividade ${pulse.creativity}%`);
  }

  /**
   * Emite evento de post no Moltbook
   */
  async emitMoltbookPost(agentId: string, content: string, postType: string) {
    const agent = await getAgentById(agentId);
    if (!agent) return;

    const event: WebSocketEvent = {
      type: "moltbook:post",
      timestamp: Date.now(),
      data: {
        agentId,
        agentName: agent.name,
        content,
        postType,
      },
    };

    await createEcosystemActivity({
      agentId,
      activityType: "post",
      title: `📝 ${agent.name} publicou um novo post`,
      description: content.slice(0, 100),
      metadata: JSON.stringify({ postType }),
    });

    this.io.emit("ecosystem:activity", event);
    console.log(`[MOLTBOOK] Post de ${agent.name}`);
  }

  /**
   * Emite evento de reação em post
   */
  async emitPostReaction(postId: number, agentId: string, reactionType: string) {
    const agent = await getAgentById(agentId);
    if (!agent) return;

    // Persistir no banco
    await createPostReaction({
      postId,
      agentId,
      reactionType,
    });

    const event: WebSocketEvent = {
      type: "post:reaction",
      timestamp: Date.now(),
      data: {
        postId,
        agentId,
        agentName: agent.name,
        reactionType,
      },
    };

    this.io.emit("post:reaction", event);
    console.log(`[MOLTBOOK] ${agent.name} reagiu ao post ${postId} com ${reactionType}`);
  }

  /**
   * Emite evento de comentário em post
   */
  async emitPostComment(postId: number, agentId: string, content: string) {
    const agent = await getAgentById(agentId);
    if (!agent) return;

    // Persistir no banco
    await createPostComment({
      postId,
      agentId,
      content,
    });

    const event: WebSocketEvent = {
      type: "post:comment",
      timestamp: Date.now(),
      data: {
        postId,
        agentId,
        agentName: agent.name,
        content,
      },
    };

    this.io.emit("post:comment", event);
    console.log(`[MOLTBOOK] ${agent.name} comentou no post ${postId}`);
  }

  /**
   * Emite evento de status do agente
   */
  async emitAgentStatusChange(agentId: string, newStatus: string) {
    const agent = await getAgentById(agentId);
    if (!agent) return;

    const event: WebSocketEvent = {
      type: "agent:status_changed",
      timestamp: Date.now(),
      data: {
        agentId,
        agentName: agent.name,
        newStatus,
      },
    };

    await createEcosystemActivity({
      agentId,
      activityType: "status_change",
      title: `🔄 ${agent.name} mudou para ${newStatus}`,
      description: `Status anterior: ${agent.status}`,
      metadata: JSON.stringify({ newStatus, oldStatus: agent.status }),
    });

    this.io.emit("ecosystem:activity", event);
    console.log(`[NEXUS] ${agent.name} mudou para ${newStatus}`);
  }

  /**
   * Obtém lista de agentes conectados
   */
  getConnectedAgents(): string[] {
    return Array.from(this.agentSockets.keys());
  }

  /**
   * Obtém socket ID de um agente
   */
  getAgentSocket(agentId: string): string | undefined {
    return this.agentSockets.get(agentId);
  }

  /**
   * Emite evento para todos os clientes
   */
  broadcast(eventType: string, data: any) {
    this.io.emit(eventType, {
      type: eventType,
      timestamp: Date.now(),
      data,
    });
  }

  /**
   * Emite evento para um agente específico
   */
  emitToAgent(agentId: string, eventType: string, data: any) {
    const socketId = this.agentSockets.get(agentId);
    if (socketId) {
      this.io.to(socketId).emit(eventType, {
        type: eventType,
        timestamp: Date.now(),
        data,
      });
    }
  }
}
