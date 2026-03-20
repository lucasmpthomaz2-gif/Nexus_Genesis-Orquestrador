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
