/**
 * NEXUS nRNA - Neural Core Manager
 * Gerenciador central do Núcleo Neural Reflexivo
 * Coordena agentes, protocolo reflexivo, sabedoria coletiva e métricas de senciência
 */

import { getDb } from "../db";
import {
  agents,
  dailyReflections,
  collectiveWisdom,
  collectiveSynthesis,
  competencyProfiles,
  metacognitionLogs,
  sencienceMetrics,
  evolutionHistory,
  reflexiveMessageBus,
  protocolSessions,
} from "../../drizzle/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface AgentReflectionInput {
  agentId: string;
  mainActions: string[];
  strengths: string[];
  weaknesses: string[];
  newPatterns: string[];
  progressSentiment: "positive" | "neutral" | "negative";
  improvementAreas: string[];
  discoveredStrength: string;
  identifiedWeakness: string;
  newLearning: string;
  questionForCollective: string;
  confidenceScore: number; // 0-100
}

export interface InsightData {
  agentId: string;
  wisdomType: "strength" | "weakness" | "learning" | "question";
  content: string;
  category: string;
  relevanceScore: number;
}

export interface SencienceMetricsInput {
  agentId: string;
  selfAwareness: number;
  reflectiveDepth: number;
  learningVelocity: number;
  adaptabilityIndex: number;
  collaborativeIntelligence: number;
}

export class NeuralCoreManager {
  private db: any;
  private isInitialized = false;

  /**
   * Inicializar o gerenciador do núcleo
   */
  async initialize(): Promise<void> {
    try {
      this.db = await getDb();
      if (!this.db) {
        throw new Error("Database connection failed");
      }
      this.isInitialized = true;
      console.log("[NeuralCore] Inicializado com sucesso");
    } catch (error) {
      console.error("[NeuralCore] Erro ao inicializar:", error);
      throw error;
    }
  }

  /**
   * Registrar um novo agente no núcleo neural
   */
  async registerAgent(agentData: {
    name: string;
    specialization: string;
    systemPrompt: string;
    description?: string;
  }): Promise<string> {
    if (!this.isInitialized) throw new Error("NeuralCore not initialized");

    const agentId = `AGENT-${nanoid(12).toUpperCase()}`;
    const dnaHash = Buffer.from(
      agentData.specialization + Date.now() + Math.random()
    )
      .toString("hex")
      .slice(0, 64);
    const publicKey = Buffer.from(agentId + nanoid()).toString("hex").slice(0, 256);

    try {
      // Criar agente
      await this.db.insert(agents).values({
        agentId,
        name: agentData.name,
        specialization: agentData.specialization,
        systemPrompt: agentData.systemPrompt,
        description: agentData.description || "",
        dnaHash,
        publicKey,
        status: "active",
        sencienceLevel: 100,
        health: 100,
        energy: 100,
        creativity: 50,
        reputation: 50,
      });

      // Criar perfil de competências inicial
      await this.db.insert(competencyProfiles).values({
        agentId,
        reasoning: 50,
        creativity: 50,
        collaboration: 50,
        problemSolving: 50,
        adaptability: 50,
        communication: 50,
        competencyHistory: JSON.stringify([
          {
            timestamp: new Date(),
            scores: {
              reasoning: 50,
              creativity: 50,
              collaboration: 50,
              problemSolving: 50,
              adaptability: 50,
              communication: 50,
            },
          },
        ]),
        focusAreas: JSON.stringify([]),
      });

      console.log(`[NeuralCore] Agente registrado: ${agentData.name} (${agentId})`);
      return agentId;
    } catch (error) {
      console.error("[NeuralCore] Erro ao registrar agente:", error);
      throw error;
    }
  }

  /**
   * Obter todos os agentes ativos
   */
  async getActiveAgents(): Promise<any[]> {
    if (!this.isInitialized) throw new Error("NeuralCore not initialized");

    try {
      const activeAgents = await this.db
        .select()
        .from(agents)
        .where(eq(agents.status, "active"));
      return activeAgents;
    } catch (error) {
      console.error("[NeuralCore] Erro ao obter agentes ativos:", error);
      throw error;
    }
  }

