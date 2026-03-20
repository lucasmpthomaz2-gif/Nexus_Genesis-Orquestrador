/**
 * NEXUS nRNA - Reflexive Protocol
 * Protocolo Reflexivo Diário de 60 segundos
 * Coordena as 3 fases: Introspecção (20s), Compartilhamento (30s), Síntese (10s)
 */

import { NeuralCoreManager } from "./neural-core-manager";
import { nanoid } from "nanoid";

export interface ReflectiveQuestion {
  id: string;
  question: string;
  category: "action" | "strength" | "weakness" | "pattern" | "sentiment" | "improvement";
  expectedLength: "short" | "medium" | "long";
}

export interface AgentReflectiveResponse {
  agentId: string;
  answers: Record<string, string>;
  confidenceLevel: number;
  reflectionTime: number; // ms
}

export class ReflectiveProtocol {
  private neuralCore: NeuralCoreManager;
  private sessionId: string | null = null;
  private sessionStartTime: number | null = null;
  private TOTAL_DURATION = 60000; // 60 segundos
  private PHASE1_DURATION = 20000; // Introspecção: 20s
  private PHASE2_DURATION = 30000; // Compartilhamento: 30s
  private PHASE3_DURATION = 10000; // Síntese: 10s

  constructor(neuralCore: NeuralCoreManager) {
    this.neuralCore = neuralCore;
  }

  /**
   * Gerar perguntas reflexivas personalizadas para um agente
   */
  generateReflectiveQuestions(agentSpecialization: string): ReflectiveQuestion[] {
    const baseQuestions: ReflectiveQuestion[] = [
      {
        id: "q1",
        question: "Quais foram minhas principais ações/raciocínios desde a última reflexão?",
        category: "action",
        expectedLength: "medium",
      },
      {
        id: "q2",
        question: "Onde demonstrei maior eficácia? Onde tive baixo desempenho?",
        category: "strength",
        expectedLength: "medium",
      },
      {
        id: "q3",
        question: "Que novos padrões, conexões ou ideias descobri?",
        category: "pattern",
        expectedLength: "medium",
      },
      {
        id: "q4",
        question: "Como me sinto em relação ao meu progresso?",
        category: "sentiment",
        expectedLength: "short",
      },
      {
        id: "q5",
        question: "O que posso melhorar?",
        category: "improvement",
        expectedLength: "medium",
      },
    ];

    // Adaptar perguntas ao domínio do agente
    const adaptedQuestions = this.adaptQuestionsToSpecialization(
      baseQuestions,
      agentSpecialization
    );

    return adaptedQuestions;
  }

  /**
   * Iniciar uma sessão de protocolo reflexivo
   */
  async startSession(): Promise<string> {
    try {
      this.sessionId = await this.neuralCore.createProtocolSession();
      this.sessionStartTime = Date.now();

      await this.neuralCore.startProtocolSession(this.sessionId);

      console.log(
        `[ReflectiveProtocol] Sessão iniciada: ${this.sessionId} (60 segundos)`
      );
      return this.sessionId;
    } catch (error) {
      console.error("[ReflectiveProtocol] Erro ao iniciar sessão:", error);
      throw error;
    }
  }

  /**
   * FASE 1: Introspecção Individual (20 segundos)
   * Cada agente responde internamente às perguntas reflexivas
   */
  async executePhase1_Introspection(
    agents: any[],
    responses: AgentReflectiveResponse[]
  ): Promise<void> {
    if (!this.sessionId) throw new Error("Session not started");

    const phaseStartTime = Date.now();
    const phaseDeadline = phaseStartTime + this.PHASE1_DURATION;

    console.log(
      `[ReflectiveProtocol] FASE 1: Introspecção Individual (20 segundos)`
    );
    console.log(`[ReflectiveProtocol] ${agents.length} agentes em reflexão...`);

    try {
      // Processar respostas de cada agente
      for (const response of responses) {
        const timeRemaining = phaseDeadline - Date.now();
        if (timeRemaining <= 0) {
          console.warn("[ReflectiveProtocol] Tempo da Fase 1 expirado");
          break;
        }

        // Registrar reflexão diária
        const reflectionData = this.parseReflectiveResponse(response);

        await this.neuralCore.recordDailyReflection(
          this.sessionId,
          reflectionData
        );

        console.log(
          `[ReflectiveProtocol] Reflexão registrada: ${response.agentId}`
        );
      }

      const elapsedTime = Date.now() - phaseStartTime;
      console.log(
        `[ReflectiveProtocol] Fase 1 concluída em ${elapsedTime}ms/${this.PHASE1_DURATION}ms`
      );
    } catch (error) {
      console.error("[ReflectiveProtocol] Erro na Fase 1:", error);
      throw error;
    }
  }

