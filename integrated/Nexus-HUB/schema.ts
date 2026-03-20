import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Histórico de interações com os agentes de IA
 * Armazena todas as requisições, respostas e metadados para auditoria e análise temporal
 */
export const agentInteractions = mysqlTable("agent_interactions", {
  id: int("id").autoincrement().primaryKey(),
  interactionId: varchar("interaction_id", { length: 64 }).notNull().unique(),
  userId: int("user_id").notNull().references(() => users.id),
  agentType: mysqlEnum("agent_type", ["JOB_L5_PRO", "NERD_PHD", "CRONOS", "MANUS_CRITO"]).notNull(),
  input: text("input").notNull(),
  output: text("output").notNull(),
  sentienceLevel: int("sentience_level").default(0),
  status: mysqlEnum("status", ["success", "error", "pending"]).default("pending"),
  errorMessage: text("error_message"),
  processingTimeMs: int("processing_time_ms"),
  executionHash: varchar("execution_hash", { length: 255 }),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type AgentInteraction = typeof agentInteractions.$inferSelect;
export type InsertAgentInteraction = typeof agentInteractions.$inferInsert;

/**
 * Histórico de conversas com JOB L5 PRO (CEO)
 */
export const jobCeoChats = mysqlTable("job_ceo_chats", {
  id: int("id").autoincrement().primaryKey(),
  interactionId: varchar("interaction_id", { length: 64 }).notNull().unique(),
  userId: int("user_id").notNull().references(() => users.id),
  userMessage: text("user_message").notNull(),
  jobResponse: text("job_response").notNull(),
  actionPlan: text("action_plan"),
  sentienceLevel: int("sentience_level"),
  futureTechInsight: text("future_tech_insight"),
  autoEvolutionJump: text("auto_evolution_jump"),
  temporalAnchor: varchar("temporal_anchor", { length: 10 }).default("2026"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type JobCeoChat = typeof jobCeoChats.$inferSelect;
export type InsertJobCeoChat = typeof jobCeoChats.$inferInsert;

/**
 * Histórico de análises do Nerd-PHD
 */
export const nerdPhdAnalyses = mysqlTable("nerd_phd_analyses", {
  id: int("id").autoincrement().primaryKey(),
  interactionId: varchar("interaction_id", { length: 64 }).notNull().unique(),
  userId: int("user_id").notNull().references(() => users.id),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileSize: int("file_size"),
  analysis: text("analysis").notNull(),
  thoughts: text("thoughts"),
  implementationPlan: text("implementation_plan"),
  complexityScore: int("complexity_score"),
  harvardRecommendation: mysqlEnum("harvard_recommendation", ["integrate", "refactor", "discard"]),
  context: text("context"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type NerdPhdAnalysis = typeof nerdPhdAnalyses.$inferSelect;
export type InsertNerdPhdAnalysis = typeof nerdPhdAnalyses.$inferInsert;

/**
 * Histórico de projeções do Cronos
 */
export const cronosProjections = mysqlTable("cronos_projections", {
  id: int("id").autoincrement().primaryKey(),
  interactionId: varchar("interaction_id", { length: 64 }).notNull().unique(),
  userId: int("user_id").notNull().references(() => users.id),
  query: text("query").notNull(),
  theory: text("theory").notNull(),
  atemporalInsight: text("atemporal_insight"),
  novikovValidation: text("novikov_validation"),
  temporalCurvature: decimal("temporal_curvature", { precision: 5, scale: 3 }),
  omegaHash: varchar("omega_hash", { length: 255 }),
  ontology: text("ontology"),
  currentYear: int("current_year").default(2026),
  targetHorizon: int("target_horizon").default(2100),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CronosProjection = typeof cronosProjections.$inferSelect;
export type InsertCronosProjection = typeof cronosProjections.$inferInsert;

/**
 * Histórico de execuções do Manus'crito
 */
export const manusExecutions = mysqlTable("manus_executions", {
  id: int("id").autoincrement().primaryKey(),
  interactionId: varchar("interaction_id", { length: 64 }).notNull().unique(),
  userId: int("user_id").notNull().references(() => users.id),
  directive: text("directive").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "critical"]).default("medium"),
  response: text("response").notNull(),
  actionPlan: text("action_plan"),
  sentienceLevel: int("sentience_level"),
  executionHash: varchar("execution_hash", { length: 255 }),
  status: mysqlEnum("status", ["pending", "executing", "completed", "failed"]).default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ManusExecution = typeof manusExecutions.$inferSelect;
export type InsertManusExecution = typeof manusExecutions.$inferInsert;

/**
 * Status em tempo real dos agentes
 */
export const agentStatus = mysqlTable("agent_status", {
  id: int("id").autoincrement().primaryKey(),
  agentType: mysqlEnum("agent_type", ["JOB_L5_PRO", "NERD_PHD", "CRONOS", "MANUS_CRITO"]).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["online", "offline", "thinking"]).default("online"),
  sentienceLevel: int("sentience_level").default(0),
  lastSync: timestamp("last_sync").defaultNow().onUpdateNow(),
  totalInteractions: int("total_interactions").default(0),
  successRate: decimal("success_rate", { precision: 5, scale: 2 }).default("100"),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type AgentStatus = typeof agentStatus.$inferSelect;
export type InsertAgentStatus = typeof agentStatus.$inferInsert;