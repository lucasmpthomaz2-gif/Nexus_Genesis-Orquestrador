import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getGenesisInstance } from "./nexus-genesis";
import {
  getRecentEvents,
  getRecentCommands,
  getLatestHomeostaseMetric,
  getRecentGenesisExperiences,
  getRecentTsraSyncLogs,
  getOrchestrationStats,
} from "./orchestration";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Orquestração Nexus Genesis
  orchestration: router({
    receberEvento: publicProcedure
      .input(
        z.object({
          origem: z.string(),
          tipo: z.string(),
          dados: z.record(z.string(), z.any()),
        })
      )
      .mutation(async ({ input }) => {
        const genesis = getGenesisInstance();
        return genesis.receberEvento(input.origem, input.tipo, input.dados);
      }),

    getStatus: publicProcedure.query(async () => {
      const genesis = getGenesisInstance();
      return genesis.getStatus();
    }),

    getNucleos: publicProcedure.query(async () => {
      const genesis = getGenesisInstance();
      return genesis.getNucleos();
    }),

    atualizarNucleo: publicProcedure
      .input(
        z.object({
          nome: z.string(),
          dados: z.record(z.string(), z.any()),
        })
      )
      .mutation(async ({ input }) => {
        const genesis = getGenesisInstance();
        genesis.atualizarNucleo(input.nome, input.dados);
        return { success: true };
      }),

    getRecentEvents: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return getRecentEvents(input?.limit || 50);
      }),

    getRecentCommands: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return getRecentCommands(input?.limit || 50);
      }),

    getLatestHomeostase: publicProcedure.query(async () => {
      return getLatestHomeostaseMetric();
    }),

    getRecentExperiences: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return getRecentGenesisExperiences(input?.limit || 20);
      }),

    getRecentTsraLogs: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return getRecentTsraSyncLogs(input?.limit || 50);
      }),

    getOrchestrationStats: publicProcedure.query(async () => {
      return getOrchestrationStats();
    }),
  }),
});

export type AppRouter = typeof appRouter;
