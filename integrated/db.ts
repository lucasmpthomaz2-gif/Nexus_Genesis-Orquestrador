import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
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

/**
 * Obtém eventos de orquestração recentes
 */
export async function getRecentOrchestrationEvents(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  try {
    const { orchestrationEvents } = await import("../drizzle/schema");
    const { desc } = await import("drizzle-orm");
    return await db
      .select()
      .from(orchestrationEvents)
      .orderBy(desc(orchestrationEvents.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("Erro ao obter eventos:", error);
    return [];
  }
}

/**
 * Obtém comandos orquestrados pendentes
 */
export async function getPendingCommands() {
  const db = await getDb();
  if (!db) return [];

  try {
    const { orchestrationCommands } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");
    return await db
      .select()
      .from(orchestrationCommands)
      .where(eq(orchestrationCommands.status, "pending"));
  } catch (error) {
    console.error("Erro ao obter comandos pendentes:", error);
    return [];
  }
}

/**
 * Obtém logs de sincronização TSRA recentes
 */
export async function getRecentTsraLogs(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  try {
    const { tsraSyncLog } = await import("../drizzle/schema");
    const { desc } = await import("drizzle-orm");
    return await db
      .select()
      .from(tsraSyncLog)
      .orderBy(desc(tsraSyncLog.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("Erro ao obter logs TSRA:", error);
    return [];
  }
}

/**
 * Obtém métricas de homeostase recentes
 */
export async function getRecentHomeostaseMetrics(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  try {
    const { homeostaseMetrics } = await import("../drizzle/schema");
    const { desc } = await import("drizzle-orm");
    return await db
      .select()
      .from(homeostaseMetrics)
      .orderBy(desc(homeostaseMetrics.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("Erro ao obter métricas de homeostase:", error);
    return [];
  }
}

// TODO: add feature queries here as your schema grows.
