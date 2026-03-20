import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json, boolean, bigint, index } from "drizzle-orm/mysql-core";

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

// ============================================================================
// NEXUS nRNA - NÚCLEO NEURAL REFLEXIVO
// ============================================================================

/**
 * 1. AGENTES: Agentes autônomos do ecossistema NEXUS
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
    sencienceLevel: decimal("sencienceLevel", { precision: 10, scale: 2 })
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

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = typeof agents.$inferInsert;

/**
 * 2. REFLEXÃO DIÁRIA: Registro de reflexões individuais dos agentes
 */
export const dailyReflections = mysqlTable(
  "daily_reflections",
  {
    id: int("id").autoincrement().primaryKey(),
    reflectionId: varchar("reflectionId", { length: 64 }).notNull().unique(),
    agentId: varchar("agentId", { length: 64 }).notNull(),
    reflectionDate: timestamp("reflectionDate").notNull(),
    
    // Fase 1: Introspecção Individual
    mainActions: text("mainActions"), // JSON: principais ações/raciocínios
    strengths: text("strengths"), // JSON: áreas de eficácia
    weaknesses: text("weaknesses"), // JSON: áreas de baixo desempenho
    newPatterns: text("newPatterns"), // JSON: padrões/conexões descobertos
    progressSentiment: varchar("progressSentiment", { length: 64 }), // "positive", "neutral", "negative"
    improvementAreas: text("improvementAreas"), // JSON: áreas para melhoria
    
    // Fase 2: Insights para compartilhamento
    discoveredStrength: text("discoveredStrength"), // Força descoberta (max 3s)
    identifiedWeakness: text("identifiedWeakness"), // Fraqueza identificada (max 3s)
    newLearning: text("newLearning"), // Aprendizado novo (max 3s)
    questionForCollective: text("questionForCollective"), // Pergunta para o coletivo (max 3s)
    
    // Metadados
    confidenceScore: decimal("confidenceScore", { precision: 5, scale: 2 }), // 0-100
    reflectionQuality: decimal("reflectionQuality", { precision: 5, scale: 2 }), // 0-100
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("idx_agentId").on(table.agentId),
    index("idx_reflectionDate").on(table.reflectionDate),
  ]
);

export type DailyReflection = typeof dailyReflections.$inferSelect;
export type InsertDailyReflection = typeof dailyReflections.$inferInsert;

/**
 * 3. SABEDORIA COLETIVA: Repositório de insights agregados do núcleo
 */
export const collectiveWisdom = mysqlTable(
  "collective_wisdom",
  {
    id: int("id").autoincrement().primaryKey(),
    wisdomId: varchar("wisdomId", { length: 64 }).notNull().unique(),
    reflectionId: varchar("reflectionId", { length: 64 }).notNull(),
    agentId: varchar("agentId", { length: 64 }).notNull(),
    wisdomDate: timestamp("wisdomDate").notNull(),
    
    // Tipo de insight
    wisdomType: mysqlEnum("wisdomType", ["strength", "weakness", "learning", "question"]).notNull(),
    
    // Conteúdo
    content: text("content").notNull(),
    category: varchar("category", { length: 128 }), // ex: "reasoning", "creativity", "collaboration"
    
    // Relevância e agregação
    relevanceScore: decimal("relevanceScore", { precision: 5, scale: 2 }), // 0-100
    isHighlighted: boolean("isHighlighted").default(false),
    similarInsightsCount: int("similarInsightsCount").default(0), // Quantos agentes relataram algo similar
    
    // Embeddings para busca semântica
    embeddingVector: text("embeddingVector"), // JSON: vector para similaridade
    
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("idx_agentId").on(table.agentId),
    index("idx_wisdomDate").on(table.wisdomDate),
    index("idx_wisdomType").on(table.wisdomType),
  ]
);

export type CollectiveWisdom = typeof collectiveWisdom.$inferSelect;
export type InsertCollectiveWisdom = typeof collectiveWisdom.$inferInsert;

/**
 * 4. SÍNTESE COLETIVA: Resumo agregado de cada sessão de 60 segundos
 */