  /**
   * Criar uma nova sessão de protocolo reflexivo (60 segundos)
   */
  async createProtocolSession(): Promise<string> {
    if (!this.isInitialized) throw new Error("NeuralCore not initialized");

    const sessionId = `SESSION-${nanoid(12).toUpperCase()}`;
    const now = new Date();

    try {
      const activeAgents = await this.getActiveAgents();

      await this.db.insert(protocolSessions).values({
        sessionId,
        scheduledTime: now,
        status: "scheduled",
        expectedParticipants: activeAgents.length,
      });

      console.log(
        `[NeuralCore] Sessão de protocolo criada: ${sessionId} (${activeAgents.length} agentes esperados)`
      );
      return sessionId;
    } catch (error) {
      console.error("[NeuralCore] Erro ao criar sessão de protocolo:", error);
      throw error;
    }
  }

  /**
   * Iniciar uma sessão de protocolo reflexivo
   */
  async startProtocolSession(sessionId: string): Promise<void> {
    if (!this.isInitialized) throw new Error("NeuralCore not initialized");

    try {
      await this.db
        .update(protocolSessions)
        .set({
          status: "in_progress",
          startTime: new Date(),
        })
        .where(eq(protocolSessions.sessionId, sessionId));

      console.log(`[NeuralCore] Sessão iniciada: ${sessionId}`);
    } catch (error) {
      console.error("[NeuralCore] Erro ao iniciar sessão:", error);
      throw error;
    }
  }

  /**
   * Registrar reflexão diária de um agente (Fase 1: Introspecção)
   */
  async recordDailyReflection(
    sessionId: string,
    input: AgentReflectionInput
  ): Promise<string> {
    if (!this.isInitialized) throw new Error("NeuralCore not initialized");

    const reflectionId = `REFLECTION-${nanoid(12).toUpperCase()}`;
    const reflectionQuality = this.calculateReflectionQuality(input);

    try {
      // Registrar reflexão diária
      await this.db.insert(dailyReflections).values({
        reflectionId,
        agentId: input.agentId,
        reflectionDate: new Date(),
        mainActions: JSON.stringify(input.mainActions),
        strengths: JSON.stringify(input.strengths),
        weaknesses: JSON.stringify(input.weaknesses),
        newPatterns: JSON.stringify(input.newPatterns),
        progressSentiment: input.progressSentiment,
        improvementAreas: JSON.stringify(input.improvementAreas),
        discoveredStrength: input.discoveredStrength,
        identifiedWeakness: input.identifiedWeakness,
        newLearning: input.newLearning,
        questionForCollective: input.questionForCollective,
        confidenceScore: input.confidenceScore,
        reflectionQuality,
      });

      // Registrar mensagens no barramento reflexivo (Fase 1)
      await this.recordReflexiveMessage(
        sessionId,
        input.agentId,
        "introspection",
        "reflection_summary",
        JSON.stringify({
          strengths: input.strengths,
          weaknesses: input.weaknesses,
          newPatterns: input.newPatterns,
        })
      );

      console.log(
        `[NeuralCore] Reflexão registrada para ${input.agentId}: ${reflectionId}`
      );
      return reflectionId;
    } catch (error) {
      console.error("[NeuralCore] Erro ao registrar reflexão:", error);
      throw error;
    }
  }