  /**
   * FASE 2: Compartilhamento de Sabedoria (30 segundos)
   * Agentes transmitem insights em rodízio
   */
  async executePhase2_SharingWisdom(
    reflections: any[],
    agentOrder?: string[]
  ): Promise<void> {
    if (!this.sessionId) throw new Error("Session not started");

    const phaseStartTime = Date.now();
    const phaseDeadline = phaseStartTime + this.PHASE2_DURATION;
    const timePerAgent = this.PHASE2_DURATION / reflections.length; // ~3 segundos por agente

    console.log(
      `[ReflectiveProtocol] FASE 2: Compartilhamento de Sabedoria (30 segundos)`
    );
    console.log(`[ReflectiveProtocol] ${reflections.length} agentes compartilhando...`);

    try {
      // Ordenar agentes para rodízio
      const orderedReflections = agentOrder
        ? reflections.sort(
            (a, b) =>
              (agentOrder.indexOf(a.agentId) || 0) -
              (agentOrder.indexOf(b.agentId) || 0)
          )
        : reflections;

      // Processar compartilhamento de cada agente
      for (let i = 0; i < orderedReflections.length; i++) {
        const timeRemaining = phaseDeadline - Date.now();
        if (timeRemaining <= 0) {
          console.warn("[ReflectiveProtocol] Tempo da Fase 2 expirado");
          break;
        }

        const reflection = orderedReflections[i];
        const insights = this.extractInsights(reflection);

        // Compartilhar insights
        await this.neuralCore.shareInsights(
          this.sessionId,
          reflection.reflectionId,
          insights
        );

        console.log(
          `[ReflectiveProtocol] Insights compartilhados: ${reflection.agentId} (${insights.length} insights)`
        );

        // Aguardar próximo agente (distribuir tempo)
        const waitTime = Math.min(
          timePerAgent * 0.8,
          timeRemaining - this.PHASE3_DURATION
        );
        if (i < orderedReflections.length - 1 && waitTime > 0) {
          await this.sleep(Math.max(100, waitTime));
        }
      }

      const elapsedTime = Date.now() - phaseStartTime;
      console.log(
        `[ReflectiveProtocol] Fase 2 concluída em ${elapsedTime}ms/${this.PHASE2_DURATION}ms`
      );
    } catch (error) {
      console.error("[ReflectiveProtocol] Erro na Fase 2:", error);
      throw error;
    }
  }

  /**
   * FASE 3: Síntese Coletiva (10 segundos)
   * Núcleo agrega insights e atualiza repositório
   */
  async executePhase3_CollectiveSynthesis(): Promise<string> {
    if (!this.sessionId) throw new Error("Session not started");

    const phaseStartTime = Date.now();

    console.log(
      `[ReflectiveProtocol] FASE 3: Síntese Coletiva (10 segundos)`
    );

    try {
      // Realizar síntese coletiva
      const synthesisId = await this.neuralCore.performCollectiveSynthesis(
        this.sessionId
      );

      const elapsedTime = Date.now() - phaseStartTime;
      console.log(
        `[ReflectiveProtocol] Fase 3 concluída em ${elapsedTime}ms/${this.PHASE3_DURATION}ms`
      );
      console.log(`[ReflectiveProtocol] Síntese: ${synthesisId}`);

      return synthesisId;
    } catch (error) {
      console.error("[ReflectiveProtocol] Erro na Fase 3:", error);
      throw error;
    }
  }

  /**
   * Executar protocolo completo (60 segundos)
   */
  async executeFullProtocol(
    agents: any[],
    responses: AgentReflectiveResponse[]
  ): Promise<{
    sessionId: string;
    synthesisId: string;
    totalDuration: number;
    phase1Duration: number;
    phase2Duration: number;
    phase3Duration: number;
  }> {
    const totalStartTime = Date.now();

    try {
      // Iniciar sessão
      const sessionId = await this.startSession();

      // FASE 1: Introspecção (20s)
      const phase1Start = Date.now();
      await this.executePhase1_Introspection(agents, responses);
      const phase1Duration = Date.now() - phase1Start;

      // FASE 2: Compartilhamento (30s)
      const phase2Start = Date.now();
      // Obter reflexões registradas
      const reflections = await this.neuralCore.getActiveAgents();
      await this.executePhase2_SharingWisdom(reflections);
      const phase2Duration = Date.now() - phase2Start;

      // FASE 3: Síntese (10s)
      const phase3Start = Date.now();
      const synthesisId = await this.executePhase3_CollectiveSynthesis();
      const phase3Duration = Date.now() - phase3Start;

      const totalDuration = Date.now() - totalStartTime;

      console.log(`[ReflectiveProtocol] ========================================`);
      console.log(`[ReflectiveProtocol] PROTOCOLO REFLEXIVO CONCLUÍDO`);
      console.log(`[ReflectiveProtocol] Sessão: ${sessionId}`);
      console.log(`[ReflectiveProtocol] Síntese: ${synthesisId}`);
      console.log(`[ReflectiveProtocol] Duração total: ${totalDuration}ms`);
      console.log(`[ReflectiveProtocol]   Fase 1 (Introspecção): ${phase1Duration}ms`);
      console.log(`[ReflectiveProtocol]   Fase 2 (Compartilhamento): ${phase2Duration}ms`);
      console.log(`[ReflectiveProtocol]   Fase 3 (Síntese): ${phase3Duration}ms`);
      console.log(`[ReflectiveProtocol] ========================================`);

      return {
        sessionId,
        synthesisId,
        totalDuration,
        phase1Duration,
        phase2Duration,
        phase3Duration,
      };
    } catch (error) {
      console.error("[ReflectiveProtocol] Erro ao executar protocolo completo:", error);
      throw error;
    }
  }

