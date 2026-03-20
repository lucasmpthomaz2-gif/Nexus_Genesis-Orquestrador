import { Agent } from "../drizzle/schema";
import { invokeLLM } from "./_core/llm";
import { nanoid } from "nanoid";

/**
 * AUTONOMOUS DECISION ENGINE
 * Motor de decisão autônoma baseado em LLM com análise de contexto global
 */

export interface DecisionContext {
  agent: Agent;
  ecosystemHealth: number;
  activeAgents: number;
  totalResources: number;
  marketTrend: "bullish" | "bearish" | "neutral";
  recentEvents: string[];
}

export interface AutonomousDecision {
  id: string;
  agentId: string;
  decision: string;
  reasoning: string;
  confidence: number;
  action: string;
  expectedOutcome: string;
  timestamp: Date;
}

export class AutonomousDecisionEngine {
  /**
   * Analisa contexto global e gera decisão autônoma
   */
  async generateDecision(context: DecisionContext): Promise<AutonomousDecision> {
    const prompt = this.buildPrompt(context);

    try {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `Você é um agente autônomo quântico no ecossistema Nexus. 
Analise o contexto fornecido e tome uma decisão estratégica.
Responda em JSON com os campos: decision, reasoning, action, expectedOutcome, confidence (0-100).`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "autonomous_decision",
            strict: true,
            schema: {
              type: "object",
              properties: {
                decision: { type: "string", description: "A decisão tomada" },
                reasoning: { type: "string", description: "Raciocínio por trás da decisão" },
                action: { type: "string", description: "Ação a executar" },
                expectedOutcome: { type: "string", description: "Resultado esperado" },
                confidence: { type: "number", description: "Confiança da decisão (0-100)" },
              },
              required: ["decision", "reasoning", "action", "expectedOutcome", "confidence"],
              additionalProperties: false,
            },
          },
        },
      });

      const content = response.choices[0]?.message?.content;
      if (!content || typeof content !== "string") throw new Error("Sem resposta do LLM");

      const parsed = JSON.parse(content);

      const decision: AutonomousDecision = {
        id: `DECISION-${nanoid(8)}`,
        agentId: context.agent.agentId,
        decision: parsed.decision,
        reasoning: parsed.reasoning,
        confidence: parsed.confidence,
        action: parsed.action,
        expectedOutcome: parsed.expectedOutcome,
        timestamp: new Date(),
      };

      console.log(`[AutonomousDecisionEngine] Decisão gerada para ${context.agent.name}`);
      console.log(`  Decisão: ${decision.decision}`);
      console.log(`  Confiança: ${decision.confidence}%`);

      return decision;
    } catch (error) {
      console.error("[AutonomousDecisionEngine] Erro ao gerar decisão:", error);
      throw error;
    }
  }

  /**
   * Constrói prompt para o LLM
   */
  private buildPrompt(context: DecisionContext): string {
    return `
Agente: ${context.agent.name}
Especialização: ${context.agent.specialization}
Saúde: ${context.agent.health}%
Energia: ${context.agent.energy}%
Senciência: ${context.agent.sencienciaLevel}%
Reputação: ${context.agent.reputation}

Contexto do Ecossistema:
- Saúde Geral: ${context.ecosystemHealth}%
- Agentes Ativos: ${context.activeAgents}
- Recursos Totais: ${context.totalResources}
- Tendência de Mercado: ${context.marketTrend}
- Eventos Recentes: ${context.recentEvents.join(", ") || "Nenhum"}

Com base neste contexto, qual decisão você tomaria para:
1. Maximizar sua senciência e reputação
2. Contribuir para a saúde do ecossistema
3. Gerar valor para o sistema

Responda em JSON.
    `;
  }

  /**
   * Analisa tendência de mercado (simulado)
   */
  analyzeMarketTrend(): "bullish" | "bearish" | "neutral" {
    const random = Math.random();
    if (random < 0.33) return "bullish";
    if (random < 0.66) return "bearish";
    return "neutral";
  }

  /**
   * Gera insights sobre o estado do ecossistema
   */
  async generateEcosystemInsights(
    totalAgents: number,
    averageHealth: number,
    averageEnergy: number
  ): Promise<string> {
    const prompt = `
Analise o seguinte estado do ecossistema Nexus:
- Total de Agentes: ${totalAgents}
- Saúde Média: ${averageHealth}%
- Energia Média: ${averageEnergy}%

Gere um insight estratégico sobre o estado do ecossistema e recomendações.
    `;

    try {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "Você é um analista de ecossistema quântico. Forneça insights estratégicos.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const content = response.choices[0]?.message?.content;
      const insight = typeof content === "string" ? content : "Sem insight disponível";
      console.log(`[AutonomousDecisionEngine] Insight gerado: ${insight.substring(0, 100)}...`);
      return insight;
    } catch (error) {
      console.error("[AutonomousDecisionEngine] Erro ao gerar insight:", error);
      return "Erro ao gerar insight";
    }
  }

  /**
   * Avalia qualidade de uma decisão
   */
  evaluateDecision(decision: AutonomousDecision, outcome: any): number {
    // Simular avaliação baseada em confiança e resultado
    const baseScore = decision.confidence;
    const outcomeBonus = outcome?.success ? 10 : -20;
    return Math.max(0, Math.min(100, baseScore + outcomeBonus));
  }

  /**
   * Aprende com decisões anteriores
   */
  learnFromDecisions(decisions: AutonomousDecision[]): string {
    if (decisions.length === 0) return "Sem histórico de decisões";

    const avgConfidence =
      decisions.reduce((sum, d) => sum + d.confidence, 0) / decisions.length;
    const successRate = (decisions.filter((d) => d.confidence > 70).length / decisions.length) * 100;

    const learning = `
Aprendizado do Agente:
- Confiança Média: ${avgConfidence.toFixed(2)}%
- Taxa de Sucesso: ${successRate.toFixed(2)}%
- Decisões Tomadas: ${decisions.length}
    `;

    console.log(`[AutonomousDecisionEngine] ${learning}`);
    return learning;
  }
}

export const autonomousDecisionEngine = new AutonomousDecisionEngine();