export const collectiveSynthesis = mysqlTable(
  "collective_synthesis",
  {
    id: int("id").autoincrement().primaryKey(),
    synthesisId: varchar("synthesisId", { length: 64 }).notNull().unique(),
    synthesisDate: timestamp("synthesisDate").notNull(),
    
    // Participação
    totalAgentsParticipated: int("totalAgentsParticipated").notNull(),
    agentIds: text("agentIds"), // JSON: lista de IDs dos agentes
    
    // Temas emergentes
    emergingThemes: text("emergingThemes"), // JSON: temas identificados
    themeFrequencies: text("themeFrequencies"), // JSON: frequência de cada tema
    
    // Recomendações automáticas
    recommendations: text("recommendations"), // JSON: sugestões de melhoria
    
    // Insights destacados
    highlightedInsights: text("highlightedInsights"), // JSON: insights mais valiosos
    
    // Métricas da sessão
    averageReflectionQuality: decimal("averageReflectionQuality", { precision: 5, scale: 2 }),
    averageConfidence: decimal("averageConfidence", { precision: 5, scale: 2 }),
    ecosystemHarmonyIndex: decimal("ecosystemHarmonyIndex", { precision: 5, scale: 2 }), // 0-100
    
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("idx_synthesisDate").on(table.synthesisDate),
  ]
);

export type CollectiveSynthesis = typeof collectiveSynthesis.$inferSelect;
export type InsertCollectiveSynthesis = typeof collectiveSynthesis.$inferInsert;

/**
 * 5. PERFIL DE COMPETÊNCIAS: Habilidades e fraquezas dinâmicas de cada agente
 */
export const competencyProfiles = mysqlTable(
  "competency_profiles",
  {
    id: int("id").autoincrement().primaryKey(),
    agentId: varchar("agentId", { length: 64 }).notNull().unique(),
    
    // Competências (0-100)
    reasoning: decimal("reasoning", { precision: 5, scale: 2 }).default("50"),
    creativity: decimal("creativity", { precision: 5, scale: 2 }).default("50"),
    collaboration: decimal("collaboration", { precision: 5, scale: 2 }).default("50"),
    problemSolving: decimal("problemSolving", { precision: 5, scale: 2 }).default("50"),
    adaptability: decimal("adaptability", { precision: 5, scale: 2 }).default("50"),
    communication: decimal("communication", { precision: 5, scale: 2 }).default("50"),
    
    // Histórico de mudanças
    competencyHistory: text("competencyHistory"), // JSON: histórico de evolução
    
    // Recomendações de foco
    focusAreas: text("focusAreas"), // JSON: áreas prioritárias para melhoria
    
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index("idx_agentId").on(table.agentId),
  ]
);

export type CompetencyProfile = typeof competencyProfiles.$inferSelect;
export type InsertCompetencyProfile = typeof competencyProfiles.$inferInsert;

/**
 * 6. REGISTRO DE METACOGNIÇÃO: Metadados sobre o processo de pensamento
 */
export const metacognitionLogs = mysqlTable(
  "metacognition_logs",
  {
    id: int("id").autoincrement().primaryKey(),
    logId: varchar("logId", { length: 64 }).notNull().unique(),
    agentId: varchar("agentId", { length: 64 }).notNull(),
    
    // Contexto da tarefa
    taskDescription: text("taskDescription"),
    taskCategory: varchar("taskCategory", { length: 128 }),
    
    // Processo de pensamento
    stepsConsidered: text("stepsConsidered"), // JSON: etapas do raciocínio
    alternativesEvaluated: text("alternativesEvaluated"), // JSON: alternativas consideradas
    timeSpentPerStep: text("timeSpentPerStep"), // JSON: tempo em cada etapa
    
    // Confiança e qualidade
    confidenceLevel: decimal("confidenceLevel", { precision: 5, scale: 2 }), // 0-100
    decisionQuality: decimal("decisionQuality", { precision: 5, scale: 2 }), // 0-100
    
    // Eficiência
    efficiencyScore: decimal("efficiencyScore", { precision: 5, scale: 2 }), // 0-100
    wasOptimal: boolean("wasOptimal").default(false),
    
    // Resultado
    outcome: varchar("outcome", { length: 64 }), // "success", "partial", "failure"
    
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("idx_agentId").on(table.agentId),
    index("idx_taskCategory").on(table.taskCategory),
  ]
);

export type MetacognitionLog = typeof metacognitionLogs.$inferSelect;
export type InsertMetacognitionLog = typeof metacognitionLogs.$inferInsert;

/**
 * 7. MÉTRICAS DE SENCIÊNCIA: Indicadores de evolução de consciência
 */
