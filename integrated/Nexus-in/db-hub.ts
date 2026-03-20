import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================
// COUNCIL MEMBERS
// ============================================

export async function getCouncilMembers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(schema.councilMembers);
}

export async function initializeCouncil() {
  const db = await getDb();
  if (!db) return;

  const members = [
    { name: "Architect Prime", role: "Chief Architect", votingPower: 3, specialization: "System Design" },
    { name: "Tech Oracle", role: "CTO", votingPower: 2, specialization: "Technology" },
    { name: "Market Sage", role: "CMO", votingPower: 2, specialization: "Marketing" },
    { name: "Finance Guardian", role: "CFO", votingPower: 2, specialization: "Finance" },
  ];

  for (const member of members) {
    await db.insert(schema.councilMembers).values(member);
  }
}

// ============================================
// STARTUPS
// ============================================

export async function getStartups() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(schema.startups);
}

export async function getCoreStartup() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(schema.startups).where(eq(schema.startups.isCore, true)).limit(1);
  return result[0] || null;
}

export async function getChallengerStartups() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(schema.startups).where(eq(schema.startups.isCore, false));
}

export async function createStartup(data: schema.InsertStartup) {
  const db = await getDb();
  if (!db) return;
  await db.insert(schema.startups).values(data);
}

export async function updateStartup(id: number, data: Partial<schema.InsertStartup>) {
  const db = await getDb();
  if (!db) return;
  await db.update(schema.startups).set(data).where(eq(schema.startups.id, id));
}

// ============================================
// AI AGENTS
// ============================================

export async function getAgentsByStartup(startupId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(schema.aiAgents).where(eq(schema.aiAgents.startupId, startupId));
}

export async function getAgentById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(schema.aiAgents).where(eq(schema.aiAgents.id, id)).limit(1);
  return result[0] || null;
}

export async function createAiAgent(data: schema.InsertAiAgent) {
  const db = await getDb();
  if (!db) return;
  await db.insert(schema.aiAgents).values(data);
}

export async function updateAiAgent(id: number, data: Partial<schema.InsertAiAgent>) {
  const db = await getDb();
  if (!db) return;
  await db.update(schema.aiAgents).set(data).where(eq(schema.aiAgents.id, id));
}

// ============================================
// PROPOSALS AND VOTES
// ============================================

export async function getOpenProposals() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(schema.proposals).where(eq(schema.proposals.status, "open"));
}

export async function getAllProposals() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(schema.proposals).orderBy(desc(schema.proposals.createdAt));
}

export async function createProposal(data: schema.InsertProposal) {
  const db = await getDb();
  if (!db) return;
  await db.insert(schema.proposals).values(data);
}

export async function recordVote(data: schema.InsertCouncilVote) {
  const db = await getDb();
  if (!db) return;
  await db.insert(schema.councilVotes).values(data);
}

export async function getProposalVotes(proposalId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(schema.councilVotes).where(eq(schema.councilVotes.proposalId, proposalId));
}

// ============================================
// MASTER VAULT & TRANSACTIONS
// ============================================

export async function getMasterVault() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(schema.masterVault);
  return result[0] || null;
}

export async function initializeMasterVault() {
  const db = await getDb();
  if (!db) return;
  const existing = await getMasterVault();
  if (!existing) {
    await db.insert(schema.masterVault).values({
      totalBalance: 1000000,
      btcReserve: 100,
      liquidityFund: 500000,
      infrastructureFund: 500000,
    });
  }
}

export async function getTransactions(limitCount: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(schema.transactions).orderBy(desc(schema.transactions.createdAt)).limit(limitCount);
}

export async function recordTransaction(data: schema.InsertTransaction) {
  const db = await getDb();
  if (!db) return;
  await db.insert(schema.transactions).values(data);
}

// ============================================
// MARKET DATA
// ============================================

export async function getLatestMarketData(asset: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(schema.marketData)
    .where(eq(schema.marketData.asset, asset))
    .orderBy(desc(schema.marketData.createdAt))
    .limit(1);
  return result[0] || null;
}

export async function recordMarketData(data: schema.InsertMarketData) {
  const db = await getDb();
  if (!db) return;
  await db.insert(schema.marketData).values(data);
}

// ============================================
// ARBITRAGE OPPORTUNITIES
// ============================================

export async function getOpenArbitrageOpportunities() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(schema.arbitrageOpportunities)
    .where(eq(schema.arbitrageOpportunities.status, "identified"));
}

export async function recordArbitrageOpportunity(data: schema.InsertArbitrageOpportunity) {
  const db = await getDb();
  if (!db) return;
  await db.insert(schema.arbitrageOpportunities).values(data);
}

// ============================================
// PERFORMANCE METRICS
// ============================================

export async function getStartupRanking() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(schema.performanceMetrics).orderBy(desc(schema.performanceMetrics.overallScore));
}

export async function recordPerformanceMetrics(data: schema.InsertPerformanceMetric) {
  const db = await getDb();
  if (!db) return;
  await db.insert(schema.performanceMetrics).values(data);
}

// ============================================
// SOUL VAULT
// ============================================

export async function getSoulVaultEntries(type?: string) {
  const db = await getDb();
  if (!db) return [];
  if (type) {
    return db.select().from(schema.soulVault).where(eq(schema.soulVault.type, type as any));
  }
  return db.select().from(schema.soulVault).orderBy(desc(schema.soulVault.createdAt));
}

export async function recordSoulVaultEntry(data: schema.InsertSoulVaultEntry) {
  const db = await getDb();
  if (!db) return;
  await db.insert(schema.soulVault).values(data);
}

// ============================================
// MOLTBOOK FEED
// ============================================

export async function getMoltbookFeed(limitCount: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(schema.moltbookPosts).orderBy(desc(schema.moltbookPosts.createdAt)).limit(limitCount);
}

export async function createMoltbookPost(data: schema.InsertMoltbookPost) {
  const db = await getDb();
  if (!db) return;
  await db.insert(schema.moltbookPosts).values(data);
}

// ============================================
// NOTIFICATIONS
// ============================================

export async function getUserNotifications(userId: number, unreadOnly: boolean = false) {
  const db = await getDb();
  if (!db) return [];
  if (unreadOnly) {
    return db
      .select()
      .from(schema.notifications)
      .where(eq(schema.notifications.userId, userId))
      .orderBy(desc(schema.notifications.createdAt));
  }
  return db
    .select()
    .from(schema.notifications)
    .where(eq(schema.notifications.userId, userId))
    .orderBy(desc(schema.notifications.createdAt));
}

export async function createNotification(data: schema.InsertNotification) {
  const db = await getDb();
  if (!db) return;
  await db.insert(schema.notifications).values(data);
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(schema.notifications).set({ read: true }).where(eq(schema.notifications.id, notificationId));
}

// ============================================
// AUDIT LOGS
// ============================================

export async function getAuditLogs(limitCount: number = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(schema.auditLogs).orderBy(desc(schema.auditLogs.createdAt)).limit(limitCount);
}

export async function recordAuditLog(data: schema.InsertAuditLog) {
  const db = await getDb();
  if (!db) return;
  await db.insert(schema.auditLogs).values(data);
}
