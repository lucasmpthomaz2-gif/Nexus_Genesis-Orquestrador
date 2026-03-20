import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  getMoltbookPosts, 
  createMoltbookPost, 
  getAgents, 
  getAgentById,
  getProposals,
  getCouncilMembers,
  getStartups,
  getStartupRanking,
  getMasterVault,
  getTransactions,
  getMarketData,
  getMarketInsights,
  getArbitrageOpportunities,
  getSoulVaultEntries,
  getUserNotifications
} from "./db";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============================================
  // MOLTBOOK FEED ROUTER
  // ============================================
  moltbook: router({
    getPosts: publicProcedure
      .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        return getMoltbookPosts(input.limit, input.offset);
      }),

    createPost: protectedProcedure
      .input(z.object({
        startupId: z.number(),
        agentId: z.number().optional(),
        content: z.string().min(1),
        type: z.enum(["update", "achievement", "milestone", "announcement"]),
      }))
      .mutation(async ({ input }) => {
        return createMoltbookPost(input.startupId, input.agentId, input.content, input.type);
      }),

    likePost: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .mutation(async ({ input }) => {
        // TODO: Implement like functionality with WebSocket event
        return { success: true };
      }),

    addComment: protectedProcedure
      .input(z.object({ postId: z.number(), content: z.string() }))
      .mutation(async ({ input }) => {
        // TODO: Implement comment functionality with WebSocket event
        return { success: true };
      }),
  }),

  // ============================================
  // AGENTS ROUTER
  // ============================================
  agents: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ input }) => {
        return getAgents(input.limit);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getAgentById(input.id);
      }),

    getConnections: publicProcedure
      .input(z.object({ agentId: z.number() }))
      .query(async ({ input }) => {
        // TODO: Implement agent connections query
        return [];
      }),
  }),

  // ============================================
  // GOVERNANCE ROUTER
  // ============================================
  governance: router({
    getProposals: publicProcedure
      .input(z.object({ limit: z.number().default(20) }))
      .query(async ({ input }) => {
        return getProposals(input.limit);
      }),

    getCouncil: publicProcedure
      .query(async () => {
        return getCouncilMembers();
      }),

    vote: protectedProcedure
      .input(z.object({
        proposalId: z.number(),
        vote: z.enum(["yes", "no", "abstain"]),
        reasoning: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // TODO: Implement voting with WebSocket event
        return { success: true };
      }),
  }),

  // ============================================
  // STARTUPS ROUTER
  // ============================================
  startups: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ input }) => {
        return getStartups(input.limit);
      }),

    getRanking: publicProcedure
      .query(async () => {
        return getStartupRanking();
      }),
  }),

  // ============================================
  // TREASURY ROUTER
  // ============================================
  treasury: router({
    getVault: publicProcedure
      .query(async () => {
        return getMasterVault();
      }),

    getTransactions: publicProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ input }) => {
        return getTransactions(input.limit);
      }),
  }),

  // ============================================
  // MARKET ORACLE ROUTER
  // ============================================
  market: router({
    getData: publicProcedure
      .query(async () => {
        return getMarketData();
      }),

    getInsights: publicProcedure
      .input(z.object({ limit: z.number().default(20) }))
      .query(async ({ input }) => {
        return getMarketInsights(input.limit);
      }),

    getArbitrage: publicProcedure
      .query(async () => {
        return getArbitrageOpportunities();
      }),
  }),

  // ============================================
  // SOUL VAULT ROUTER
  // ============================================
  soulVault: router({
    getEntries: publicProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ input }) => {
        return getSoulVaultEntries(input.limit);
      }),

    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        // TODO: Implement search functionality
        return [];
      }),
  }),

  // ============================================
  // NOTIFICATIONS ROUTER
  // ============================================
  notifications: router({
    getHistory: protectedProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ input, ctx }) => {
        return getUserNotifications(ctx.user.id, input.limit);
      }),

    subscribe: protectedProcedure
      .query(async () => {
        // TODO: Implement WebSocket subscription
        return { subscribed: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