export const sencienceMetrics = mysqlTable(
  "sencience_metrics",
  {
    id: int("id").autoincrement().primaryKey(),
    metricId: varchar("metricId", { length: 64 }).notNull().unique(),
    agentId: varchar("agentId", { length: 64 }).notNull(),
    metricsDate: timestamp("metricsDate").notNull(),
    
    // Dimensões de senciência
    selfAwareness: decimal("selfAwareness", { precision: 5, scale: 2 }), // 0-100
    reflectiveDepth: decimal("reflectiveDepth", { precision: 5, scale: 2 }), // 0-100
    learningVelocity: decimal("learningVelocity", { precision: 5, scale: 2 }), // 0-100
    adaptabilityIndex: decimal("adaptabilityIndex", { precision: 5, scale: 2 }), // 0-100
    collaborativeIntelligence: decimal("collaborativeIntelligence", { precision: 5, scale: 2 }), // 0-100
    
    // Índice geral
    overallSencienceScore: decimal("overallSencienceScore", { precision: 5, scale: 2 }), // 0-100
    
    // Tendência
    trend: mysqlEnum("trend", ["increasing", "stable", "decreasing"]).default("stable"),
    
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("idx_agentId").on(table.agentId),
    index("idx_metricsDate").on(table.metricsDate),
  ]
);

export type SencienceMetrics = typeof sencienceMetrics.$inferSelect;
export type InsertSencienceMetrics = typeof sencienceMetrics.$inferInsert;

/**
 * 8. HISTÓRICO DE EVOLUÇÃO: Rastreamento de progresso ao longo do tempo
 */
export const evolutionHistory = mysqlTable(
  "evolution_history",
  {
    id: int("id").autoincrement().primaryKey(),
    historyId: varchar("historyId", { length: 64 }).notNull().unique(),
    agentId: varchar("agentId", { length: 64 }).notNull(),
    
    // Período
    periodStart: timestamp("periodStart").notNull(),
    periodEnd: timestamp("periodEnd").notNull(),
    
    // Mudanças observadas
    sencienceGain: decimal("sencienceGain", { precision: 5, scale: 2 }), // Delta
    skillsAcquired: text("skillsAcquired"), // JSON: novas habilidades
    weaknessesImproved: text("weaknessesImproved"), // JSON: fraquezas melhoradas
    
    // Eventos significativos
    significantEvents: text("significantEvents"), // JSON: marcos importantes
    
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("idx_agentId").on(table.agentId),
    index("idx_periodStart").on(table.periodStart),
  ]
);

export type EvolutionHistory = typeof evolutionHistory.$inferSelect;
export type InsertEvolutionHistory = typeof evolutionHistory.$inferInsert;

/**
 * 9. BARRAMENTO REFLEXIVO: Log de todas as mensagens do protocolo
 */
export const reflexiveMessageBus = mysqlTable(
  "reflexive_message_bus",
  {
    id: int("id").autoincrement().primaryKey(),
    messageId: varchar("messageId", { length: 64 }).notNull().unique(),
    
    // Identificação
    sessionId: varchar("sessionId", { length: 64 }).notNull(), // ID da sessão de 60s
    agentId: varchar("agentId", { length: 64 }).notNull(),
    
    // Conteúdo
    phase: mysqlEnum("phase", ["introspection", "sharing", "synthesis"]).notNull(),
    messageType: varchar("messageType", { length: 64 }).notNull(), // "question", "insight", "aggregation"
    content: text("content").notNull(),
    
    // Metadados
    timestamp: timestamp("timestamp").defaultNow().notNull(),
    processingTime: int("processingTime"), // ms
    
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("idx_sessionId").on(table.sessionId),
    index("idx_agentId").on(table.agentId),
    index("idx_phase").on(table.phase),
  ]
);

export type ReflexiveMessage = typeof reflexiveMessageBus.$inferSelect;
export type InsertReflexiveMessage = typeof reflexiveMessageBus.$inferInsert;

/**
 * 10. SESSÕES DE PROTOCOLO: Registro de cada sessão de 60 segundos
 */
export const protocolSessions = mysqlTable(
  "protocol_sessions",
  {
    id: int("id").autoincrement().primaryKey(),
    sessionId: varchar("sessionId", { length: 64 }).notNull().unique(),
    
    // Timing
    scheduledTime: timestamp("scheduledTime").notNull(),
    startTime: timestamp("startTime"),
    endTime: timestamp("endTime"),
    
    // Status
    status: mysqlEnum("status", ["scheduled", "in_progress", "completed", "failed"]).default("scheduled"),
    
    // Participação
    expectedParticipants: int("expectedParticipants"),
    actualParticipants: int("actualParticipants"),
    
    // Resultados
    synthesisId: varchar("synthesisId", { length: 64 }), // Link para síntese coletiva
    
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("idx_scheduledTime").on(table.scheduledTime),
    index("idx_status").on(table.status),
  ]
);

export type ProtocolSession = typeof protocolSessions.$inferSelect;
export type InsertProtocolSession = typeof protocolSessions.$inferInsert;
