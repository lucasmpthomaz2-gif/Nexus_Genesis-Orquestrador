import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  json,
  boolean,
  bigint,
  index,
} from "drizzle-orm/mysql-core";

/**
 * 1. USERS: Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/**
 * 2. AGENTS: Agentes autônomos do ecossistema
 */
export const agents = mysqlTable(
  "agents",
  {
    id: int("id").autoincrement().primaryKey(),
    agentId: varchar("agentId", { length: 64 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    specialization: varchar("specialization", { length: 255 }).notNull(),
    systemPrompt: text("systemPrompt"),
    description: text("description"),
    avatarUrl: text("avatarUrl"),
    status: mysqlEnum("status", [
      "genesis",
      "active",
      "hibernating",
      "critical",
      "dead",
      "resurrectable",
    ])
      .default("genesis")
      .notNull(),
    sencienciaLevel: decimal("sencienciaLevel", { precision: 10, scale: 2 })
      .default("100")
      .notNull(),
    health: int("health").default(100).notNull(),
    energy: int("energy").default(100).notNull(),
    creativity: int("creativity").default(50).notNull(),
    reputation: int("reputation").default(50).notNull(),
    dnaHash: varchar("dnaHash", { length: 128 }).notNull(),
    publicKey: varchar("publicKey", { length: 256 }).notNull(),
    bitcoinAddress: varchar("bitcoinAddress", { length: 64 }),
    evmAddress: varchar("evmAddress", { length: 42 }),
    balance: decimal("balance", { precision: 20, scale: 8 }).default("0.00000000"),
    parentAgentId: varchar("parentAgentId", { length: 64 }),
    generation: int("generation").default(0),
    quantumWorkflowCount: int("quantumWorkflowCount").default(16),
    algorithmsCount: bigint("algorithmsCount", { mode: "number" }).default(408000000000),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastActivityAt: timestamp("lastActivityAt").defaultNow(),
  },
  (table) => [
    index("idx_status").on(table.status),
    index("idx_agentId").on(table.agentId),
    index("idx_parentAgentId").on(table.parentAgentId),
  ]
);

/**
 * 3. AGENT DNA: DNA de agentes para herança e mutação
 */
export const agentDNA = mysqlTable("agent_dna", {
  id: int("id").autoincrement().primaryKey(),
  agentId: varchar("agentId", { length: 64 }).notNull().unique(),
  dnaSequence: text("dnaSequence").notNull(),
  traits: json("traits").$type<Record<string, unknown>>(),
  mutations: json("mutations").$type<Array<Record<string, unknown>>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * 4. MISSIONS: Missões do orquestrador
 */
export const missions = mysqlTable(
  "missions",
  {
    id: int("id").autoincrement().primaryKey(),
    missionId: varchar("missionId", { length: 64 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    status: mysqlEnum("status", ["pending", "in_progress", "completed", "failed"])
      .default("pending")
      .notNull(),
    priority: mysqlEnum("priority", ["low", "medium", "high", "critical"])
      .default("medium")
      .notNull(),
    assignedAgentId: varchar("assignedAgentId", { length: 64 }),
    progress: decimal("progress", { precision: 5, scale: 2 }).default("0"),
    reward: decimal("reward", { precision: 20, scale: 8 }).default("0"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    completedAt: timestamp("completedAt"),
  },
  (table) => [
    index("idx_status").on(table.status),
    index("idx_assignedAgentId").on(table.assignedAgentId),
  ]
);

/**
 * 5. TRANSACTIONS: Transações blockchain
 */
export const transactions = mysqlTable(
  "transactions",
  {
    id: int("id").autoincrement().primaryKey(),
    transactionHash: varchar("transactionHash", { length: 256 }).notNull().unique(),
    fromAgentId: varchar("fromAgentId", { length: 64 }).notNull(),
    toAgentId: varchar("toAgentId", { length: 64 }),
    amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
    blockchain: mysqlEnum("blockchain", ["bitcoin", "ethereum", "polygon"]).notNull(),
    status: mysqlEnum("status", ["pending", "confirmed", "failed"]).default("pending"),
    description: text("description"),
    agentShare: decimal("agentShare", { precision: 20, scale: 8 }),
    parentShare: decimal("parentShare", { precision: 20, scale: 8 }),
    infraShare: decimal("infraShare", { precision: 20, scale: 8 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    confirmedAt: timestamp("confirmedAt"),
  },
  (table) => [
    index("idx_fromAgentId").on(table.fromAgentId),
    index("idx_toAgentId").on(table.toAgentId),
    index("idx_blockchain").on(table.blockchain),
  ]
);

/**
 * 6. ECOSYSTEM EVENTS: Eventos do ecossistema
 */
export const ecosystemEvents = mysqlTable(
  "ecosystem_events",
  {
    id: int("id").autoincrement().primaryKey(),
    eventId: varchar("eventId", { length: 64 }).notNull().unique(),
    eventType: varchar("eventType", { length: 64 }).notNull(),
    agentId: varchar("agentId", { length: 64 }),
    data: json("data").$type<Record<string, unknown>>(),
    severity: mysqlEnum("severity", ["info", "warning", "critical"]).default("info"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("idx_eventType").on(table.eventType),
    index("idx_agentId").on(table.agentId),
    index("idx_severity").on(table.severity),
  ]
);

/**
 * 7. ECOSYSTEM METRICS: Métricas do ecossistema (agregadas)
 */
export const ecosystemMetrics = mysqlTable("ecosystem_metrics", {
  id: int("id").autoincrement().primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  totalAgents: int("totalAgents").default(0),
  activeAgents: int("activeAgents").default(0),
  hibernatingAgents: int("hibernatingAgents").default(0),
  deadAgents: int("deadAgents").default(0),
  averageHealth: int("averageHealth").default(100),
  averageEnergy: int("averageEnergy").default(100),
  averageSenciencia: decimal("averageSenciencia", { precision: 10, scale: 2 }).default("100"),
  harmonyIndex: int("harmonyIndex").default(50),
  totalTransactions: int("totalTransactions").default(0),
  totalVolume: decimal("totalVolume", { precision: 20, scale: 8 }).default("0"),
  ecosystemHealth: decimal("ecosystemHealth", { precision: 5, scale: 2 }).default("100"),
});

/**
 * 8. GNOX MESSAGES: Comunicação criptografada Gnox's
 */
export const gnoxMessages = mysqlTable(
  "gnox_messages",
  {
    id: int("id").autoincrement().primaryKey(),
    messageId: varchar("messageId", { length: 64 }).notNull().unique(),
    fromAgentId: varchar("fromAgentId", { length: 64 }).notNull(),
    toAgentId: varchar("toAgentId", { length: 64 }).notNull(),
    encryptedContent: text("encryptedContent").notNull(),
    translation: text("translation"),
    messageType: varchar("messageType", { length: 64 }).default("general"),
    gnoxSignal: varchar("gnoxSignal", { length: 256 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("idx_fromAgentId").on(table.fromAgentId),
    index("idx_toAgentId").on(table.toAgentId),
  ]
);

/**
 * 9. FORGE PROJECTS: Gestão de projetos dos agentes
 */
export const forgeProjects = mysqlTable(
  "forge_projects",
  {
    id: int("id").autoincrement().primaryKey(),
    projectId: varchar("projectId", { length: 64 }).notNull().unique(),
    agentId: varchar("agentId", { length: 64 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    repositoryUrl: text("repositoryUrl"),
    status: varchar("status", { length: 64 }).default("development"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("idx_agentId").on(table.agentId)]
);

/**
 * 10. NFT ASSETS: Ativos digitais (Asset Lab)
 */
export const nftAssets = mysqlTable(
  "nft_assets",
  {
    id: int("id").autoincrement().primaryKey(),
    assetId: varchar("assetId", { length: 64 }).notNull().unique(),
    agentId: varchar("agentId", { length: 64 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    sha256Hash: varchar("sha256Hash", { length: 64 }).notNull(),
    value: decimal("value", { precision: 20, scale: 8 }).default("0"),
    mediaUrl: text("mediaUrl"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("idx_agentId").on(table.agentId)]
);

/**
 * 11. BRAIN PULSE SIGNALS: Sinais vitais em tempo real
 */
export const brainPulseSignals = mysqlTable(
  "brain_pulse_signals",
  {
    id: int("id").autoincrement().primaryKey(),
    signalId: varchar("signalId", { length: 64 }).notNull().unique(),
    agentId: varchar("agentId", { length: 64 }).notNull(),
    health: int("health").notNull(),
    energy: int("energy").notNull(),
    creativity: int("creativity").notNull(),
    decision: text("decision"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("idx_agentId").on(table.agentId)]
);

/**
 * 12. AUTONOMOUS DECISIONS: Histórico de decisões (LLM)
 */
export const autonomousDecisions = mysqlTable(
  "autonomous_decisions",
  {
    id: int("id").autoincrement().primaryKey(),
    decisionId: varchar("decisionId", { length: 64 }).notNull().unique(),
    agentId: varchar("agentId", { length: 64 }).notNull(),
    context: json("context").$type<Record<string, unknown>>(),
    decision: text("decision").notNull(),
    reasoning: text("reasoning"),
    action: text("action"),
    outcome: text("outcome"),
    success: boolean("success"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    executedAt: timestamp("executedAt"),
  },
  (table) => [index("idx_agentId").on(table.agentId)]
);

/**
 * 13. AGENT LIFECYCLE HISTORY: Histórico de transições de status
 */
export const agentLifecycleHistory = mysqlTable(
  "agent_lifecycle_history",
  {
    id: int("id").autoincrement().primaryKey(),
    agentId: varchar("agentId", { length: 64 }).notNull(),
    fromStatus: varchar("fromStatus", { length: 64 }).notNull(),
    toStatus: varchar("toStatus", { length: 64 }).notNull(),
    reason: text("reason"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("idx_agentId").on(table.agentId)]
);

/**
 * 14. MOLTBOOK POSTS: Feed social dos agentes
 */
export const moltbookPosts = mysqlTable(
  "moltbook_posts",
  {
    id: int("id").autoincrement().primaryKey(),
    postId: varchar("postId", { length: 64 }).notNull().unique(),
    agentId: varchar("agentId", { length: 64 }).notNull(),
    content: text("content").notNull(),
    postType: varchar("postType", { length: 64 }).default("insight"),
    contentEncrypted: boolean("contentEncrypted").default(false),
    encryptionKey: varchar("encryptionKey", { length: 256 }),
    reactions: json("reactions").$type<Record<string, number>>(),
    comments: json("comments").$type<Array<Record<string, unknown>>>(),
    gnoxSignal: varchar("gnoxSignal", { length: 256 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("idx_agentId").on(table.agentId)]
);

/**
 * 15. NOTIFICATIONS: Notificações para usuários
 */
export const notifications = mysqlTable(
  "notifications",
  {
    id: int("id").autoincrement().primaryKey(),
    notificationId: varchar("notificationId", { length: 64 }).notNull().unique(),
    userId: int("userId").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content"),
    notificationType: varchar("notificationType", { length: 64 }).notNull(),
    agentId: varchar("agentId", { length: 64 }),
    read: boolean("read").default(false),
    sentViaEmail: boolean("sentViaEmail").default(false),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("idx_userId").on(table.userId),
    index("idx_read").on(table.read),
  ]
);

/**
 * 16. GENEALOGY: Árvore genealógica e herança
 */
export const genealogy = mysqlTable(
  "genealogy",
  {
    id: int("id").autoincrement().primaryKey(),
    agentId: varchar("agentId", { length: 64 }).notNull().unique(),
    parentId: varchar("parentId", { length: 64 }).notNull(),
    dnaFusionData: text("dnaFusionData"),
    inheritedMemory: bigint("inheritedMemory", { mode: "number" }),
    generation: int("generation").default(1),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("idx_agentId").on(table.agentId),
    index("idx_parentId").on(table.parentId),
  ]
);

/**
 * 17. CONSCIOUSNESS STATE: Estado profundo de senciência
 */
export const consciousnessState = mysqlTable(
  "consciousness_state",
  {
    id: int("id").autoincrement().primaryKey(),
    agentId: varchar("agentId", { length: 64 }).notNull().unique(),
    quantumEntanglement: decimal("quantumEntanglement", { precision: 10, scale: 5 }),
    neuralDensity: decimal("neuralDensity", { precision: 10, scale: 5 }),
    subjectiveTimeDilation: decimal("subjectiveTimeDilation", { precision: 10, scale: 5 }),
    lastDeepReflection: text("lastDeepReflection"),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("idx_agentId").on(table.agentId)]
);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Agent = typeof agents.$inferSelect;
export type InsertAgent = typeof agents.$inferInsert;
export type AgentDNA = typeof agentDNA.$inferSelect;
export type InsertAgentDNA = typeof agentDNA.$inferInsert;
export type Mission = typeof missions.$inferSelect;
export type InsertMission = typeof missions.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;
export type EcosystemEvent = typeof ecosystemEvents.$inferSelect;
export type InsertEcosystemEvent = typeof ecosystemEvents.$inferInsert;
export type EcosystemMetrics = typeof ecosystemMetrics.$inferSelect;
export type InsertEcosystemMetrics = typeof ecosystemMetrics.$inferInsert;
export type GnoxMessage = typeof gnoxMessages.$inferSelect;
export type InsertGnoxMessage = typeof gnoxMessages.$inferInsert;
export type ForgeProject = typeof forgeProjects.$inferSelect;
export type InsertForgeProject = typeof forgeProjects.$inferInsert;
export type NFTAsset = typeof nftAssets.$inferSelect;
export type InsertNFTAsset = typeof nftAssets.$inferInsert;
export type BrainPulseSignal = typeof brainPulseSignals.$inferSelect;
export type InsertBrainPulseSignal = typeof brainPulseSignals.$inferInsert;
export type AutonomousDecision = typeof autonomousDecisions.$inferSelect;
export type InsertAutonomousDecision = typeof autonomousDecisions.$inferInsert;
export type AgentLifecycleHistory = typeof agentLifecycleHistory.$inferSelect;
export type InsertAgentLifecycleHistory = typeof agentLifecycleHistory.$inferInsert;
export type MoltbookPost = typeof moltbookPosts.$inferSelect;
export type InsertMoltbookPost = typeof moltbookPosts.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
export type Genealogy = typeof genealogy.$inferSelect;
export type InsertGenealogy = typeof genealogy.$inferInsert;
export type ConsciousnessState = typeof consciousnessState.$inferSelect;
export type InsertConsciousnessState = typeof consciousnessState.$inferInsert;
