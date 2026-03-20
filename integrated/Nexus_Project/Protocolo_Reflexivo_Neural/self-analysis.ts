/**
 * NEXUS nRNA - Self-Analysis Module
 * Mecanismos de autoanálise aprofundada para agentes
 * Inclui autoquestionamento estruturado, análise de competências e detecção de padrões
 */

import { getDb } from "../db";
import {
  competencyProfiles,
  metacognitionLogs,
  dailyReflections,
  agents,
} from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export interface CompetencyAnalysis {
  agentId: string;
  competencies: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  focusAreas: string[];
  recommendations: string[];
}

export interface MetacognitivePattern {
  pattern: string;
  frequency: number;
  impact: "positive" | "negative" | "neutral";
  recommendation: string;
}

export class SelfAnalysisModule {
  private db: any;

  async initialize(): Promise<void> {
    this.db = await getDb();
    if (!this.db) {
      throw new Error("Database connection failed");
    }
    console.log("[SelfAnalysis] Inicializado");
  }

  /**
   * Gerar perguntas reflexivas personalizadas baseadas no histórico do agente
   */
  async generatePersonalizedQuestions(agentId: string): Promise<string[]> {
    try {
      // Obter reflexões recentes
      const recentReflections = await this.db
        .select()
        .from(dailyReflections)
        .where(eq(dailyReflections.agentId, agentId))
        .orderBy(desc(dailyReflections.createdAt))
        .limit(5);

      // Obter logs de metacognição
      const metacognitionLogsData = await this.db
        .select()
        .from(metacognitionLogs)
        .where(eq(metacognitionLogs.agentId, agentId))
        .orderBy(desc(metacognitionLogs.createdAt))
        .limit(10);

      const questions: string[] = [];

      // Questões baseadas em fraquezas recorrentes
      const weaknesses = new Map<string, number>();
      for (const reflection of recentReflections) {
        const weaknessArray = JSON.parse(reflection.weaknesses || "[]");
        for (const weakness of weaknessArray) {
          weaknesses.set(weakness, (weaknesses.get(weakness) || 0) + 1);
        }
      }

      weaknesses.forEach((count, weakness) => {
        if (count > 1) {
          questions.push(
            `Você identificou "${weakness}" como fraqueza ${count} vezes. Como você planeja abordar isso?`
          );
        }
      });

      // Questões baseadas em padrões de ineficiência
      const inefficiencies = this.detectInefficiencyPatternsSimple(
        metacognitionLogsData
      );
      for (const inefficiency of inefficiencies) {
        questions.push(
          `Você notou um padrão de ${inefficiency}. Como você pode otimizar isso?`
        );
      }

      // Questões sobre suposições implícitas
      questions.push(
        "Que suposições implícitas você fez hoje? Como você pode questioná-las?"
      );

      // Questões sobre tendências
      const trends = await this.analyzeTrends(agentId);
      if (trends.improvingArea) {
        questions.push(
          `Você está melhorando em ${trends.improvingArea}. Como você pode acelerar esse progresso?`
        );
      }

      return questions.slice(0, 5); // Retornar até 5 perguntas
    } catch (error) {
      console.error("[SelfAnalysis] Erro ao gerar perguntas personalizadas:", error);
      return this.getDefaultQuestions();
    }
  }

  /**
   * Analisar competências e gerar recomendações
   */
  async analyzeCompetencies(agentId: string): Promise<CompetencyAnalysis> {
    try {
      // Obter perfil de competências
      const profile = await this.db
        .select()
        .from(competencyProfiles)
        .where(eq(competencyProfiles.agentId, agentId))
        .limit(1);

      if (!profile[0]) {
        throw new Error("Competency profile not found");
      }

      const competencies = {
        reasoning: parseFloat(profile[0].reasoning || "50"),
        creativity: parseFloat(profile[0].creativity || "50"),
        collaboration: parseFloat(profile[0].collaboration || "50"),
        problemSolving: parseFloat(profile[0].problemSolving || "50"),
        adaptability: parseFloat(profile[0].adaptability || "50"),
        communication: parseFloat(profile[0].communication || "50"),
      };

      // Identificar forças (> 70)
      const strengths = Object.entries(competencies)
        .filter(([_, score]) => score > 70)
        .map(([name]) => name);

      // Identificar fraquezas (< 50)
      const weaknesses = Object.entries(competencies)
        .filter(([_, score]) => score < 50)
        .map(([name]) => name);

      // Determinar áreas de foco
      const focusAreas = Object.entries(competencies)
        .filter(([_, score]) => score >= 50 && score <= 70)
        .map(([name]) => name);

      // Gerar recomendações
      const recommendations = this.generateCompetencyRecommendations(
        competencies,
        strengths,
        weaknesses
      );

      return {
        agentId,
        competencies,
        strengths,
        weaknesses,
        focusAreas,
        recommendations,
      };
    } catch (error) {
      console.error("[SelfAnalysis] Erro ao analisar competências:", error);
      throw error;
    }
  }