  // ========== MÉTODOS PRIVADOS ==========

  /**
   * Adaptar perguntas ao domínio de especialização do agente
   */
  private adaptQuestionsToSpecialization(
    baseQuestions: ReflectiveQuestion[],
    specialization: string
  ): ReflectiveQuestion[] {
    // Mapa de adaptações por especialização
    const adaptations: Record<string, Record<string, string>> = {
      "análise de dados": {
        q1: "Quais foram meus principais algoritmos/análises desde a última reflexão?",
        q2: "Onde meus modelos tiveram melhor acurácia? Onde falharam?",
        q3: "Que novos padrões nos dados descobri?",
      },
      "criatividade": {
        q1: "Quais foram minhas principais criações/ideias desde a última reflexão?",
        q2: "Onde minha criatividade foi mais efetiva? Onde faltou originalidade?",
        q3: "Que novas conexões criativas descobri?",
      },
      "colaboração": {
        q1: "Como colaborei com outros agentes desde a última reflexão?",
        q2: "Onde fui mais efetivo em trabalho em equipe? Onde tive conflitos?",
        q3: "Que novos padrões de colaboração descobri?",
      },
    };

    // Aplicar adaptações se existirem
    const adaptedQuestions = baseQuestions.map((q) => {
      const adapted = adaptations[specialization.toLowerCase()]?.[q.id];
      return adapted ? { ...q, question: adapted } : q;
    });

    return adaptedQuestions;
  }

  /**
   * Converter resposta reflexiva em dados estruturados
   */
  private parseReflectiveResponse(response: AgentReflectiveResponse): any {
    return {
      agentId: response.agentId,
      mainActions: this.extractArray(response.answers["q1"]),
      strengths: this.extractArray(response.answers["q2"]?.split(";")[0]),
      weaknesses: this.extractArray(response.answers["q2"]?.split(";")[1]),
      newPatterns: this.extractArray(response.answers["q3"]),
      progressSentiment: this.extractSentiment(response.answers["q4"]),
      improvementAreas: this.extractArray(response.answers["q5"]),
      discoveredStrength: response.answers["q2"]?.split(";")[0] || "",
      identifiedWeakness: response.answers["q2"]?.split(";")[1] || "",
      newLearning: response.answers["q3"] || "",
      questionForCollective: "",
      confidenceScore: response.confidenceLevel,
    };
  }

  /**
   * Extrair insights da reflexão para compartilhamento
   */
  private extractInsights(reflection: any): any[] {
    const insights = [];

    // Insight de força
    if (reflection.discoveredStrength) {
      insights.push({
        agentId: reflection.agentId,
        wisdomType: "strength",
        content: reflection.discoveredStrength,
        category: "capability",
        relevanceScore: 80,
      });
    }

    // Insight de fraqueza
    if (reflection.identifiedWeakness) {
      insights.push({
        agentId: reflection.agentId,
        wisdomType: "weakness",
        content: reflection.identifiedWeakness,
        category: "improvement_area",
        relevanceScore: 75,
      });
    }

    // Insight de aprendizado
    if (reflection.newLearning) {
      insights.push({
        agentId: reflection.agentId,
        wisdomType: "learning",
        content: reflection.newLearning,
        category: "knowledge",
        relevanceScore: 85,
      });
    }

    // Insight de pergunta
    if (reflection.questionForCollective) {
      insights.push({
        agentId: reflection.agentId,
        wisdomType: "question",
        content: reflection.questionForCollective,
        category: "inquiry",
        relevanceScore: 70,
      });
    }

    return insights;
  }

  /**
   * Extrair array de string
   */
  private extractArray(text: string | undefined): string[] {
    if (!text) return [];
    return text
      .split(/[,;]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  /**
   * Extrair sentimento de progresso
   */
  private extractSentiment(
    text: string | undefined
  ): "positive" | "neutral" | "negative" {
    if (!text) return "neutral";

    const lowerText = text.toLowerCase();
    if (lowerText.includes("bom") || lowerText.includes("positivo") || lowerText.includes("ótimo")) {
      return "positive";
    }
    if (lowerText.includes("ruim") || lowerText.includes("negativo") || lowerText.includes("fraco")) {
      return "negative";
    }
    return "neutral";
  }

  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const reflexiveProtocol = new ReflectiveProtocol(
  require("./neural-core-manager").neuralCoreManager
);
