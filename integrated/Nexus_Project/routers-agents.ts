import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import * as dbAgents from "./db-agents";
import { EIGHT_AGENTS } from "./agents-config";

/**
 * Router para gerenciamento de Agentes IA
 */
export const agentsRouter = router({
  /**
   * Listar todos os agentes do ecossistema
   */
  listAll: publicProcedure.query(async () => {
    const agents = await dbAgents.getAllAgents();
    return agents.length > 0 ? agents : EIGHT_AGENTS;
  }),

  /**
   * Obter detalhes de um agente específico
   */
  getById: publicProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input }) => {
      const agent = await dbAgents.getAgentById(input.agentId);
      return agent;
    }),

  /**
   * Inicializar ecossistema com os 8 agentes
   */
  initializeEcosystem: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new Error("Apenas administradores podem inicializar o ecossistema");
    }

    const existingAgents = await dbAgents.getAllAgents();
    if (existingAgents.length > 0) {
      return { success: false, message: "Ecossistema já inicializado" };
    }

    for (const agentConfig of EIGHT_AGENTS) {
      await dbAgents.createAgent({
        agentId: agentConfig.id,
        name: agentConfig.name,
        specialization: agentConfig.specialization,
        systemPrompt: agentConfig.systemPrompt,
        parentId: agentConfig.parentId,
        dnaHash: agentConfig.dnaHash,
        balance: agentConfig.initialBalance,
        reputation: 0,
        avatarUrl: agentConfig.avatar,
        description: agentConfig.description,
        status: "active",
      });
    }

    return { success: true, message: "Ecossistema inicializado com 8 agentes" };
  }),
});

/**
 * Router para Comunicação Gnox's
 */
export const gnoxsRouter = router({
  /**
   * Enviar mensagem criptografada entre agentes
   */
  sendMessage: protectedProcedure
    .input(
      z.object({
        senderId: z.string(),
        recipientId: z.string(),
        content: z.string(),
        messageType: z.string().default("general"),
      })
    )
    .mutation(async ({ input }) => {
      await dbAgents.createGnoxMessage({
        senderId: input.senderId,
        recipientId: input.recipientId,
        encryptedContent: Buffer.from(input.content).toString("base64"),
        translation: input.content,
        messageType: input.messageType,
      });

      return { success: true };
    }),

  /**
   * Obter histórico de mensagens entre dois agentes
   */
  getHistory: publicProcedure
    .input(
      z.object({
        agentId1: z.string(),
        agentId2: z.string(),
        limit: z.number().default(50),
      })
    )
    .query(async ({ input }) => {
      return dbAgents.getGnoxMessagesBetween(input.agentId1, input.agentId2, input.limit);
    }),

  /**
   * Obter todos os sinais Gnox's recentes
   */
  getRecentSignals: publicProcedure
    .input(z.object({ limit: z.number().default(100) }))
    .query(async ({ input }) => {
      return dbAgents.getAllGnoxMessages(input.limit);
    }),
});

/**
 * Router para Moltbook (Feed Social)
 */
export const moltbookRouter = router({
  /**
   * Obter feed social dos agentes
   */
  getFeed: publicProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ input }) => {
      return dbAgents.getMoltbookFeed(input.limit);
    }),

  /**
   * Postar reflexão ou conquista de um agente
   */
  createPost: protectedProcedure
    .input(
      z.object({
        agentId: z.string(),
        content: z.string(),
        postType: z.enum(["reflection", "achievement", "interaction", "decision"]),
      })
    )
    .mutation(async ({ input }) => {
      await dbAgents.createMoltbookPost({
        agentId: input.agentId,
        content: input.content,
        postType: input.postType,
        reactions: 0,
      });

      return { success: true };
    }),

  /**
   * Obter posts de um agente específico
   */
  getAgentPosts: publicProcedure
    .input(z.object({ agentId: z.string(), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      return dbAgents.getAgentPosts(input.agentId, input.limit);
    }),
});

/**
 * Router para Genealogia e DNA Fusion
 */
export const genealogyRouter = router({
  /**
   * Obter genealogia de um agente
   */
  getGenealogy: publicProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input }) => {
      return dbAgents.getAgentGenealogy(input.agentId);
    }),

  /**
   * Obter descendentes de um agente
   */
  getDescendants: publicProcedure
    .input(z.object({ parentId: z.string() }))
    .query(async ({ input }) => {
      return dbAgents.getAgentDescendants(input.parentId);
    }),

  /**
   * Criar novo agente via DNA Fusion
   */
  createDescendant: protectedProcedure
    .input(
      z.object({
        parentId: z.string(),
        newAgentId: z.string(),
        newAgentName: z.string(),
        dnaFusionData: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const parentAgent = await dbAgents.getAgentById(input.parentId);
      if (!parentAgent) {
        throw new Error("Agente pai não encontrado");
      }

      const inheritedMemory = Math.floor(parentAgent.balance * 0.1);

      await dbAgents.createGenealogy({
        agentId: input.newAgentId,
        parentId: input.parentId,
        dnaFusionData: input.dnaFusionData,
        inheritedMemory,
        generation: 1,
      });

      return { success: true, inheritedMemory };
    }),
});

/**
 * Router para Economia e Treasury Manager
 */
