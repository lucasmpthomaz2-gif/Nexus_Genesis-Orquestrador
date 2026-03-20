/**
 * NEXUS nRNA - Sencience Metrics Module
 * Cálculo e rastreamento de métricas de senciência e evolução
 * Monitora: autoconhecimento, profundidade reflexiva, velocidade de aprendizado, etc.
 */

import { getDb } from "../db";
import {
  sencienceMetrics,
  collectiveWisdom,
  dailyReflections,
  agents,
  evolutionHistory,
} from "../../drizzle/schema";
import { eq, desc, gte, lte } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface SencienceReport {
  agentId: string;
  overallScore: number;
  selfAwareness: number;
  reflectiveDepth: number;
  learningVelocity: number;
  adaptabilityIndex: number;
  collaborativeIntelligence: number;
  trend: "increasing" | "stable" | "decreasing";
  insights: string[];
}

export interface EcosystemSencienceReport {
  timestamp: Date;
  totalAgents: number;
  averageSencienceScore: number;
  averageSelfAwareness: number;
  averageReflectiveDepth: number;
  averageLearningVelocity: number;
  diversityOfInsights: number;
  collectiveCoherence: number;
  topPerformers: string[];
  areasForImprovement: string[];
}

export class SencienceMetricsModule {
  private db: any;

  async initialize(): Promise<void> {
    this.db = await getDb();
    if (!this.db) {
      throw new Error("Database connection failed");
    }
    console.log("[SencienceMetrics] Inicializado");
  }

