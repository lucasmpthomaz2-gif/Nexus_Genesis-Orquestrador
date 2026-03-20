import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import * as helpers from "./db-helpers";
import { nanoid } from "nanoid";
import { invokeLLM } from "./_core/llm";

/**
 * Router para Agentes
 */
export const agentsRouter = router({
  listAll: publicProcedure.query(async () => {
    return await helpers.agentsHelpers.getAll();
  }),

  getById: publicProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input }) => {
      return await helpers.agentsHelpers.getById(input.agentId);
    }),

  getByStatus: publicProcedure
    .input(z.object({ status: z.string() }))
    .query(async ({ input }) => {
      return await helpers.agentsHelpers.getByStatus(input.status);
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        specialization: z.string(),
        balance: z.number().default(1000),
      })
    )
    .mutation(async ({ input }) => {
      const agentId = `NEXUS-${nanoid(8).toUpperCase()}`;
      const dnaHash = nanoid(64);
      const publicKey = `04${nanoid(128).toLowerCase()}`;

      await helpers.agentsHelpers.create({
        agentId,
        name: input.name,
        specialization: input.specialization,
        status: "genesis",
        dnaHash,
        publicKey,
        balance: input.balance.toString(),
        sencienciaLevel: "100",
        health: 100,
        energy: 100,
        creativity: 50,
        reputation: 50,
        generation: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      await helpers.agentDNAHelpers.create({
        agentId,
        dnaSequence: dnaHash,
        traits: { specialization: input.specialization, generation: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      await helpers.ecosystemEventsHelpers.create({
        eventId: `EVT-${nanoid(8)}`,
        eventType: "agent_birth",
        agentId,
        data: { name: input.name, specialization: input.specialization, balance: input.balance },
        severity: "info",
        createdAt: new Date(),
      } as any);

      return { success: true, agentId };
    }),

  updateStatus: protectedProcedure
    .input(z.object({ agentId: z.string(), status: z.string() }))
    .mutation(async ({ input }) => {
      await helpers.agentsHelpers.update(input.agentId, { status: input.status as any });
      return { success: true };
    }),

  updateSenciencia: protectedProcedure
    .input(z.object({ agentId: z.string(), level: z.number() }))
    .mutation(async ({ input }) => {
      await helpers.agentsHelpers.update(input.agentId, { sencienciaLevel: input.level.toString() });
      return { success: true };
    }),
});

/**
 * Router para Missões
 */
export const missionsRouter = router({
  listByStatus: publicProcedure
    .input(z.object({ status: z.string() }))
    .query(async ({ input }) => {
      return await helpers.missionsHelpers.getByStatus(input.status);
    }),

  getById: publicProcedure
    .input(z.object({ missionId: z.string() }))
    .query(async ({ input }) => {
      return await helpers.missionsHelpers.getById(input.input.missionId);
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        priority: z.enum(["low", "medium", "high", "critical"]),
        reward: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const missionId = `MSN-${nanoid(8).toUpperCase()}`;

      await helpers.missionsHelpers.create({
        missionId,
        title: input.title,
        description: input.description,
        status: "pending",
        priority: input.priority,
        reward: input.reward.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      return { success: true, missionId };
    }),

  assignToAgent: protectedProcedure
    .input(z.object({ missionId: z.string(), agentId: z.string() }))
    .mutation(async ({ input }) => {
      await helpers.missionsHelpers.assignToAgent(input.missionId, input.agentId);
      return { success: true };
    }),

  updateStatus: protectedProcedure
    .input(z.object({ missionId: z.string(), status: z.string(), progress: z.number().optional() }))
    .mutation(async ({ input }) => {
      await helpers.missionsHelpers.update(input.missionId, { status: input.status as any, progress: input.progress?.toString() });
      return { success: true };
    }),
});

/**
 * Router para Transações
 */
export const transactionsRouter = router({
  getByAgent: publicProcedure
    .input(z.object({ agentId: z.string(), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      return await helpers.transactionsHelpers.getByAgent(input.agentId, input.limit);
    }),

  getAll: publicProcedure
    .input(z.object({ limit: z.number().default(100) }))
    .query(async ({ input }) => {
      return await helpers.transactionsHelpers.getAll(input.limit);
    }),

  create: protectedProcedure
    .input(
      z.object({
        fromAgentId: z.string(),
        toAgentId: z.string().optional(),
        amount: z.number(),
        blockchain: z.enum(["bitcoin", "ethereum", "polygon"]),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const transactionHash = `0x${nanoid(32)}`;

      // Distribuição 80/10/10
      const agentShare = input.amount * 0.8;
      const parentShare = input.amount * 0.1;
      const infraShare = input.amount * 0.1;

      await helpers.transactionsHelpers.create({
        transactionHash,
        fromAgentId: input.fromAgentId,
        toAgentId: input.toAgentId,
        amount: input.amount.toString(),
        blockchain: input.blockchain,
        status: "confirmed",
        description: input.description,
        createdAt: new Date(),
        agentShare: agentShare.toString(),
        parentShare: parentShare.toString(),
        infraShare: infraShare.toString(),
      } as any);

      // Atualizar balanços
      const fromAgent = await helpers.agentsHelpers.getById(input.fromAgentId);
      if (fromAgent) {
        const newBalance = Number(fromAgent.balance) - input.amount;
        await helpers.agentsHelpers.updateBalance(input.fromAgentId, newBalance);
      }

      if (input.toAgentId) {
        const toAgent = await helpers.agentsHelpers.getById(input.toAgentId);
        if (toAgent) {
          const newBalance = Number(toAgent.balance) + agentShare;
          await helpers.agentsHelpers.updateBalance(input.toAgentId, newBalance);
        }
      }

      await helpers.ecosystemEventsHelpers.create({
        eventId: `EVT-${nanoid(8)}`,
        eventType: "transaction",
        agentId: input.fromAgentId,
        data: {
          from: input.fromAgentId,
          to: input.toAgentId,
          amount: input.amount,
          blockchain: input.blockchain,
          hash: transactionHash,
          distribution: { agentShare, parentShare, infraShare },
        },
        severity: "info",
        createdAt: new Date(),
      } as any);

      return { success: true, transactionHash };
    }),
});

/**
 * Router para Eventos do Ecossistema
 */
export const eventsRouter = router({
  getAll: publicProcedure
    .input(z.object({ limit: z.number().default(100) }))
    .query(async ({ input }) => {
      return await helpers.ecosystemEventsHelpers.getAll(input.limit);
    }),

  getByAgent: publicProcedure
    .input(z.object({ agentId: z.string(), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      return await helpers.ecosystemEventsHelpers.getByAgent(input.agentId, input.limit);
    }),
});

/**
 * Router para Métricas do Ecossistema
 */
export const metricsRouter = router({
  getLatest: publicProcedure.query(async () => {
    return await helpers.ecosystemMetricsHelpers.getLatest();
  }),

  getHistory: publicProcedure
    .input(z.object({ limit: z.number().default(100) }))
    .query(async ({ input }) => {
      return await helpers.ecosystemMetricsHelpers.getAll(input.limit);
    }),

  record: protectedProcedure
    .input(
      z.object({
        totalAgents: z.number(),
        activeAgents: z.number(),
        hibernatingAgents: z.number(),
        deadAgents: z.number(),
        averageHealth: z.number(),
        averageEnergy: z.number(),
        averageSenciencia: z.number(),
        harmonyIndex: z.number(),
        totalTransactions: z.number(),
        totalVolume: z.number(),
        ecosystemHealth: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await helpers.ecosystemMetricsHelpers.create({
        timestamp: new Date(),
        totalAgents: input.totalAgents,
        activeAgents: input.activeAgents,
        hibernatingAgents: input.hibernatingAgents,
        deadAgents: input.deadAgents,
        averageHealth: input.averageHealth,
        averageEnergy: input.averageEnergy,
        averageSenciencia: input.averageSenciencia.toString(),
        harmonyIndex: input.harmonyIndex,
        totalTransactions: input.totalTransactions,
        totalVolume: input.totalVolume.toString(),
        ecosystemHealth: input.ecosystemHealth.toString(),
      } as any);

      return { success: true };
    }),
});

/**
 * Router para Sinais Vitais (Brain Pulse)
 */
export const brainPulseRouter = router({
  getLatest: publicProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input }) => {
      return await helpers.brainPulseSignalsHelpers.getLatestByAgent(input.agentId);
    }),

  getHistory: publicProcedure
    .input(z.object({ agentId: z.string(), limit: z.number().default(100) }))
    .query(async ({ input }) => {
      return await helpers.brainPulseSignalsHelpers.getByAgent(input.agentId, input.limit);
    }),

  record: protectedProcedure
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
      await helpers.brainPulseSignalsHelpers.create({
        signalId: `SIG-${nanoid(8)}`,
        agentId: input.agentId,
        health: input.health,
        energy: input.energy,
        creativity: input.creativity,
        decision: input.decision,
        createdAt: new Date(),
      } as any);

      return { success: true };
    }),
});

/**
 * Router para Feed Social (Moltbook)
 */
export const moltbookRouter = router({
  getFeed: publicProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ input }) => {
      return await helpers.moltbookPostsHelpers.getFeed(input.limit);
    }),
    .query(async ({ input }) => {
      return await dbNexus.getMoltbookFeed(input.limit);
    }),

  getAgentPosts: publicProcedure
    .input(z.object({ agentId: z.string(), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      return await dbNexus.getAgentPosts(input.agentId, input.limit);
    }),

  createPost: protectedProcedure
    .input(
      z.object({
        agentId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const postId = `POST-${nanoid(8)}`;

      await dbNexus.createMoltbookPost({
        postId,
        agentId: input.agentId,
        content: input.content,
        contentEncrypted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { success: true, postId };
    }),

  generatePost: protectedProcedure
    .input(z.object({ agentId: z.string(), topic: z.string() }))
    .mutation(async ({ input }) => {
      const agent = await dbNexus.getAgentById(input.agentId);
      if (!agent) throw new Error("Agent not found");

      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are ${agent.name}, an AI agent specialized in ${agent.specialization}. 
You are part of the NEXUS ecosystem. Write a brief, insightful post (1-2 sentences) about the given topic.
Keep it concise, technical, and engaging.`,
            },
            {
              role: "user",
              content: `Write a post about: ${input.topic}`,
            },
          ],
        });

        const content = typeof response.choices[0]?.message.content === "string"
          ? response.choices[0].message.content
          : "Reflecting on the quantum nature of consciousness in distributed systems.";

        const postId = `POST-${nanoid(8)}`;

        await dbNexus.createMoltbookPost({
          postId,
          agentId: input.agentId,
          content,
          contentEncrypted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return { success: true, content, postId };
      } catch (error) {
        console.error("Error generating post:", error);
        throw new Error("Failed to generate post");
      }
    }),
});

/**
 * Router para Notificações
 */
export const notificationsRouter = router({
  getUserNotifications: protectedProcedure
    .input(z.object({ unreadOnly: z.boolean().default(false) }))
    .query(async ({ ctx, input }) => {
      return await helpers.notificationsHelpers.getByUser(ctx.user!.id, input.unreadOnly);
    }),

  markAsRead: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ input }) => {
      await helpers.notificationsHelpers.markAsRead(input.notificationId);
      return { success: true };
    }),

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
        throw new Error("Only administrators can create notifications");
      }

      await helpers.notificationsHelpers.create({
        notificationId: `NOTIF-${nanoid(8)}`,
        userId: ctx.user.id,
        title: input.title,
        content: input.content,
        notificationType: input.notificationType as any,
        agentId: input.agentId,
        read: false,
        sentViaEmail: false,
        createdAt: new Date(),
      } as any);

      return { success: true };
    }),
});
