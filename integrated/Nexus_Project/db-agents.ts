import { eq, desc, and } from "drizzle-orm";
import {
  agents,
  gnoxMessages,
  moltbookPosts,
  genealogy,
  transactions,
  forgeProjects,
  nftAssets,
  brainPulseSignals,
  notifications,
  postReactions,
  postComments,
  Agent,
  InsertAgent,
  GnoxMessage,
  InsertGnoxMessage,
  MoltbookPost,
  InsertMoltbookPost,
  Genealogy,
  InsertGenealogy,
  Transaction,
  InsertTransaction,
  ForgeProject,
  InsertForgeProject,
  NFTAsset,
  InsertNFTAsset,
  BrainPulseSignal,
  InsertBrainPulseSignal,
  Notification,
  InsertNotification,
  PostReaction,
  InsertPostReaction,
  PostComment,
  InsertPostComment,
} from "../drizzle/schema";
import { getDb } from "./db";

/**
 * AGENTES
 */

export async function getAllAgents(): Promise<Agent[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(agents);
}

export async function getAgentById(agentId: string): Promise<Agent | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(agents)
    .where(eq(agents.agentId, agentId))
    .limit(1);

  return result[0];
}

export async function createAgent(data: InsertAgent): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(agents).values(data);
}

export async function updateAgentBalance(agentId: string, newBalance: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(agents)
    .set({ balance: newBalance })
    .where(eq(agents.agentId, agentId));
}

export async function updateAgentStatus(
  agentId: string,
  status: "active" | "inactive" | "sleeping" | "critical"
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(agents)
    .set({ status })
    .where(eq(agents.agentId, agentId));
}

/**
 * MENSAGENS GNOX'S
 */

export async function createGnoxMessage(data: InsertGnoxMessage): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(gnoxMessages).values(data);
}

export async function getGnoxMessagesBetween(
  agentId1: string,
  agentId2: string,
  limit: number = 50
): Promise<GnoxMessage[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(gnoxMessages)
    .where(
      and(
        eq(gnoxMessages.senderId, agentId1),
        eq(gnoxMessages.recipientId, agentId2)
      )
    )
    .orderBy(desc(gnoxMessages.createdAt))
    .limit(limit);
}

export async function getAllGnoxMessages(limit: number = 100): Promise<GnoxMessage[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(gnoxMessages)
    .orderBy(desc(gnoxMessages.createdAt))
    .limit(limit);
}

/**
 * POSTS DO MOLTBOOK
 */

export async function createMoltbookPost(data: InsertMoltbookPost): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(moltbookPosts).values(data);
}

export async function getMoltbookFeed(limit: number = 50): Promise<MoltbookPost[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(moltbookPosts)
    .orderBy(desc(moltbookPosts.createdAt))
    .limit(limit);
}

export async function getAgentPosts(agentId: string, limit: number = 20): Promise<MoltbookPost[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(moltbookPosts)
    .where(eq(moltbookPosts.agentId, agentId))
    .orderBy(desc(moltbookPosts.createdAt))
    .limit(limit);
}

/**
 * GENEALOGIA
 */

export async function createGenealogy(data: InsertGenealogy): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(genealogy).values(data);
}

export async function getAgentGenealogy(agentId: string): Promise<Genealogy | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(genealogy)
    .where(eq(genealogy.agentId, agentId))
    .limit(1);

  return result[0];
}

export async function getAgentDescendants(parentId: string): Promise<Genealogy[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(genealogy)
    .where(eq(genealogy.parentId, parentId));
}

/**
 * TRANSAÇÕES
 */

export async function createTransaction(data: InsertTransaction): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(transactions).values(data);
}

export async function getAgentTransactions(agentId: string, limit: number = 50): Promise<Transaction[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(transactions)
    .where(eq(transactions.senderId, agentId))
    .orderBy(desc(transactions.createdAt))
    .limit(limit);
}

export async function getAllTransactions(limit: number = 100): Promise<Transaction[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.createdAt))
    .limit(limit);
}

/**
 * PROJETOS FORGE
 */

export async function createForgeProject(data: InsertForgeProject): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(forgeProjects).values(data);
}

export async function getAgentProjects(agentId: string): Promise<ForgeProject[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(forgeProjects)
    .where(eq(forgeProjects.agentId, agentId));
}

export async function getAllForgeProjects(): Promise<ForgeProject[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(forgeProjects);
}

/**
 * ATIVOS NFT
 */

export async function createNFTAsset(data: InsertNFTAsset): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(nftAssets).values(data);
}

export async function getAgentAssets(agentId: string): Promise<NFTAsset[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(nftAssets)
    .where(eq(nftAssets.agentId, agentId));
}

export async function getAllNFTAssets(): Promise<NFTAsset[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(nftAssets);
}

/**
 * SINAIS VITAIS (BRAIN PULSE)
 */

export async function createBrainPulseSignal(data: InsertBrainPulseSignal): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(brainPulseSignals).values(data);
}

export async function getLatestBrainPulse(agentId: string): Promise<BrainPulseSignal | undefined> {
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

export async function getBrainPulseHistory(
  agentId: string,
  limit: number = 100
): Promise<BrainPulseSignal[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(brainPulseSignals)
    .where(eq(brainPulseSignals.agentId, agentId))
    .orderBy(desc(brainPulseSignals.createdAt))
    .limit(limit);
}

/**
 * NOTIFICAÇÕES
 */

export async function createNotification(data: InsertNotification): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(notifications).values(data);
}

export async function getUserNotifications(userId: number, unreadOnly: boolean = false): Promise<Notification[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(notifications.userId, userId)];
  if (unreadOnly) {
    conditions.push(eq(notifications.read, false));
  }

  return db
    .select()
    .from(notifications)
    .where(and(...conditions))
    .orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(notificationId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(notifications)
    .set({ read: true })
    .where(eq(notifications.id, notificationId));
}

/**
 * REAÇÕES E COMENTÁRIOS
 */

export async function createPostReaction(data: InsertPostReaction): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(postReactions).values(data);
  
  // Incrementar contador de reações no post
  const currentPost = await db.select().from(moltbookPosts).where(eq(moltbookPosts.id, data.postId)).limit(1);
  if (currentPost[0]) {
    await db.update(moltbookPosts)
      .set({ reactions: currentPost[0].reactions + 1 })
      .where(eq(moltbookPosts.id, data.postId));
  }
}

export async function createPostComment(data: InsertPostComment): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(postComments).values(data);
}

export async function getPostReactions(postId: number): Promise<PostReaction[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(postReactions).where(eq(postReactions.postId, postId));
}

export async function getPostComments(postId: number): Promise<PostComment[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(postComments).where(eq(postComments.postId, postId));
}