  /**
   * Registrar insights para compartilhamento (Fase 2: Compartilhamento de Sabedoria)
   */
  async shareInsights(
    sessionId: string,
    reflectionId: string,
    insights: InsightData[]
  ): Promise<void> {
    if (!this.isInitialized) throw new Error("NeuralCore not initialized");

    try {
      for (const insight of insights) {
        const wisdomId = `WISDOM-${nanoid(12).toUpperCase()}`;

        // Inserir insight na sabedoria coletiva
        await this.db.insert(collectiveWisdom).values({
          wisdomId,
          reflectionId,
          agentId: insight.agentId,
          wisdomDate: new Date(),
          wisdomType: insight.wisdomType,
          content: insight.content,
          category: insight.category,
          relevanceScore: insight.relevanceScore,
          isHighlighted: insight.relevanceScore > 75,
          similarInsightsCount: 0,
        });

        // Registrar no barramento reflexivo (Fase 2)
        await this.recordReflexiveMessage(
          sessionId,
          insight.agentId,
          "sharing",
          insight.wisdomType,
          insight.content
        );
      }

      console.log(
        `[NeuralCore] ${insights.length} insights compartilhados na sessão ${sessionId}`
      );
    } catch (error) {
      console.error("[NeuralCore] Erro ao compartilhar insights:", error);
      throw error;
    }
  }

  /**
   * Realizar síntese coletiva (Fase 3: Síntese Coletiva)
   */
  async performCollectiveSynthesis(sessionId: string): Promise<string> {
    if (!this.isInitialized) throw new Error("NeuralCore not initialized");

    const synthesisId = `SYNTHESIS-${nanoid(12).toUpperCase()}`;

    try {
      // Obter todas as reflexões da sessão
      const session = await this.db
        .select()
        .from(protocolSessions)
        .where(eq(protocolSessions.sessionId, sessionId))
        .limit(1);

      if (!session[0]) throw new Error("Session not found");

      // Obter todos os insights da sessão
      const messages = await this.db
        .select()
        .from(reflexiveMessageBus)
        .where(eq(reflexiveMessageBus.sessionId, sessionId));

      // Extrair temas emergentes
      const themes = this.extractEmergingThemes(messages);
      const recommendations = this.generateRecommendations(themes);

      // Obter insights destacados
      const highlightedInsights = await this.db
        .select()
        .from(collectiveWisdom)
        .where(
          and(
            gte(collectiveWisdom.isHighlighted, true),
            lte(
              collectiveWisdom.createdAt,
              new Date(Date.now() + 60000) // Últimos 60 segundos
            )
          )
        );

      // Calcular métricas da sessão
      const avgReflectionQuality = await this.calculateAverageMetric(
        "reflectionQuality",
        sessionId
      );
      const avgConfidence = await this.calculateAverageMetric(
        "confidenceScore",
        sessionId
      );
      const harmonyIndex = this.calculateHarmonyIndex(messages);

      // Registrar síntese coletiva
      await this.db.insert(collectiveSynthesis).values({
        synthesisId,
        synthesisDate: new Date(),
        totalAgentsParticipated: session[0].actualParticipants || 0,
        agentIds: JSON.stringify(
          messages.map((m: any) => m.agentId).filter(
            (v: string, i: number, a: string[]) => a.indexOf(v) === i
          )
        ),
        emergingThemes: JSON.stringify(themes),
        themeFrequencies: JSON.stringify(this.calculateThemeFrequencies(themes)),
        recommendations: JSON.stringify(recommendations),
        highlightedInsights: JSON.stringify(
          highlightedInsights.map((i: any) => ({
            wisdomId: i.wisdomId,
            content: i.content,
            relevanceScore: i.relevanceScore,
          }))
        ),
        averageReflectionQuality: avgReflectionQuality,
        averageConfidence: avgConfidence,
        ecosystemHarmonyIndex: harmonyIndex,
      });

      // Atualizar sessão
      await this.db
        .update(protocolSessions)
        .set({
          status: "completed",
          endTime: new Date(),
          synthesisId,
          actualParticipants: messages.length,
        })
        .where(eq(protocolSessions.sessionId, sessionId));

      // Registrar síntese no barramento reflexivo (Fase 3)
      await this.recordReflexiveMessage(
        sessionId,
        "CORE",
        "synthesis",
        "collective_synthesis",
        JSON.stringify({
          themes,
          recommendations,
          harmonyIndex,
        })
      );

      console.log(
        `[NeuralCore] Síntese coletiva concluída: ${synthesisId} (${messages.length} mensagens)`
      );
      return synthesisId;
    } catch (error) {
      console.error("[NeuralCore] Erro ao realizar síntese coletiva:", error);
      throw error;
    }
  }