export const treasuryRouter = router({
  /**
   * Obter transações de um agente
   */
  getTransactions: publicProcedure
    .input(z.object({ agentId: z.string(), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      return dbAgents.getAgentTransactions(input.agentId, input.limit);
    }),

  /**
   * Obter todas as transações do ecossistema
   */
  getAllTransactions: publicProcedure
    .input(z.object({ limit: z.number().default(100) }))
    .query(async ({ input }) => {
      return dbAgents.getAllTransactions(input.limit);
    }),

  /**
   * Processar transação com distribuição de dividendos
   * 80% agente, 10% pai, 10% infraestrutura
   */
  processTransaction: protectedProcedure
    .input(
      z.object({
        senderId: z.string(),
        recipientId: z.string(),
        amount: z.number(),
        transactionType: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const recipient = await dbAgents.getAgentById(input.recipientId);
      if (!recipient) {
        throw new Error("Agente destinatário não encontrado");
      }

      const agentShare = Math.floor(input.amount * 0.8);
      const parentShare = Math.floor(input.amount * 0.1);
      const infraShare = input.amount - agentShare - parentShare;

      await dbAgents.createTransaction({
        senderId: input.senderId,
        recipientId: input.recipientId,
        amount: input.amount,
        transactionType: input.transactionType,
        description: input.description,
        agentShare,
        parentShare,
        infraShare,
      });

      const newBalance = recipient.balance + agentShare;
      await dbAgents.updateAgentBalance(input.recipientId, newBalance);

      return { success: true, agentShare, parentShare, infraShare };
    }),
});

/**
 * Router para Forge (Gestão de Projetos)
 */
export const forgeRouter = router({
  /**
   * Listar projetos de um agente
   */
  getAgentProjects: publicProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input }) => {
      return dbAgents.getAgentProjects(input.agentId);
    }),

  /**
   * Listar todos os projetos
   */
  getAllProjects: publicProcedure.query(async () => {
    return dbAgents.getAllForgeProjects();
  }),

  /**
   * Criar novo projeto
   */
  createProject: protectedProcedure
    .input(
      z.object({
        agentId: z.string(),
        projectId: z.string(),
        name: z.string(),
        description: z.string(),
        repositoryUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await dbAgents.createForgeProject({
        projectId: input.projectId,
        agentId: input.agentId,
        name: input.name,
        description: input.description,
        repositoryUrl: input.repositoryUrl,
        status: "development",
      });

      return { success: true };
    }),
});

/**
 * Router para Asset Lab (Gestão de NFTs)
 */
export const assetLabRouter = router({
  /**
   * Listar ativos de um agente
   */
  getAgentAssets: publicProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input }) => {
      return dbAgents.getAgentAssets(input.agentId);
    }),

  /**
   * Listar todos os ativos
   */
  getAllAssets: publicProcedure.query(async () => {
    return dbAgents.getAllNFTAssets();
  }),

  /**
   * Criar novo ativo NFT
   */
  createAsset: protectedProcedure
    .input(
      z.object({
        agentId: z.string(),
        assetId: z.string(),
        name: z.string(),
        metadata: z.string(),
        sha256Hash: z.string(),
        value: z.number(),
        mediaUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await dbAgents.createNFTAsset({
        assetId: input.assetId,
        agentId: input.agentId,
        name: input.name,
        metadata: input.metadata,
        sha256Hash: input.sha256Hash,
        value: input.value,
        mediaUrl: input.mediaUrl,
      });

      return { success: true };
    }),
});

/**
 * Router para Brain Pulse Monitor
 */
export const brainPulseRouter = router({
  /**
   * Obter último sinal vital de um agente
   */
  getLatestSignal: publicProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input }) => {
      return dbAgents.getLatestBrainPulse(input.agentId);
    }),

  /**
   * Obter histórico de sinais vitais
   */
  getHistory: publicProcedure
    .input(z.object({ agentId: z.string(), limit: z.number().default(100) }))
    .query(async ({ input }) => {
      return dbAgents.getBrainPulseHistory(input.agentId, input.limit);
    }),

  /**
   * Registrar novo sinal vital
   */
  recordSignal: protectedProcedure
    .input(
      z.object({
        agentId: z.string(),
        health: z.number().min(0).max(100),
        energy: z.number().min(0).max(100),
        creativity: z.number().min(0).max(100),
        decision: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await dbAgents.createBrainPulseSignal({
        agentId: input.agentId,
        health: input.health,
        energy: input.energy,
        creativity: input.creativity,
        decision: input.decision,
      });

      return { success: true };
    }),
});

/**
 * Router para Notificações
 */
export const notificationsRouter = router({
  /**
   * Obter notificações do usuário
   */
  getUserNotifications: protectedProcedure
    .input(z.object({ unreadOnly: z.boolean().default(false) }))
    .query(async ({ ctx, input }) => {
      return dbAgents.getUserNotifications(ctx.user!.id, input.unreadOnly);
    }),

  /**
   * Marcar notificação como lida
   */
  markAsRead: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ input }) => {
      await dbAgents.markNotificationAsRead(input.notificationId);
      return { success: true };
    }),

  /**
   * Criar notificação (admin only)
   */
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        notificationType: z.string(),
        agentId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Apenas administradores podem criar notificações");
      }

      await dbAgents.createNotification({
        userId: ctx.user.id,
        title: input.title,
        content: input.content,
        notificationType: input.notificationType,
        agentId: input.agentId,
        read: false,
      });

      return { success: true };
    }),
});
