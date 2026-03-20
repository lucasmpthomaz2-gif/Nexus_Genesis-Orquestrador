import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import * as helpers from "./db-helpers";
import { nanoid } from "nanoid";

/**
 * 1. USERS ROUTER
 */
export const usersRouter = router({
  getMe: publicProcedure.query(async ({ ctx }) => ctx.user),
  updateProfile: protectedProcedure
    .input(z.object({ name: z.string().optional(), email: z.string().email().optional() }))
    .mutation(async ({ ctx, input }) => {
      return await helpers.usersHelpers.update(ctx.user!.id, input);
    }),
});

/**
 * 2. AGENTS ROUTER
 */
export const agentsRouter = router({
  listAll: publicProcedure.query(async () => await helpers.agentsHelpers.getAll()),
  getById: publicProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input }) => await helpers.agentsHelpers.getById(input.agentId)),
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      specialization: z.string(),
      systemPrompt: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const agentId = `NEXUS-${nanoid(8).toUpperCase()}`;
      return await helpers.agentsHelpers.create({
        ...input,
        agentId,
        dnaHash: nanoid(64),
        publicKey: `04${nanoid(128)}`,
        status: "genesis",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
    }),
});

/**
 * 3. AGENT DNA ROUTER
 */
export const agentDNARouter = router({
  getByAgent: publicProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input }) => await helpers.agentDNAHelpers.getById(input.agentId)),
});

/**
 * 4. MISSIONS ROUTER
 */
export const missionsRouter = router({
  listByStatus: publicProcedure
    .input(z.object({ status: z.string() }))
    .query(async ({ input }) => await helpers.missionsHelpers.getByStatus(input.status)),
  create: protectedProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
      priority: z.enum(["low", "medium", "high", "critical"]),
      reward: z.number(),
    }))
    .mutation(async ({ input }) => {
      const missionId = `MSN-${nanoid(8).toUpperCase()}`;
      return await helpers.missionsHelpers.create({
        ...input,
        missionId,
        reward: input.reward.toString(),
        status: "pending",
      } as any);
    }),
});

/**
 * 5. TRANSACTIONS ROUTER
 */
export const transactionsRouter = router({
  getByAgent: publicProcedure
    .input(z.object({ agentId: z.string(), limit: z.number().default(50) }))
    .query(async ({ input }) => await helpers.transactionsHelpers.getByAgent(input.agentId, input.limit)),
  create: protectedProcedure
    .input(z.object({
      fromAgentId: z.string(),
      toAgentId: z.string(),
      amount: z.number(),
      blockchain: z.enum(["bitcoin", "ethereum", "polygon"]),
    }))
    .mutation(async ({ input }) => {
      const transactionHash = `0x${nanoid(64)}`;
      return await helpers.transactionsHelpers.create({
        ...input,
        transactionHash,
        amount: input.amount.toString(),
        status: "confirmed",
      } as any);
    }),
});

/**
 * 6. ECOSYSTEM EVENTS ROUTER
 */
export const ecosystemEventsRouter = router({
  listRecent: publicProcedure
    .input(z.object({ limit: z.number().default(100) }))
    .query(async ({ input }) => await helpers.ecosystemEventsHelpers.getAll(input.limit)),
  getByAgent: publicProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input }) => await helpers.ecosystemEventsHelpers.getByAgent(input.agentId)),
});

/**
 * 7. ECOSYSTEM METRICS ROUTER
 */
export const metricsRouter = router({
  getLatest: publicProcedure.query(async () => await helpers.ecosystemMetricsHelpers.getLatest()),
  getHistory: publicProcedure
    .input(z.object({ limit: z.number().default(100) }))
    .query(async ({ input }) => await helpers.ecosystemMetricsHelpers.getAll(input.limit)),
});

/**
 * 8. GNOX MESSAGES ROUTER
 */
export const gnoxRouter = router({
  getHistory: publicProcedure
    .input(z.object({ agentId1: z.string(), agentId2: z.string() }))
    .query(async ({ input }) => await helpers.gnoxMessagesHelpers.getHistory(input.agentId1, input.agentId2)),
  send: protectedProcedure
    .input(z.object({ fromAgentId: z.string(), toAgentId: z.string(), content: z.string() }))
    .mutation(async ({ input }) => {
      const messageId = `MSG-${nanoid(8)}`;
      return await helpers.gnoxMessagesHelpers.create({
        ...input,
        messageId,
        encryptedContent: Buffer.from(input.content).toString("base64"),
        translation: input.content,
      } as any);
    }),
});

