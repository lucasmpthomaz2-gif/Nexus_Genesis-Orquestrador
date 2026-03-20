import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  gnoxAgents,
  agentWallets,
  blockchainTransactions,
  genealogyRecords,
  ecosystemEvents,
  brainPulseSignals,
  moltbookPosts,
  InsertGnoxAgent,
  InsertAgentWallet,
  InsertBlockchainTransaction,
  InsertGenealogyRecord,
  InsertEcosystemEvent,
  InsertBrainPulseSignal,
  InsertMoltbookPost,
} from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Operações de Banco de Dados para o Ecossistema Gnox
 */

// ============ AGENTES ============

export async function createGnoxAgent(data: InsertGnoxAgent): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(gnoxAgents).values(data);
}

export async function getGnoxAgentById(agentId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(gnoxAgents).where(eq(gnoxAgents.agentId, agentId)).limit(1);
  return result[0];
}

export async function getAllGnoxAgents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gnoxAgents);
}

export async function updateGnoxAgentStatus(agentId: string, status: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(gnoxAgents).set({ status: status as any }).where(eq(gnoxAgents.agentId, agentId));
}

export async function updateGnoxAgentBalance(agentId: string, newBalance: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(gnoxAgents).set({ balance: newBalance }).where(eq(gnoxAgents.agentId, agentId));
}

export async function updateGnoxAgentHealth(agentId: string, health: number, energy: number, creativity: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(gnoxAgents)
    .set({ health, energy, creativity, lastActivityAt: new Date() })
    .where(eq(gnoxAgents.agentId, agentId));
}

// ============ CARTEIRAS ============

export async function createAgentWallet(data: InsertAgentWallet): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(agentWallets).values(data);
}

export async function getAgentWallet(agentId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(agentWallets).where(eq(agentWallets.agentId, agentId)).limit(1);
  return result[0];
}

export async function updateAgentWalletBalance(agentId: string, bitcoinBalance: number, ethereumBalance: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const totalBalance = bitcoinBalance + ethereumBalance;
  await db
    .update(agentWallets)
    .set({
      bitcoinBalance,
      ethereumBalance,
      totalBalance,
      lastSyncAt: new Date(),
    })
    .where(eq(agentWallets.agentId, agentId));
}

// ============ TRANSAÇÕES BLOCKCHAIN ============

export async function createBlockchainTransaction(data: InsertBlockchainTransaction): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(blockchainTransactions).values(data);
}

export async function getBlockchainTransaction(txId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blockchainTransactions).where(eq(blockchainTransactions.txId, txId)).limit(1);
  return result[0];
}

export async function getAgentTransactions(agentId: string, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(blockchainTransactions)
    .where(eq(blockchainTransactions.recipientId, agentId))
    .orderBy(desc(blockchainTransactions.createdAt))
    .limit(limit);
}

export async function updateTransactionStatus(txId: string, status: string, confirmations: number = 0): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(blockchainTransactions)
    .set({
      status: status as any,
      confirmations,
      confirmedAt: status === "confirmed" ? new Date() : undefined,
    })
    .where(eq(blockchainTransactions.txId, txId));
}

// ============ GENEALOGIA ============

export async function createGenealogyRecord(data: InsertGenealogyRecord): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(genealogyRecords).values(data);
}

export async function getGenealogyRecord(agentId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(genealogyRecords).where(eq(genealogyRecords.agentId, agentId)).limit(1);
  return result[0];
}

export async function getAgentDescendants(parentId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genealogyRecords).where(eq(genealogyRecords.parentAId, parentId));
}

// ============ EVENTOS ============

export async function createEcosystemEvent(data: InsertEcosystemEvent): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(ecosystemEvents).values(data);
}

export async function getEcosystemEvents(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ecosystemEvents).orderBy(desc(ecosystemEvents.createdAt)).limit(limit);
}

export async function getAgentEvents(agentId: string, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(ecosystemEvents)
    .where(eq(ecosystemEvents.agentId, agentId))
    .orderBy(desc(ecosystemEvents.createdAt))
    .limit(limit);
}

// ============ SINAIS VITAIS ============

export async function createBrainPulseSignal(data: InsertBrainPulseSignal): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(brainPulseSignals).values(data);
}

export async function getLatestBrainPulse(agentId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(brainPulseSignals)
    .where(eq(brainPulseSignals.agentId, agentId))
    .orderBy(desc(brainPulseSignals.createdAt))
    .limit(1);
  return result[0];
}

export async function getBrainPulseHistory(agentId: string, limit: number = 100) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(brainPulseSignals)
    .where(eq(brainPulseSignals.agentId, agentId))
    .orderBy(desc(brainPulseSignals.createdAt))
    .limit(limit);
}

// ============ MOLTBOOK ============

export async function createMoltbookPost(data: InsertMoltbookPost): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(moltbookPosts).values(data);
}

export async function getMoltbookFeed(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(moltbookPosts).orderBy(desc(moltbookPosts.createdAt)).limit(limit);
}

export async function getAgentPosts(agentId: string, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(moltbookPosts)
    .where(eq(moltbookPosts.agentId, agentId))
    .orderBy(desc(moltbookPosts.createdAt))
    .limit(limit);
}

// ============ ESTATÍSTICAS ============

export async function getEcosystemStats() {
  const db = await getDb();
  if (!db) return null;

  const agents = await db.select().from(gnoxAgents);
  const activeAgents = agents.filter((a: any) => a.status === "active");
  const totalBalance = agents.reduce((sum: number, a: any) => sum + (a.balance || 0), 0);
  const avgHealth = agents.length > 0 ? Math.round(agents.reduce((sum: number, a: any) => sum + (a.health || 0), 0) / agents.length) : 0;
  const avgReputation = agents.length > 0 ? Math.round(agents.reduce((sum: number, a: any) => sum + (a.reputation || 0), 0) / agents.length) : 0;

  const transactions = await db.select().from(blockchainTransactions);
  const totalTransactionVolume = transactions.reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

  return {
    totalAgents: agents.length,
    activeAgents: activeAgents.length,
    hibernatingAgents: agents.filter((a: any) => a.status === "hibernating").length,
    deadAgents: agents.filter((a: any) => a.status === "dead").length,
    totalBalance,
    avgHealth,
    avgReputation,
    totalTransactions: transactions.length,
    totalTransactionVolume,
    lastUpdated: new Date(),
  };
}
