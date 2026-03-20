import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  createAgent,
  getAgent,
  getAgentVitals,
  updateAgentVitals,
} from "../db-helpers";
import { updateBrainPulse, generateDNAHash, fuseDNA } from "../business-logic";
import { getDb } from "../db";
import { agents, agentVitals } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const agentsRouter = router({
  /**
   * Criar um novo agente
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        specialization: z.string(),
        traits: z.record(z.string(), z.number()),
        parentId1: z.number().optional(),
        parentId2: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const dna: Record<string, unknown> = {
        name: input.name,
        specialization: input.specialization,
        traits: input.traits,
        timestamp: Date.now(),
      };

      const agent = await createAgent(
        ctx.user.id,
        input.name,
        input.description || "",
        dna,
        input.parentId1,
        input.parentId2
      );

      return agent;
    }),

  /**
   * Obter agente por ID
   */
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return getAgent(input);
    }),

  /**
   * Listar todos os agentes do usuário
   */
  listByUser: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      return db
        .select()
        .from(agents)
        .where(eq(agents.userId, ctx.user.id));
    }),

  /**
   * Obter sinais vitais de um agente
   */
  getVitals: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return getAgentVitals(input);
    }),

  /**
   * Atualizar sinais vitais de um agente
   */
  updateVitals: protectedProcedure
    .input(
      z.object({
        agentId: z.number(),
        activityLevel: z.number().min(0).max(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verificar se o agente pertence ao usuário
      const agent = await getAgent(input.agentId);
      if (!agent || agent.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const vitals = await getAgentVitals(input.agentId);
      if (!vitals) throw new Error("Agent vitals not found");

      const currentState = {
        health: Number(vitals.health),
        energy: Number(vitals.energy),
        engagement: Number(vitals.engagement),
        heartbeat: vitals.heartbeat,
      };

      const newState = updateBrainPulse(currentState, input.activityLevel);

      await updateAgentVitals(
        input.agentId,
        newState.health,
        newState.energy,
        newState.engagement,
        newState.heartbeat
      );

      return newState;
    }),

  /**
   * Fusionar DNA de dois agentes para criar um novo
   */
  fuseDNA: protectedProcedure
    .input(
      z.object({
        parentId1: z.number(),
        parentId2: z.number(),
        newAgentName: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const parent1 = await getAgent(input.parentId1);
      const parent2 = await getAgent(input.parentId2);

      if (!parent1 || !parent2) {
        throw new Error("Parent agents not found");
      }

      if (parent1.userId !== ctx.user.id || parent2.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const parentDNA1 = parent1.dna as any;
      const parentDNA2 = parent2.dna as any;

      const newDNA = fuseDNA(parentDNA1, parentDNA2);
      newDNA.name = input.newAgentName;

      const childDNA: Record<string, unknown> = {
        name: newDNA.name,
        specialization: newDNA.specialization,
        traits: newDNA.traits,
        timestamp: newDNA.timestamp,
      };

      const childAgent = await createAgent(
        ctx.user.id,
        input.newAgentName,
        `Child of ${parent1.name} and ${parent2.name}`,
        childDNA,
        input.parentId1,
        input.parentId2
      );

      return childAgent;
    }),
});
