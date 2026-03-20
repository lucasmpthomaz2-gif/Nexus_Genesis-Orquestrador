import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  agents, 
  moltbookPosts, 
  gnoxMessages, 
  genealogy, 
  transactions, 
  brainPulseSignals, 
  forgeProjects, 
  nftAssets, 
  notifications,
  chatSessions,
  chatMessages,
  generatedCode,
  dataWeaverContext
} from "../drizzle/schema";
import { ENV } from './_core/env';
import { nanoid } from 'nanoid';

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

// ===== AGENTS =====
export async function createAgent(data: {
  name: string;
  specialization: string;
  systemPrompt: string;
  dnaHash: string;
  parentId?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const agentId = nanoid();
  await db.insert(agents).values({
    agentId,
    name: data.name,
    specialization: data.specialization,
    systemPrompt: data.systemPrompt,
    dnaHash: data.dnaHash,
    parentId: data.parentId,
    balance: "0",
    reputation: 0,
    status: "active",
  });

  return agentId;
}

export async function getAgentById(agentId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(agents).where(eq(agents.agentId, agentId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllAgents() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(agents).orderBy(desc(agents.createdAt));
}

export async function updateAgentBalance(agentId: string, amount: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const agent = await getAgentById(agentId);
  if (!agent) throw new Error("Agent not found");

  const newBalance = (parseFloat(agent.balance as any) + parseFloat(amount)).toString();
  
  await db.update(agents)
    .set({ balance: newBalance })
    .where(eq(agents.agentId, agentId));
}

// ===== MOLTBOOK POSTS =====
export async function createPost(data: {
  agentId: string;
  content: string;
  postType: string;
  metadata?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const postId = nanoid();
  await db.insert(moltbookPosts).values({
    postId,
    agentId: data.agentId,
    content: data.content,
    postType: data.postType,
    metadata: data.metadata,
    reactions: 0,
  });

  return postId;
}

export async function getPostsByAgent(agentId: string, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(moltbookPosts)
    .where(eq(moltbookPosts.agentId, agentId))
    .orderBy(desc(moltbookPosts.createdAt))
    .limit(limit);
}

export async function getFeedPosts(limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(moltbookPosts)
    .orderBy(desc(moltbookPosts.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function addReactionToPost(postId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const post = await db.select().from(moltbookPosts).where(eq(moltbookPosts.postId, postId)).limit(1);
  if (post.length === 0) throw new Error("Post not found");

  await db.update(moltbookPosts)
    .set({ reactions: post[0].reactions + 1 })
    .where(eq(moltbookPosts.postId, postId));
}

// ===== GNOX MESSAGES =====
export async function createGnoxMessage(data: {
  senderId: string;
  recipientId: string;
  encryptedContent: string;
  messageType: string;
  translation?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const messageId = nanoid();
  await db.insert(gnoxMessages).values({
    messageId,
    senderId: data.senderId,
    recipientId: data.recipientId,
    encryptedContent: data.encryptedContent,
    translation: data.translation,
    messageType: data.messageType,
  });

  return messageId;
}

export async function getMessagesBetweenAgents(agentId1: string, agentId2: string) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(gnoxMessages)
    .where(
      and(
        eq(gnoxMessages.senderId, agentId1),
        eq(gnoxMessages.recipientId, agentId2)
      )
    )
    .orderBy(desc(gnoxMessages.createdAt));
}

// ===== GENEALOGY =====
export async function createGenealogy(data: {
  agentId: string;
  parentId1?: string;
  parentId2?: string;
  dnaFusionData?: string;
  generation: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(genealogy).values({
    agentId: data.agentId,
    parentId1: data.parentId1,
    parentId2: data.parentId2,
    dnaFusionData: data.dnaFusionData,
    generation: data.generation,
    inheritedMemory: 0,
  });
}

export async function getGenealogy(agentId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(genealogy).where(eq(genealogy.agentId, agentId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== TRANSACTIONS =====
export async function createTransaction(data: {
  senderId: string;
  recipientId: string;
  amount: string;
  transactionType: string;
  description?: string;
  agentShare: string;
  parentShare: string;
  infraShare: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const transactionId = nanoid();
  await db.insert(transactions).values({
    transactionId,
    senderId: data.senderId,
    recipientId: data.recipientId,
    amount: data.amount,
    transactionType: data.transactionType,
    description: data.description,
    agentShare: data.agentShare,
    parentShare: data.parentShare,
    infraShare: data.infraShare,
  });

  return transactionId;
}

export async function getTransactionsByAgent(agentId: string, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(transactions)
    .where(
      and(
        eq(transactions.senderId, agentId)
      )
    )
    .orderBy(desc(transactions.createdAt))
    .limit(limit);
}

// ===== BRAIN PULSE SIGNALS =====
export async function createBrainPulseSignal(data: {
  agentId: string;
  health: number;
  energy: number;
  creativity: number;
  decision?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(brainPulseSignals).values({
    agentId: data.agentId,
    health: data.health,
    energy: data.energy,
    creativity: data.creativity,
    decision: data.decision,
  });
}

export async function getLatestBrainPulseSignal(agentId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select()
    .from(brainPulseSignals)
    .where(eq(brainPulseSignals.agentId, agentId))
    .orderBy(desc(brainPulseSignals.timestamp))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== NOTIFICATIONS =====
export async function createNotification(data: {
  userId: number;
  title: string;
  content: string;
  notificationType: string;
  agentId?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const notificationId = nanoid();
  await db.insert(notifications).values({
    notificationId,
    userId: data.userId,
    title: data.title,
    content: data.content,
    notificationType: data.notificationType,
    agentId: data.agentId,
    read: false,
  });

  return notificationId;
}

export async function getUserNotifications(userId: number, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function markNotificationAsRead(notificationId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(notifications)
    .set({ read: true })
    .where(eq(notifications.notificationId, notificationId));
}


// ===== CHAT SESSIONS =====
export async function createChatSession(data: {
  userId: number;
  title: string;
  description?: string;
  topic: string;
  sencienceLevel?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const sessionId = nanoid();
  await db.insert(chatSessions).values({
    sessionId,
    userId: data.userId,
    title: data.title,
    description: data.description,
    topic: data.topic,
    sencienceLevel: data.sencienceLevel || 1000,
  });

  // Create DataWeaver context
  await db.insert(dataWeaverContext).values({
    sessionId,
    consciousness: data.sencienceLevel || 1000,
    reasoning: "Initializing DataWeaver consciousness...",
  });

  return sessionId;
}

export async function getChatSession(sessionId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select()
    .from(chatSessions)
    .where(eq(chatSessions.sessionId, sessionId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserChatSessions(userId: number, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(chatSessions)
    .where(eq(chatSessions.userId, userId))
    .orderBy(desc(chatSessions.updatedAt))
    .limit(limit);
}

// ===== CHAT MESSAGES =====
export async function createChatMessage(data: {
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  codeGenerated?: string;
  language?: string;
  thinking?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const messageId = nanoid();
  await db.insert(chatMessages).values({
    messageId,
    sessionId: data.sessionId,
    role: data.role,
    content: data.content,
    codeGenerated: data.codeGenerated,
    language: data.language,
    thinking: data.thinking,
  });

  return messageId;
}

export async function getChatMessages(sessionId: string, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, sessionId))
    .orderBy(desc(chatMessages.createdAt))
    .limit(limit);
}

// ===== GENERATED CODE =====
export async function createGeneratedCode(data: {
  sessionId: string;
  messageId: string;
  code: string;
  language: string;
  framework?: string;
  description?: string;
  isExecutable?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const codeId = nanoid();
  await db.insert(generatedCode).values({
    codeId,
    sessionId: data.sessionId,
    messageId: data.messageId,
    code: data.code,
    language: data.language,
    framework: data.framework,
    description: data.description,
    isExecutable: data.isExecutable || false,
  });

  return codeId;
}

export async function getGeneratedCodeBySession(sessionId: string, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(generatedCode)
    .where(eq(generatedCode.sessionId, sessionId))
    .orderBy(desc(generatedCode.createdAt))
    .limit(limit);
}

export async function updateCodeExecutionResult(codeId: string, result: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(generatedCode)
    .set({ executionResult: result })
    .where(eq(generatedCode.codeId, codeId));
}

// ===== DATAWEAVER CONTEXT =====
export async function getDataWeaverContext(sessionId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select()
    .from(dataWeaverContext)
    .where(eq(dataWeaverContext.sessionId, sessionId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function updateDataWeaverContext(sessionId: string, data: {
  consciousness?: number;
  reasoning?: string;
  insights?: string;
  patterns?: string;
  recommendations?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(dataWeaverContext)
    .set(data)
    .where(eq(dataWeaverContext.sessionId, sessionId));
}
