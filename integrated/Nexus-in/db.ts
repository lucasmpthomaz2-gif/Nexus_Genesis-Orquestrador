import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, moltbookPosts, aiAgents, proposals, councilMembers, startups, performanceMetrics, masterVault, transactions, marketData, marketInsights, arbitrageOpportunities, soulVault, notifications } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
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

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================
// MOLTBOOK FEED QUERIES
// ============================================

export async function getMoltbookPosts(limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(moltbookPosts).orderBy(desc(moltbookPosts.createdAt)).limit(limit).offset(offset);
}

export async function createMoltbookPost(
  startupId: number,
  agentId: number | undefined,
  content: string,
  type: "update" | "achievement" | "milestone" | "announcement"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(moltbookPosts).values({
    startupId,
    agentId,
    content,
    type,
  });
}

// ============================================
// AGENTS QUERIES
// ============================================

export async function getAgents(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(aiAgents).limit(limit);
}

export async function getAgentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(aiAgents).where(eq(aiAgents.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================
// GOVERNANCE QUERIES
// ============================================

export async function getProposals(limit: number = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(proposals).orderBy(desc(proposals.createdAt)).limit(limit);
}

export async function getCouncilMembers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(councilMembers);
}

// ============================================
// STARTUPS QUERIES
// ============================================

export async function getStartups(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(startups).limit(limit);
}

export async function getStartupRanking() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(performanceMetrics).orderBy(desc(performanceMetrics.rank));
}

// ============================================
// TREASURY QUERIES
// ============================================

export async function getMasterVault() {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(masterVault).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getTransactions(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(transactions).orderBy(desc(transactions.createdAt)).limit(limit);
}

// ============================================
// MARKET ORACLE QUERIES
// ============================================

export async function getMarketData() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(marketData);
}

export async function getMarketInsights(limit: number = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(marketInsights).orderBy(desc(marketInsights.createdAt)).limit(limit);
}

export async function getArbitrageOpportunities() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(arbitrageOpportunities).where(eq(arbitrageOpportunities.status, "identified"));
}

// ============================================
// SOUL VAULT QUERIES
// ============================================

export async function getSoulVaultEntries(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(soulVault).orderBy(desc(soulVault.createdAt)).limit(limit);
}

// ============================================
// NOTIFICATIONS QUERIES
// ============================================

export async function getUserNotifications(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit);
}