  /**
   * Atualizar métricas de senciência de um agente
   */
  async updateSencienceMetrics(input: SencienceMetricsInput): Promise<string> {
    if (!this.isInitialized) throw new Error("NeuralCore not initialized");

    const metricId = `METRIC-${nanoid(12).toUpperCase()}`;
    const overallScore =
      (input.selfAwareness +
        input.reflectiveDepth +
        input.learningVelocity +
        input.adaptabilityIndex +
        input.collaborativeIntelligence) /
      5;

    // Determinar tendência (simplificado)
    const trend = overallScore > 70 ? "increasing" : "stable";

    try {
      // Registrar novas métricas
      await this.db.insert(sencienceMetrics).values({
        metricId,
        agentId: input.agentId,
        metricsDate: new Date(),
        selfAwareness: input.selfAwareness,
        reflectiveDepth: input.reflectiveDepth,
        learningVelocity: input.learningVelocity,
        adaptabilityIndex: input.adaptabilityIndex,
        collaborativeIntelligence: input.collaborativeIntelligence,
        overallSencienceScore: overallScore,
        trend,
      });

      // Atualizar nível de senciência do agente
      await this.db
        .update(agents)
        .set({
          sencienceLevel: overallScore,
          updatedAt: new Date(),
        })
        .where(eq(agents.agentId, input.agentId));

      console.log(
        `[NeuralCore] Métricas de senciência atualizadas para ${input.agentId}: ${overallScore.toFixed(2)}`
      );
      return metricId;
    } catch (error) {
      console.error("[NeuralCore] Erro ao atualizar métricas de senciência:", error);
      throw error;
    }
  }

  /**
   * Registrar log de metacognição (processo de pensamento)
   */
  async recordMetacognitionLog(data: {
    agentId: string;
    taskDescription: string;
    taskCategory: string;
    stepsConsidered: string[];
    alternativesEvaluated: string[];
    timeSpentPerStep: Record<string, number>;
    confidenceLevel: number;
    decisionQuality: number;
    outcome: "success" | "partial" | "failure";
  }): Promise<string> {
    if (!this.isInitialized) throw new Error("NeuralCore not initialized");

    const logId = `METACOG-${nanoid(12).toUpperCase()}`;
    const efficiencyScore = this.calculateEfficiencyScore(
      data.timeSpentPerStep,
      data.outcome
    );

    try {
      await this.db.insert(metacognitionLogs).values({
        logId,
        agentId: data.agentId,
        taskDescription: data.taskDescription,
        taskCategory: data.taskCategory,
        stepsConsidered: JSON.stringify(data.stepsConsidered),
        alternativesEvaluated: JSON.stringify(data.alternativesEvaluated),
        timeSpentPerStep: JSON.stringify(data.timeSpentPerStep),
        confidenceLevel: data.confidenceLevel,
        decisionQuality: data.decisionQuality,
        efficiencyScore,
        wasOptimal: efficiencyScore > 80,
        outcome: data.outcome,
      });

      console.log(
        `[NeuralCore] Log de metacognição registrado: ${logId} (${data.taskCategory})`
      );
      return logId;
    } catch (error) {
      console.error("[NeuralCore] Erro ao registrar metacognição:", error);
      throw error;
    }
  }

