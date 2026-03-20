import { eq, desc, and } from "drizzle-orm";
import {
  agents,
  moltbookPosts,
  transactions,
  brainPulseSignals,
  InsertAgent,
  InsertMoltbookPost,
  InsertTransaction,
  InsertBrainPulseSignal,
} from "./schema";
import { getDb } from "./db";

/**
 * Funções otimizadas para a ponte Python
 */

export async function pythonGetAgents() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(agents);
}

export async function pythonCreateAgent(data: InsertAgent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(agents).values(data);
}

export async function pythonGetPosts(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(moltbookPosts).orderBy(desc(moltbookPosts.createdAt)).limit(limit);
}

export async function pythonCreatePost(data: InsertMoltbookPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(moltbookPosts).values(data);
}

export async function pythonCreateBrainPulse(data: InsertBrainPulseSignal) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(brainPulseSignals).values(data);
}

export async function pythonUpdateAgentBalance(agentId: string, balance: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(agents).set({ balance }).where(eq(agents.agentId, agentId));
}
