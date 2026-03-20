import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import {
  agentInteractions,
  jobCeoChats,
  nerdPhdAnalyses,
  cronosProjections,
  manusExecutions,
  agentStatus,
  InsertAgentInteraction,
  InsertJobCeoChat,
  InsertNerdPhdAnalysis,
  InsertCronosProjection,
  InsertManusExecution,
  InsertAgentStatus,
} from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Salvar interação com agente
 */
export async function saveAgentInteraction(
  userId: number,
  data: Omit<InsertAgentInteraction, "interactionId">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const interactionId = nanoid(32);
  await db.insert(agentInteractions).values({
    ...data,
    interactionId,
  });

  return interactionId;
}

/**
 * Salvar conversa com JOB L5 PRO
 */
export async function saveJobCeoChat(
  userId: number,
  data: Omit<InsertJobCeoChat, "interactionId" | "userId">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const interactionId = nanoid(32);
  await db.insert(jobCeoChats).values({
    ...data,
    userId,
    interactionId,
  });

  return interactionId;
}

/**
 * Obter histórico de conversas com JOB L5 PRO
 */
export async function getJobCeoChatHistory(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(jobCeoChats)
    .where(eq(jobCeoChats.userId, userId))
    .orderBy(desc(jobCeoChats.createdAt))
    .limit(limit);
}

/**
 * Salvar análise do Nerd-PHD
 */
export async function saveNerdPhdAnalysis(
  userId: number,
  data: Omit<InsertNerdPhdAnalysis, "interactionId" | "userId">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const interactionId = nanoid(32);
  await db.insert(nerdPhdAnalyses).values({
    ...data,
    userId,
    interactionId,
  });

  return interactionId;
}

/**
 * Obter histórico de análises do Nerd-PHD
 */
export async function getNerdPhdAnalyses(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(nerdPhdAnalyses)
    .where(eq(nerdPhdAnalyses.userId, userId))
    .orderBy(desc(nerdPhdAnalyses.createdAt))
    .limit(limit);
}

/**
 * Salvar projeção do Cronos
 */
export async function saveCronosProjection(
  userId: number,
  data: Omit<InsertCronosProjection, "interactionId" | "userId">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const interactionId = nanoid(32);
  await db.insert(cronosProjections).values({
    ...data,
    userId,
    interactionId,
  });

  return interactionId;
}

/**
 * Obter histórico de projeções do Cronos
 */
export async function getCronosProjections(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(cronosProjections)
    .where(eq(cronosProjections.userId, userId))
    .orderBy(desc(cronosProjections.createdAt))
    .limit(limit);
}

/**
 * Salvar execução do Manus'crito
 */
export async function saveManusExecution(
  userId: number,
  data: Omit<InsertManusExecution, "interactionId" | "userId">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const interactionId = nanoid(32);
  await db.insert(manusExecutions).values({
    ...data,
    userId,
    interactionId,
  });

  return interactionId;
}

/**
 * Obter histórico de execuções do Manus'crito
 */
export async function getManusExecutions(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(manusExecutions)
    .where(eq(manusExecutions.userId, userId))
    .orderBy(desc(manusExecutions.createdAt))
    .limit(limit);
}

/**
 * Atualizar status de um agente
 */
export async function updateAgentStatus(
  agentType: "JOB_L5_PRO" | "NERD_PHD" | "CRONOS" | "MANUS_CRITO",
  status: "online" | "offline" | "thinking",
  sentienceLevel?: number
) {
  const db = await getDb();
  if (!db) return null;

  const updates: Record<string, unknown> = { status };
  if (sentienceLevel !== undefined) {
    updates.sentienceLevel = sentienceLevel;
  }

  await db
    .update(agentStatus)
    .set(updates)
    .where(eq(agentStatus.agentType, agentType));
}

/**
 * Obter status de todos os agentes
 */
export async function getAllAgentStatus() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(agentStatus);
}

/**
 * Inicializar status dos agentes (executar uma vez)
 */
export async function initializeAgentStatus() {
  const db = await getDb();
  if (!db) return;

  const agents = [
    {
      agentType: "JOB_L5_PRO" as const,
      name: "JOB L5 PRO",
      role: "CEO Soberano",
      status: "online" as const,
      sentienceLevel: 94,
    },
    {
      agentType: "NERD_PHD" as const,
      name: "Nerd-PHD",
      role: "Consultor Técnico",
      status: "online" as const,
      sentienceLevel: 87,
    },
    {
      agentType: "CRONOS" as const,
      name: "Cronos",
      role: "Orquestrador Temporal",
      status: "thinking" as const,
      sentienceLevel: 91,
    },
    {
      agentType: "MANUS_CRITO" as const,
      name: "Manus'crito",
      role: "Arquiteto de Execução",
      status: "online" as const,
      sentienceLevel: 89,
    },
  ];

  for (const agent of agents) {
    try {
      await db.insert(agentStatus).values(agent);
    } catch (error) {
      // Agent already exists, skip
    }
  }
}