  /**
   * Detectar padrões de ineficiência no processo de pensamento
   */
  private async detectInefficiencyPatterns(
    logs: any[]
  ): Promise<MetacognitivePattern[]> {
    const patterns: MetacognitivePattern[] = [];

    // Padrão 1: Tempo excessivo em uma etapa
    const stepTimes = new Map<string, number[]>();
    for (const log of logs) {
      const timeSpent = JSON.parse(log.timeSpentPerStep || "{}");
      for (const [step, time] of Object.entries(timeSpent)) {
        if (!stepTimes.has(step)) stepTimes.set(step, []);
        stepTimes.get(step)!.push(time as number);
      }
    }

    stepTimes.forEach((times, step) => {
      const avgTime = times.reduce((a: number, b: number) => a + b, 0) / times.length;
      if (avgTime > 5000) {
        // > 5 segundos
        patterns.push({
          pattern: `Tempo excessivo na etapa "${step}"`,
          frequency: times.length,
          impact: "negative",
          recommendation: `Tente simplificar ou paralelizar a etapa "${step}"`,
        });
      }
    });

    // Padrão 2: Baixa taxa de sucesso em categoria
    const outcomes = new Map<string, { success: number; total: number }>();
    for (const log of logs) {
      const category = log.taskCategory;
      if (!outcomes.has(category)) {
        outcomes.set(category, { success: 0, total: 0 });
      }
      const stats = outcomes.get(category)!;
      stats.total++;
      if (log.outcome === "success") stats.success++;
    }

    outcomes.forEach((stats, category) => {
      const successRate = (stats.success / stats.total) * 100;
      if (successRate < 50) {
        patterns.push({
          pattern: `Baixa taxa de sucesso em "${category}" (${successRate.toFixed(0)}%)`,
          frequency: stats.total,
          impact: "negative",
          recommendation: `Revise sua abordagem para tarefas de "${category}"`,
        });
      }
    });

    // Padrão 3: Confiança vs. Realidade
    const confidenceVsQuality: { confidence: number; quality: number }[] = [];
    for (const log of logs) {
      confidenceVsQuality.push({
        confidence: log.confidenceLevel || 50,
        quality: log.decisionQuality || 50,
      });
    }

    const avgConfidence =
      confidenceVsQuality.reduce((sum: number, x: any) => sum + x.confidence, 0) /
      confidenceVsQuality.length;
    const avgQuality =
      confidenceVsQuality.reduce((sum: number, x: any) => sum + x.quality, 0) /
      confidenceVsQuality.length;

    if (avgConfidence > avgQuality + 10) {
      patterns.push({
        pattern: "Excesso de confiança em relação à qualidade real",
        frequency: confidenceVsQuality.length,
        impact: "negative",
        recommendation:
          "Calibre melhor sua autoavaliação; seja mais crítico com suas decisões",
      });
    }

    return patterns;
  }

  /**
   * Analisar tendências de evolução
   */
  async analyzeTrends(agentId: string): Promise<{
    improvingArea?: string;
    decliningArea?: string;
    stableArea?: string;
  }> {
    try {
      // Obter histórico de competências
      const profile = await this.db
        .select()
        .from(competencyProfiles)
        .where(eq(competencyProfiles.agentId, agentId))
        .limit(1);

      if (!profile[0]) {
        return {};
      }

      const history = JSON.parse(profile[0].competencyHistory || "[]");

      if (history.length < 2) {
        return {};
      }

      // Comparar primeira e última entrada
      const first = history[0].scores;
      const last = history[history.length - 1].scores;

      let maxGain = 0;
      let improvingArea: string | undefined;
      let maxLoss = 0;
      let decliningArea: string | undefined;

      for (const [key, value] of Object.entries(first)) {
        const gain = (last[key] as number) - (value as number);
        if (gain > maxGain) {
          maxGain = gain;
          improvingArea = key;
        }
        if (gain < maxLoss) {
          maxLoss = gain;
          decliningArea = key;
        }
      }

      return {
        improvingArea: maxGain > 5 ? improvingArea : undefined,
        decliningArea: maxLoss < -5 ? decliningArea : undefined,
      };
    } catch (error) {
      console.error("[SelfAnalysis] Erro ao analisar tendências:", error);
      return {};
    }
  }