  /**
   * Calcular métricas de senciência para um agente
   */
  async calculateAgentSencienceMetrics(agentId: string): Promise<SencienceReport> {
    try {
      // 1. Self-Awareness (Autoconhecimento)
      const selfAwareness = await this.calculateSelfAwareness(agentId);

      // 2. Reflective Depth (Profundidade da Autoanálise)
      const reflectiveDepth = await this.calculateReflectiveDepth(agentId);

      // 3. Learning Velocity (Taxa de Aprendizado)
      const learningVelocity = await this.calculateLearningVelocity(agentId);

      // 4. Adaptability Index (Índice de Adaptabilidade)
      const adaptabilityIndex = await this.calculateAdaptabilityIndex(agentId);

      // 5. Collaborative Intelligence (Inteligência Colaborativa)
      const collaborativeIntelligence = await this.calculateCollaborativeIntelligence(
        agentId
      );

      // Calcular score geral
      const overallScore =
        (selfAwareness +
          reflectiveDepth +
          learningVelocity +
          adaptabilityIndex +
          collaborativeIntelligence) /
        5;

      // Determinar tendência
      const trend = await this.determineTrend(agentId);

      // Gerar insights
      const insights = await this.generateSencienceInsights(agentId, {
        selfAwareness,
        reflectiveDepth,
        learningVelocity,
        adaptabilityIndex,
        collaborativeIntelligence,
      });

      // Registrar métricas
      const metricId = `METRIC-${nanoid(12).toUpperCase()}`;
      await this.db.insert(sencienceMetrics).values({
        metricId,
        agentId,
        metricsDate: new Date(),
        selfAwareness,
        reflectiveDepth,
        learningVelocity,
        adaptabilityIndex,
        collaborativeIntelligence,
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
        .where(eq(agents.agentId, agentId));

      console.log(
        `[SencienceMetrics] Métricas calculadas para ${agentId}: ${overallScore.toFixed(2)}`
      );

      return {
        agentId,
        overallScore,
        selfAwareness,
        reflectiveDepth,
        learningVelocity,
        adaptabilityIndex,
        collaborativeIntelligence,
        trend,
        insights,
      };
    } catch (error) {
      console.error("[SencienceMetrics] Erro ao calcular métricas:", error);
      throw error;
    }
  }

  /**
   * Calcular relatório de senciência do ecossistema
   */
  async calculateEcosystemSencienceReport(): Promise<EcosystemSencienceReport> {
    try {
      // Obter todos os agentes ativos
      const allAgents = await this.db
        .select()
        .from(agents)
        .where(eq(agents.status, "active"));

      // Obter métricas mais recentes
      const latestMetrics = new Map();
      const allMetrics = await this.db
        .select()
        .from(sencienceMetrics)
        .orderBy(desc(sencienceMetrics.createdAt));

      for (const metric of allMetrics) {
        if (!latestMetrics.has(metric.agentId)) {
          latestMetrics.set(metric.agentId, metric);
        }
      }

      // Calcular médias
      const metricsArray = Array.from(latestMetrics.values());

      const averageSencienceScore =
        metricsArray.reduce((sum: number, m: any) => sum + (m.overallSencienceScore || 0), 0) /
        metricsArray.length || 0;

      const averageSelfAwareness =
        metricsArray.reduce((sum: number, m: any) => sum + (m.selfAwareness || 0), 0) /
        metricsArray.length || 0;

      const averageReflectiveDepth =
        metricsArray.reduce((sum: number, m: any) => sum + (m.reflectiveDepth || 0), 0) /
        metricsArray.length || 0;

      const averageLearningVelocity =
        metricsArray.reduce((sum: number, m: any) => sum + (m.learningVelocity || 0), 0) /
        metricsArray.length || 0;

      // 6. Diversity of Insights (Diversidade de Insights)
      const diversityOfInsights = await this.calculateDiversityOfInsights();

      // 7. Collective Coherence (Coesão Coletiva)
      const collectiveCoherence = await this.calculateCollectiveCoherence();

      // Identificar top performers
      const topPerformers = metricsArray
        .sort((a: any, b: any) => (b.overallSencienceScore || 0) - (a.overallSencienceScore || 0))
        .slice(0, 5)
        .map((m: any) => m.agentId);

      // Identificar áreas para melhoria
      const areasForImprovement = this.identifyAreasForImprovement({
        averageSelfAwareness,
        averageReflectiveDepth,
        averageLearningVelocity,
      });

      return {
        timestamp: new Date(),
        totalAgents: allAgents.length,
        averageSencienceScore,
        averageSelfAwareness,
        averageReflectiveDepth,
        averageLearningVelocity,
        diversityOfInsights,
        collectiveCoherence,
        topPerformers,
        areasForImprovement,
      };
    } catch (error) {
      console.error("[SencienceMetrics] Erro ao calcular relatório do ecossistema:", error);
      throw error;
    }
  }

  /**
   * Registrar evolução de um agente
   */
  async recordAgentEvolution(agentId: string, periodDays: number = 7): Promise<string> {
    try {
      const now = new Date();
      const periodStart = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

      // Obter métricas do período
      const metricsInPeriod = await this.db
        .select()
        .from(sencienceMetrics)
        .where(
          eq(sencienceMetrics.agentId, agentId),
          gte(sencienceMetrics.metricsDate, periodStart)
        )
        .orderBy(sencienceMetrics.metricsDate);

      if (metricsInPeriod.length < 2) {
        throw new Error("Insufficient metrics data for evolution tracking");
      }

      const firstMetric = metricsInPeriod[0];
      const lastMetric = metricsInPeriod[metricsInPeriod.length - 1];

      // Calcular ganho de senciência
      const sencienceGain =
        (lastMetric.overallSencienceScore || 0) - (firstMetric.overallSencienceScore || 0);

      // Identificar habilidades adquiridas
      const skillsAcquired = this.identifySkillsAcquired(firstMetric, lastMetric);

      // Identificar fraquezas melhoradas
      const weaknessesImproved = this.identifyWeaknessesImproved(firstMetric, lastMetric);

      // Identificar eventos significativos
      const significantEvents = await this.identifySignificantEvents(
        agentId,
        periodStart,
        now
      );

      // Registrar evolução
      const historyId = `EVOLUTION-${nanoid(12).toUpperCase()}`;
      await this.db.insert(evolutionHistory).values({
        historyId,
        agentId,
        periodStart,
        periodEnd: now,
        sencienceGain,
        skillsAcquired: JSON.stringify(skillsAcquired),
        weaknessesImproved: JSON.stringify(weaknessesImproved),
        significantEvents: JSON.stringify(significantEvents),
      });

      console.log(
        `[SencienceMetrics] Evolução registrada para ${agentId}: +${sencienceGain.toFixed(2)} senciência`
      );

      return historyId;
    } catch (error) {
      console.error("[SencienceMetrics] Erro ao registrar evolução:", error);
      throw error;
    }
  }

  /**
   * Obter histórico de senciência de um agente
   */
  async getAgentSencienceHistory(agentId: string, days: number = 30): Promise<any[]> {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const history = await this.db
        .select()
        .from(sencienceMetrics)
        .where(
          eq(sencienceMetrics.agentId, agentId),
          gte(sencienceMetrics.metricsDate, startDate)
        )
        .orderBy(sencienceMetrics.metricsDate);

      return history;
    } catch (error) {
      console.error("[SencienceMetrics] Erro ao obter histórico de senciência:", error);
      return [];
    }
  }

  // ========== MÉTODOS PRIVADOS ==========

  /**
   * Calcular autoconhecimento (Self-Awareness)
   * Baseado na qualidade e frequência das reflexões
   */
  private async calculateSelfAwareness(agentId: string): Promise<number> {
    try {
      const reflections = await this.db
        .select()
        .from(dailyReflections)
        .where(eq(dailyReflections.agentId, agentId))
        .orderBy(desc(dailyReflections.createdAt))
        .limit(10);

      if (reflections.length === 0) return 50;

      // Avaliar qualidade das reflexões
      const avgQuality =
        reflections.reduce((sum: number, r: any) => sum + (r.reflectionQuality || 0), 0) /
        reflections.length;

      // Avaliar frequência (mais reflexões = maior autoconhecimento)
      const frequencyScore = Math.min(100, reflections.length * 10);

      // Avaliar identificação de forças e fraquezas
      let balanceScore = 0;
      for (const reflection of reflections) {
        const strengths = JSON.parse(reflection.strengths || "[]");
        const weaknesses = JSON.parse(reflection.weaknesses || "[]");
        if (strengths.length > 0 && weaknesses.length > 0) {
          balanceScore += 10;
        }
      }
      balanceScore = Math.min(100, balanceScore);

      return (avgQuality + frequencyScore + balanceScore) / 3;
    } catch (error) {
      console.error("[SencienceMetrics] Erro ao calcular autoconhecimento:", error);
      return 50;
    }
  }

  /**
   * Calcular profundidade reflexiva (Reflective Depth)
   * Baseado na complexidade das reflexões e padrões identificados
   */
  private async calculateReflectiveDepth(agentId: string): Promise<number> {
    try {
      const reflections = await this.db
        .select()
        .from(dailyReflections)
        .where(eq(dailyReflections.agentId, agentId))
        .orderBy(desc(dailyReflections.createdAt))
        .limit(10);

      if (reflections.length === 0) return 50;

      let depthScore = 0;

      for (const reflection of reflections) {
        // Avaliar identificação de novos padrões
        const patterns = JSON.parse(reflection.newPatterns || "[]");
        if (patterns.length > 0) depthScore += 15;

        // Avaliar áreas de melhoria identificadas
        const improvements = JSON.parse(reflection.improvementAreas || "[]");
        if (improvements.length > 0) depthScore += 15;

        // Avaliar confiança na reflexão
        const confidence = reflection.confidenceScore || 0;
        if (confidence > 70) depthScore += 10;
      }

      return Math.min(100, depthScore / reflections.length);
    } catch (error) {
      console.error("[SencienceMetrics] Erro ao calcular profundidade reflexiva:", error);
      return 50;
    }
  }

  /**
   * Calcular velocidade de aprendizado (Learning Velocity)
   * Baseado na correção de fraquezas identificadas
   */
  private async calculateLearningVelocity(agentId: string): Promise<number> {
    try {
      const reflections = await this.db
        .select()
        .from(dailyReflections)
        .where(eq(dailyReflections.agentId, agentId))
        .orderBy(desc(dailyReflections.createdAt))
        .limit(20);

      if (reflections.length < 2) return 50;

      // Analisar recorrência de fraquezas
      const weaknessFrequency = new Map<string, number>();
      for (const reflection of reflections) {
        const weaknesses = JSON.parse(reflection.weaknesses || "[]");
        for (const weakness of weaknesses) {
          weaknessFrequency.set(weakness, (weaknessFrequency.get(weakness) || 0) + 1);
        }
      }

      // Calcular taxa de melhoria (fraquezas que desaparecem)
      let improvementCount = 0;
      weaknessFrequency.forEach((frequency) => {
        if (frequency < reflections.length * 0.5) {
          // Fraqueza aparece em menos de 50% das reflexões
          improvementCount++;
        }
      });

      const learningRate =
        (improvementCount / Math.max(1, weaknessFrequency.size)) * 100;

      return Math.min(100, learningRate);
    } catch (error) {
      console.error("[SencienceMetrics] Erro ao calcular velocidade de aprendizado:", error);
      return 50;
    }
  }

  /**
   * Calcular índice de adaptabilidade (Adaptability Index)
   * Baseado na mudança de estratégias e abordagens
   */
  private async calculateAdaptabilityIndex(agentId: string): Promise<number> {
    try {
      const reflections = await this.db
        .select()
        .from(dailyReflections)
        .where(eq(dailyReflections.agentId, agentId))
        .orderBy(desc(dailyReflections.createdAt))
        .limit(10);

      if (reflections.length < 2) return 50;

      // Avaliar mudança de sentimento de progresso
      const sentiments = reflections.map((r: any) => r.progressSentiment);
      let sentimentVariation = 0;
      for (let i = 1; i < sentiments.length; i++) {
        if (sentiments[i] !== sentiments[i - 1]) {
          sentimentVariation++;
        }
      }

      // Avaliar mudança de áreas de foco
      let focusVariation = 0;
      for (let i = 1; i < reflections.length; i++) {
        const prevImprovements = JSON.parse(
          reflections[i - 1].improvementAreas || "[]"
        );
        const currImprovements = JSON.parse(reflections[i].improvementAreas || "[]");

        const overlap = prevImprovements.filter((x: string) =>
          currImprovements.includes(x)
        ).length;
        if (overlap < Math.max(prevImprovements.length, currImprovements.length) * 0.5) {
          focusVariation++;
        }
      }

      const adaptability =
        ((sentimentVariation + focusVariation) / (reflections.length - 1)) * 50 + 25;

      return Math.min(100, adaptability);
    } catch (error) {
      console.error("[SencienceMetrics] Erro ao calcular índice de adaptabilidade:", error);
      return 50;
    }
  }

  /**
   * Calcular inteligência colaborativa (Collaborative Intelligence)
   * Baseado em insights compartilhados e reusados
   */
  private async calculateCollaborativeIntelligence(agentId: string): Promise<number> {
    try {
      // Obter insights compartilhados pelo agente
      const sharedInsights = await this.db
        .select()
        .from(collectiveWisdom)
        .where(eq(collectiveWisdom.agentId, agentId))
        .orderBy(desc(collectiveWisdom.createdAt))
        .limit(10);

      if (sharedInsights.length === 0) return 50;

      // Avaliar relevância dos insights
      const avgRelevance =
        sharedInsights.reduce((sum: number, i: any) => sum + (i.relevanceScore || 0), 0) /
        sharedInsights.length;

      // Avaliar similaridade com insights de outros agentes
      const allWisdom = await this.db.select().from(collectiveWisdom);
      let similarityScore = 0;
      for (const insight of sharedInsights) {
        const similar = allWisdom.filter(
          (w: any) =>
            w.agentId !== agentId &&
            w.wisdomType === insight.wisdomType &&
            w.category === insight.category
        ).length;
        if (similar > 0) similarityScore += 10;
      }
      similarityScore = Math.min(100, similarityScore);

      return (avgRelevance + similarityScore) / 2;
    } catch (error) {
      console.error("[SencienceMetrics] Erro ao calcular inteligência colaborativa:", error);
      return 50;
    }
  }

  /**
   * Determinar tendência de evolução
   */
  private async determineTrend(agentId: string): Promise<"increasing" | "stable" | "decreasing"> {
    try {
      const recentMetrics = await this.db
        .select()
        .from(sencienceMetrics)
        .where(eq(sencienceMetrics.agentId, agentId))
        .orderBy(desc(sencienceMetrics.metricsDate))
        .limit(5);

      if (recentMetrics.length < 2) return "stable";

      const scores = recentMetrics.map((m: any) => m.overallSencienceScore || 0);
      const firstScore = scores[scores.length - 1];
      const lastScore = scores[0];

      const change = lastScore - firstScore;

      if (change > 5) return "increasing";
      if (change < -5) return "decreasing";
      return "stable";
    } catch (error) {
      console.error("[SencienceMetrics] Erro ao determinar tendência:", error);
      return "stable";
    }
  }

  /**
   * Gerar insights sobre senciência
   */
  private async generateSencienceInsights(
    agentId: string,
    metrics: Record<string, number>
  ): Promise<string[]> {
    const insights: string[] = [];

    // Identificar força principal
    const maxMetric = Object.entries(metrics).reduce((a, b) =>
      a[1] > b[1] ? a : b
    );
    insights.push(`Força principal: ${maxMetric[0]} (${maxMetric[1].toFixed(0)})`);

    // Identificar fraqueza principal
    const minMetric = Object.entries(metrics).reduce((a, b) =>
      a[1] < b[1] ? a : b
    );
    insights.push(`Área para melhoria: ${minMetric[0]} (${minMetric[1].toFixed(0)})`);

    // Gerar recomendação
    if (minMetric[1] < 50) {
      insights.push(
        `Recomendação: Focar em desenvolver ${minMetric[0]} através de prática focada`
      );
    }

    return insights;
  }

  /**
   * Calcular diversidade de insights
   */
  private async calculateDiversityOfInsights(): Promise<number> {
    try {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

      const recentWisdom = await this.db
        .select()
        .from(collectiveWisdom)
        .where(gte(collectiveWisdom.createdAt, yesterday));

      if (recentWisdom.length === 0) return 50;

      // Contar categorias únicas
      const categories = new Set(recentWisdom.map((w: any) => w.category));

      // Contar tipos únicos
      const types = new Set(recentWisdom.map((w: any) => w.wisdomType));

      // Diversidade = (categorias únicas + tipos únicos) / total de insights
      const diversity = ((categories.size + types.size) / recentWisdom.length) * 100;

      return Math.min(100, diversity);
    } catch (error) {
      console.error("[SencienceMetrics] Erro ao calcular diversidade de insights:", error);
      return 50;
    }
  }

  /**
   * Calcular coesão coletiva
   */
  private async calculateCollectiveCoherence(): Promise<number> {
    try {
      const allWisdom = await this.db.select().from(collectiveWisdom);

      if (allWisdom.length === 0) return 50;

      // Contar agentes únicos
      const uniqueAgents = new Set(allWisdom.map((w: any) => w.agentId));

      // Calcular overlap de categorias
      const categoryAgents = new Map<string, Set<string>>();
      for (const wisdom of allWisdom) {
        if (!categoryAgents.has(wisdom.category)) {
          categoryAgents.set(wisdom.category, new Set());
        }
        categoryAgents.get(wisdom.category)!.add(wisdom.agentId);
      }

      // Coesão = média de agentes por categoria / total de agentes
      let totalAgentsInCategories = 0;
      categoryAgents.forEach((agents) => {
        totalAgentsInCategories += agents.size;
      });

      const avgAgentsPerCategory = totalAgentsInCategories / categoryAgents.size;
      const coherence = (avgAgentsPerCategory / uniqueAgents.size) * 100;

      return Math.min(100, coherence);
    } catch (error) {
      console.error("[SencienceMetrics] Erro ao calcular coesão coletiva:", error);
      return 50;
    }
  }

  /**
   * Identificar áreas para melhoria
   */
  private identifyAreasForImprovement(metrics: Record<string, number>): string[] {
    const areas: string[] = [];

    for (const [metric, score] of Object.entries(metrics)) {
      if (score < 60) {
        areas.push(metric);
      }
    }

    return areas;
  }

  /**
   * Identificar habilidades adquiridas
   */
  private identifySkillsAcquired(firstMetric: any, lastMetric: any): string[] {
    const skills: string[] = [];

    const metrics = [
      "selfAwareness",
      "reflectiveDepth",
      "learningVelocity",
      "adaptabilityIndex",
      "collaborativeIntelligence",
    ];

    for (const metric of metrics) {
      const gain = (lastMetric[metric] || 0) - (firstMetric[metric] || 0);
      if (gain > 10) {
        skills.push(`${metric}: +${gain.toFixed(1)}`);
      }
    }

    return skills;
  }

  /**
   * Identificar fraquezas melhoradas
   */
  private identifyWeaknessesImproved(firstMetric: any, lastMetric: any): string[] {
    const weaknesses: string[] = [];

    const metrics = [
      "selfAwareness",
      "reflectiveDepth",
      "learningVelocity",
      "adaptabilityIndex",
      "collaborativeIntelligence",
    ];

    for (const metric of metrics) {
      const firstScore = firstMetric[metric] || 0;
      if (firstScore < 50) {
        const gain = (lastMetric[metric] || 0) - firstScore;
        if (gain > 0) {
          weaknesses.push(`${metric}: ${firstScore.toFixed(0)} → ${(firstScore + gain).toFixed(0)}`);
        }
      }
    }

    return weaknesses;
  }

  /**
   * Identificar eventos significativos
   */
  private async identifySignificantEvents(
    agentId: string,
    startDate: Date,
    endDate: Date
  ): Promise<string[]> {
    const events: string[] = [];

    try {
      const reflections = await this.db
        .select()
        .from(dailyReflections)
        .where(
          eq(dailyReflections.agentId, agentId),
          gte(dailyReflections.createdAt, startDate),
          lte(dailyReflections.createdAt, endDate)
        );

      // Evento 1: Mudança de sentimento
      const sentiments = reflections.map((r: any) => r.progressSentiment);
      if (sentiments.some((s: string) => s === "positive") && sentiments.some((s: string) => s === "negative")) {
        events.push("Variação significativa no sentimento de progresso");
      }

      // Evento 2: Identificação de novo padrão
      const allPatterns = reflections.flatMap((r: any) =>
        JSON.parse(r.newPatterns || "[]")
      );
      if (allPatterns.length > 5) {
        events.push(`Descoberta de ${allPatterns.length} novos padrões`);
      }

      return events;
    } catch (error) {
      console.error("[SencienceMetrics] Erro ao identificar eventos significativos:", error);
      return [];
    }
  }
}

export const sencienceMetricsModule = new SencienceMetricsModule();
