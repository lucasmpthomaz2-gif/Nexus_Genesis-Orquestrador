import { getDb } from "./db";
import {
  orchestrationEvents,
  orchestrationCommands,
  nucleusState,
  homeostaseMetrics,
  genesisExperiences,
  tsraSyncLog,
  InsertOrchestrationEvent,
  InsertOrchestrationCommand,
  InsertNucleusState,
  InsertHomeostaseMetric,
  InsertGenesisExperience,
  InsertTsraSyncLog,
} from "../drizzle/schema";

/**
 * Registra um evento de orquestração
 */
export async function recordOrchestrationEvent(
  event: InsertOrchestrationEvent
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Orchestration] Cannot record event: database not available");
    return;
  }

  try {
    await db.insert(orchestrationEvents).values(event);
  } catch (error) {
    console.error("[Orchestration] Failed to record event:", error);
    throw error;
  }
}

/**
 * Registra um comando de orquestração
 */
export async function recordOrchestrationCommand(
  command: InsertOrchestrationCommand
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Orchestration] Cannot record command: database not available");
    return;
  }

  try {
    await db.insert(orchestrationCommands).values(command);
  } catch (error) {
    console.error("[Orchestration] Failed to record command:", error);
    throw error;
  }
}

/**
 * Obtém eventos recentes
 */
export async function getRecentEvents(limit: number = 50) {
  const db = await getDb();
  if (!db) {
    console.warn("[Orchestration] Cannot get events: database not available");
    return [];
  }

  try {
    return await db
      .select()
      .from(orchestrationEvents)
      .orderBy(desc(orchestrationEvents.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("[Orchestration] Failed to get events:", error);
    return [];
  }
}

/**