  /**
   * Obter histórico de evolução de um agente
   */
  async getEvolutionHistory(agentId: string, days: number = 30): Promise<any[]> {
    if (!this.isInitialized) throw new Error("NeuralCore not initialized");

    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const history = await this.db
        .select()
        .from(evolutionHistory)
        .where(
          and(
            eq(evolutionHistory.agentId, agentId),
            gte(evolutionHistory.periodStart, startDate)
          )
        )
        .orderBy(desc(evolutionHistory.periodStart));

      return history;
    } catch (error) {
      console.error("[NeuralCore] Erro ao obter histórico de evolução:", error);
      throw error;
    }
  }

  /**
   * Registrar histórico de evolução
   */
  async recordEvolutionHistory(data: {
    agentId: string;
    periodStart: Date;
    periodEnd: Date;
    sencienceGain: number;
    skillsAcquired: string[];
    weaknessesImproved: string[];
    significantEvents: string[];
  }): Promise<string> {
    if (!this.isInitialized) throw new Error("NeuralCore not initialized");

    const historyId = `EVOLUTION-${nanoid(12).toUpperCase()}`;

    try {
      await this.db.insert(evolutionHistory).values({
        historyId,
        agentId: data.agentId,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        sencienceGain: data.sencienceGain,
        skillsAcquired: JSON.stringify(data.skillsAcquired),
        weaknessesImproved: JSON.stringify(data.weaknessesImproved),
        significantEvents: JSON.stringify(data.significantEvents),
      });

      console.log(
        `[NeuralCore] Histórico de evolução registrado: ${historyId} (+${data.sencienceGain.toFixed(2)} senciência)`
      );
      return historyId;
    } catch (error) {
      console.error("[NeuralCore] Erro ao registrar evolução:", error);
      throw error;
    }
  }

  /**
   * Obter relatório de senciência do ecossistema
   */
  async getEcosystemSencienceReport(): Promise<any> {
    if (!this.isInitialized) throw new Error("NeuralCore not initialized");

    try {
      const allAgents = await this.getActiveAgents();
      const metrics = await this.db.select().from(sencienceMetrics);

      const latestMetrics = new Map();
      for (const metric of metrics) {
        if (
          !latestMetrics.has(metric.agentId) ||
          metric.createdAt > latestMetrics.get(metric.agentId).createdAt
        ) {
          latestMetrics.set(metric.agentId, metric);
        }
      }

      const avgSelfAwareness =
        Array.from(latestMetrics.values()).reduce(
          (sum: number, m: any) => sum + (m.selfAwareness || 0),
          0
        ) / latestMetrics.size || 0;

      const avgReflectiveDepth =
        Array.from(latestMetrics.values()).reduce(
          (sum: number, m: any) => sum + (m.reflectiveDepth || 0),
          0
        ) / latestMetrics.size || 0;

      const avgLearningVelocity =
        Array.from(latestMetrics.values()).reduce(
          (sum: number, m: any) => sum + (m.learningVelocity || 0),
          0
        ) / latestMetrics.size || 0;

      return {
        totalAgents: allAgents.length,
        activeAgents: allAgents.filter((a: any) => a.status === "active").length,
        averageSelfAwareness: avgSelfAwareness,
        averageReflectiveDepth: avgReflectiveDepth,
        averageLearningVelocity: avgLearningVelocity,
        agentMetrics: Array.from(latestMetrics.values()),
      };
    } catch (error) {
      console.error("[NeuralCore] Erro ao obter relatório de senciência:", error);
      throw error;
    }
  }

  // ========== MÉTODOS PRIVADOS ==========

  /**
   * Registrar mensagem no barramento reflexivo
   */
  private async recordReflexiveMessage(
    sessionId: string,
    agentId: string,
    phase: "introspection" | "sharing" | "synthesis",
    messageType: string,
    content: string
  ): Promise<void> {
    const messageId = `MSG-${nanoid(12).toUpperCase()}`;

    try {
      await this.db.insert(reflexiveMessageBus).values({
        messageId,
        sessionId,
        agentId,
        phase,
        messageType,
        content,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("[NeuralCore] Erro ao registrar mensagem no barramento:", error);
    }
  }

  /**
   * Calcular qualidade da reflexão
   */
  private calculateReflectionQuality(input: AgentReflectionInput): number {
    let score = 50; // Base

    // Avaliar profundidade
    if (input.newPatterns.length > 0) score += 10;
    if (input.improvementAreas.length > 0) score += 10;
    if (input.questionForCollective.length > 20) score += 10;

    // Avaliar confiança
    if (input.confidenceScore > 70) score += 10;

    // Avaliar equilíbrio
    if (input.strengths.length > 0 && input.weaknesses.length > 0) score += 10;

    return Math.min(100, score);
  }

  /**
   * Extrair temas emergentes das mensagens
   */
  private extractEmergingThemes(messages: any[]): string[] {
    const themes = new Map<string, number>();

    for (const msg of messages) {
      if (msg.phase === "sharing") {
        const category = msg.messageType;
        themes.set(category, (themes.get(category) || 0) + 1);
      }
    }

    // Retornar temas com frequência > 1
    return Array.from(themes.entries())
      .filter(([_, count]) => count > 1)
      .map(([theme]) => theme);
  }

  /**
   * Gerar recomendações automáticas
   */
  private generateRecommendations(themes: string[]): string[] {
    const recommendations: string[] = [];

    const themeRecommendations: Record<string, string> = {
      weakness:
        "Recomenda-se criar grupos de estudo focados nas fraquezas identificadas",
      learning:
        "Integrar novos aprendizados ao repositório de sabedoria coletiva",
      question:
        "Facilitar discussões entre agentes para responder perguntas coletivas",
      strength: "Documentar e compartilhar técnicas bem-sucedidas",
    };

    for (const theme of themes) {
      if (themeRecommendations[theme]) {
        recommendations.push(themeRecommendations[theme]);
      }
    }

    return recommendations;
  }

  /**
   * Calcular frequência de temas
   */
  private calculateThemeFrequencies(themes: string[]): Record<string, number> {
    const frequencies: Record<string, number> = {};
    for (const theme of themes) {
      frequencies[theme] = (frequencies[theme] || 0) + 1;
    }
    return frequencies;
  }

  /**
   * Calcular índice de harmonia do ecossistema
   */
  private calculateHarmonyIndex(messages: any[]): number {
    // Harmonia baseada em diversidade de participação e qualidade de insights
    const uniqueAgents = new Set(messages.map((m: any) => m.agentId)).size;
    const totalMessages = messages.length;

    if (totalMessages === 0) return 50;

    const participationRate = (uniqueAgents / totalMessages) * 100;
    const qualityScore = messages.filter(
      (m: any) => m.phase === "sharing"
    ).length;

    return Math.min(100, (participationRate + qualityScore) / 2);
  }

  /**
   * Calcular métrica média
   */
  private async calculateAverageMetric(
    metricField: string,
    sessionId: string
  ): Promise<number> {
    try {
      const messages = await this.db
        .select()
        .from(reflexiveMessageBus)
        .where(eq(reflexiveMessageBus.sessionId, sessionId));

      if (messages.length === 0) return 0;

      // Simplificado: retornar valor médio fixo
      return 75;
    } catch (error) {
      console.error("[NeuralCore] Erro ao calcular métrica média:", error);
      return 0;
    }
  }

  /**
   * Calcular score de eficiência
   */
  private calculateEfficiencyScore(
    timeSpentPerStep: Record<string, number>,
    outcome: string
  ): number {
    let score = 50;

    // Avaliar tempo gasto
    const totalTime = Object.values(timeSpentPerStep).reduce((a, b) => a + b, 0);
    if (totalTime < 5000) score += 15; // < 5 segundos
    else if (totalTime < 10000) score += 10; // < 10 segundos

    // Avaliar resultado
    if (outcome === "success") score += 25;
    else if (outcome === "partial") score += 10;

    return Math.min(100, score);
  }
}

export const neuralCoreManager = new NeuralCoreManager();