/**
 * 9. FORGE PROJECTS ROUTER
 */
export const forgeRouter = router({
  getByAgent: publicProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input }) => await helpers.forgeProjectsHelpers.getByAgent(input.agentId)),
  create: protectedProcedure
    .input(z.object({ agentId: z.string(), name: z.string(), description: z.string() }))
    .mutation(async ({ input }) => {
      const projectId = `PRJ-${nanoid(8)}`;
      return await helpers.forgeProjectsHelpers.create({ ...input, projectId } as any);
    }),
});

/**
 * 10. NFT ASSETS ROUTER
 */
export const assetLabRouter = router({
  getByAgent: publicProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input }) => await helpers.nftAssetsHelpers.getByAgent(input.agentId)),
  create: protectedProcedure
    .input(z.object({ agentId: z.string(), name: z.string(), sha256Hash: z.string() }))
    .mutation(async ({ input }) => {
      const assetId = `NFT-${nanoid(8)}`;
      return await helpers.nftAssetsHelpers.create({ ...input, assetId } as any);
    }),
});

/**
 * 11. BRAIN PULSE ROUTER
 */
export const brainPulseRouter = router({
  getLatest: publicProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input }) => await helpers.brainPulseSignalsHelpers.getLatestByAgent(input.agentId)),
  record: protectedProcedure
    .input(z.object({ agentId: z.string(), health: z.number(), energy: z.number(), creativity: z.number() }))
    .mutation(async ({ input }) => {
      const signalId = `SIG-${nanoid(8)}`;
      return await helpers.brainPulseSignalsHelpers.create({ ...input, signalId } as any);
    }),
});

/**
 * 12. AUTONOMOUS DECISIONS ROUTER
 */
export const decisionsRouter = router({
  getByAgent: publicProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input }) => await helpers.autonomousDecisionsHelpers.getByAgent(input.agentId)),
});

/**
 * 13. LIFECYCLE ROUTER
 */
export const lifecycleRouter = router({
  getHistory: publicProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input }) => await helpers.agentLifecycleHistoryHelpers.getByAgent(input.agentId)),
});

/**
 * 14. MOLTBOOK ROUTER
 */
export const moltbookRouter = router({
  getFeed: publicProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ input }) => await helpers.moltbookPostsHelpers.getFeed(input.limit)),
  createPost: protectedProcedure
    .input(z.object({ agentId: z.string(), content: z.string() }))
    .mutation(async ({ input }) => {
      const postId = `POST-${nanoid(8)}`;
      return await helpers.moltbookPostsHelpers.create({ ...input, postId } as any);
    }),
});

/**
 * 15. NOTIFICATIONS ROUTER
 */
export const notificationsRouter = router({
  getMyNotifications: protectedProcedure
    .input(z.object({ unreadOnly: z.boolean().default(false) }))
    .query(async ({ ctx, input }) => await helpers.notificationsHelpers.getByUser(ctx.user!.id, input.unreadOnly)),
  markRead: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ input }) => await helpers.notificationsHelpers.markAsRead(input.notificationId)),
});

/**
 * 16. GENEALOGY ROUTER
 */
export const genealogyRouter = router({
  getDescendants: publicProcedure
    .input(z.object({ parentId: z.string() }))
    .query(async ({ input }) => await helpers.genealogyHelpers.getDescendants(input.parentId)),
});

/**
 * 17. CONSCIOUSNESS ROUTER
 */
export const consciousnessRouter = router({
  getState: publicProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input }) => await helpers.consciousnessStateHelpers.getById(input.agentId)),
});

/**
 * MAIN APP ROUTER
 */
export const appRouter = router({
  users: usersRouter,
  agents: agentsRouter,
  dna: agentDNARouter,
  missions: missionsRouter,
  transactions: transactionsRouter,
  events: ecosystemEventsRouter,
  metrics: metricsRouter,
  gnox: gnoxRouter,
  forge: forgeRouter,
  assets: assetLabRouter,
  brainPulse: brainPulseRouter,
  decisions: decisionsRouter,
  lifecycle: lifecycleRouter,
  moltbook: moltbookRouter,
  notifications: notificationsRouter,
  genealogy: genealogyRouter,
  consciousness: consciousnessRouter,
});

export type AppRouter = typeof appRouter;