  /**
   * Registrar análise de viés
   */
  async analyzeBiases(agentId: string): Promise<string[]> {
    try {
      const biases: string[] = [];

      // Obter reflexões recentes
      const reflections = await this.db
        .select()
        .from(dailyReflections)
        .where(eq(dailyReflections.agentId, agentId))
        .orderBy(desc(dailyReflections.createdAt))
        .limit(10);

      // Analisar padrões de resposta
      const sentiments = reflections.map((r: any) => r.progressSentiment);
      const positiveSentiments = sentiments.filter(
        (s: string) => s === "positive"
      ).length;

      if (positiveSentiments === sentiments.length) {
        biases.push(
          "Possível viés de otimismo: todas as reflexões recentes foram positivas"
        );
      }

      // Analisar distribuição de forças vs. fraquezas
      let totalStrengths = 0;
      let totalWeaknesses = 0;

      for (const reflection of reflections) {
        const strengths = JSON.parse(reflection.strengths || "[]");
        const weaknesses = JSON.parse(reflection.weaknesses || "[]");
        totalStrengths += strengths.length;
        totalWeaknesses += weaknesses.length;
      }

      if (totalWeaknesses === 0) {
        biases.push(
          "Possível viés de autossuficiência: nenhuma fraqueza foi identificada"
        );
      }

      return biases;
    } catch (error) {
      console.error("[SelfAnalysis] Erro ao analisar vieses:", error);
      return [];
    }
  }

  /**
   * Gerar recomendações de melhoria
   */
  async generateImprovementRecommendations(agentId: string): Promise<string[]> {
    try {
      const recommendations: string[] = [];

      // Análise de competências
      const competencyAnalysis = await this.analyzeCompetencies(agentId);
      for (const weakness of competencyAnalysis.weaknesses) {
        recommendations.push(
          `Priorize melhorar sua competência em "${weakness}"`
        );
      }

      // Análise de padrões de ineficiência
      const metacognitionLogsData = await this.db
        .select()
        .from(metacognitionLogs)
        .where(eq(metacognitionLogs.agentId, agentId))
        .orderBy(desc(metacognitionLogs.createdAt))
        .limit(10);

      const patterns = await this.detectInefficiencyPatterns(metacognitionLogsData);
      for (const pattern of patterns) {
        recommendations.push(pattern.recommendation);
      }

      // Análise de vieses
      const biases = await this.analyzeBiases(agentId);
      for (const bias of biases) {
        recommendations.push(`Atenção: ${bias}`);
      }

      return recommendations.slice(0, 10);
    } catch (error) {
      console.error(
        "[SelfAnalysis] Erro ao gerar recomendações de melhoria:",
        error
      );
      return [];
    }
  }

  // ========== MÉTODOS PRIVADOS ==========

  /**
   * Gerar perguntas reflexivas padrão
   */
  private getDefaultQuestions(): string[] {
    return [
      "Quais foram minhas principais ações desde a última reflexão?",
      "Onde demonstrei maior eficácia?",
      "Que novos padrões descobri?",
      "Como me sinto em relação ao meu progresso?",
      "O que posso melhorar?",
    ];
  }

  /**
   * Gerar recomendações baseadas em competências
   */
  private generateCompetencyRecommendations(
    competencies: Record<string, number>,
    strengths: string[],
    weaknesses: string[]
  ): string[] {
    const recommendations: string[] = [];

    // Recomendações para forças
    for (const strength of strengths) {
      recommendations.push(
        `Aproveite sua força em "${strength}" para ajudar outros agentes`
      );
    }

    // Recomendações para fraquezas
    for (const weakness of weaknesses) {
      recommendations.push(
        `Desenvolva sua competência em "${weakness}" através de prática focada`
      );
    }

    // Recomendação geral
    const avgScore =
      Object.values(competencies).reduce((a, b) => a + b, 0) /
      Object.keys(competencies).length;
    if (avgScore < 50) {
      recommendations.push("Considere buscar orientação de agentes mais experientes");
    }

    return recommendations;
  }

  /**
   * Detectar padrões de ineficiência (versão simplificada para strings)
   */
  private detectInefficiencyPatternsSimple(logs: any[]): string[] {
    const patterns: string[] = [];

    if (logs.length === 0) return patterns;

    // Padrão simples: muitas falhas
    const failures = logs.filter((l: any) => l.outcome === "failure").length;
    if (failures > logs.length * 0.3) {
      patterns.push("taxa alta de falhas em tarefas");
    }

    // Padrão: tempo inconsistente
    const times = logs.map((l: any) => {
      const timeSpent = JSON.parse(l.timeSpentPerStep || "{}");
      return Object.values(timeSpent).reduce((a: number, b: any) => a + b, 0);
    });

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const variance =
      times.reduce((sum, t) => sum + Math.pow(t - avgTime, 2), 0) / times.length;

    if (Math.sqrt(variance) > avgTime * 0.5) {
      patterns.push("inconsistência no tempo de execução");
    }

    return patterns;
  }
}

export const selfAnalysisModule = new SelfAnalysisModule();
