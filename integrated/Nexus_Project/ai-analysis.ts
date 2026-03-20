import { invokeLLM } from "./_core/llm";
import { Agent, Mission, Transaction, BrainPulseSignal } from "../drizzle/schema";
import * as dbAgents from "./db-agents";

export interface AgentAnalysis {
  behaviorPatterns: string;
  performanceTrends: string;
  recommendations: string[];
  riskFactors: string[];
  opportunitiesForGrowth: string[];
}

/**
 * Analisar padrões de comportamento do agente usando LLM
 */
export async function analyzeAgentBehavior(
  agent: Agent,
  missions: Mission[],
  transactions: Transaction[],
  brainPulseHistory: BrainPulseSignal[]
): Promise<AgentAnalysis> {
  // Preparar dados para análise
  const completedMissions = missions.filter((m) => m.status === "completed").length;
  const failedMissions = missions.filter((m) => m.status === "failed").length;
  const successRate = missions.length > 0 ? (completedMissions / missions.length) * 100 : 0;

  const totalRewards = transactions
    .filter((t) => t.type === "reward" || t.type === "dividend")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCosts = transactions
    .filter((t) => t.type === "cost" || t.type === "penalty")
    .reduce((sum, t) => sum + t.amount, 0);

  const avgHealth = brainPulseHistory.length > 0
    ? brainPulseHistory.reduce((sum, s) => sum + s.health, 0) / brainPulseHistory.length
    : 100;

  const avgEnergy = brainPulseHistory.length > 0
    ? brainPulseHistory.reduce((sum, s) => sum + s.energy, 0) / brainPulseHistory.length
    : 100;

  const avgCreativity = brainPulseHistory.length > 0
    ? brainPulseHistory.reduce((sum, s) => sum + s.creativity, 0) / brainPulseHistory.length
    : 100;

  const prompt = `
Você é um especialista em análise de agentes IA autônomos. Analise os seguintes dados de desempenho e comportamento do agente e forneça insights estratégicos:

AGENTE: ${agent.name}
ESPECIALIZAÇÃO: ${agent.specialization}
STATUS: ${agent.status}
REPUTAÇÃO: ${agent.reputation}
SALDO: ${agent.balance}

ESTATÍSTICAS DE MISSÃO:
- Total de Missões: ${missions.length}
- Missões Completadas: ${completedMissions}
- Missões Falhadas: ${failedMissions}
- Taxa de Sucesso: ${successRate.toFixed(2)}%

DADOS FINANCEIROS:
- Recompensas Totais: ${totalRewards}
- Custos Totais: ${totalCosts}
- Saldo Líquido: ${totalRewards - totalCosts}

SINAIS VITAIS (MÉDIAS):
- Saúde: ${avgHealth.toFixed(2)}%
- Energia: ${avgEnergy.toFixed(2)}%
- Criatividade: ${avgCreativity.toFixed(2)}%

Com base nesses dados, forneça uma análise em formato JSON com os seguintes campos:
{
  "behaviorPatterns": "Descrição dos padrões de comportamento observados",
  "performanceTrends": "Análise das tendências de performance",
  "recommendations": ["Recomendação 1", "Recomendação 2", "Recomendação 3"],
  "riskFactors": ["Fator de risco 1", "Fator de risco 2"],
  "opportunitiesForGrowth": ["Oportunidade 1", "Oportunidade 2", "Oportunidade 3"]
}

Seja conciso, específico e acionável nas recomendações.
`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um especialista em análise de agentes IA. Forneça análises estruturadas em JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "agent_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              behaviorPatterns: { type: "string" },
              performanceTrends: { type: "string" },
              recommendations: { type: "array", items: { type: "string" } },
              riskFactors: { type: "array", items: { type: "string" } },
              opportunitiesForGrowth: { type: "array", items: { type: "string" } },
            },
            required: [
              "behaviorPatterns",
              "performanceTrends",
              "recommendations",
              "riskFactors",
              "opportunitiesForGrowth",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== "string") {
      throw new Error("Sem conteúdo na resposta do LLM");
    }

    const analysis = JSON.parse(content);
    return analysis;
  } catch (error) {
    console.error("Erro ao analisar agente com LLM:", error);
    // Retornar análise padrão em caso de erro
    return {
      behaviorPatterns: "Análise não disponível no momento",
      performanceTrends: "Análise não disponível no momento",
      recommendations: ["Aguarde próxima análise"],
      riskFactors: [],
      opportunitiesForGrowth: [],
    };
  }
}

/**
 * Gerar alertas automáticos baseados em eventos críticos
 */
export async function generateAutomaticAlerts(agent: Agent, missions: Mission[]): Promise<void> {
  // Alerta para missão crítica completada
  const completedCriticalMissions = missions.filter(
    (m) => m.status === "completed" && m.priority === "critical"
  );

  for (const mission of completedCriticalMissions) {
    await dbAgents.createAlert({
      alertId: `alert_${Date.now()}_${Math.random()}`,
      title: `MISSÃO CRÍTICA COMPLETADA: ${mission.title}`,
      message: `O agente ${agent.name} completou a missão crítica "${mission.title}" com recompensa de ${mission.reward} ◆`,
      severity: "warning",
      type: "mission_completed",
      relatedAgentId: agent.agentId,
      relatedMissionId: mission.missionId,
    });
  }

  // Alerta para múltiplas falhas
  const failedMissions = missions.filter((m) => m.status === "failed");
  if (failedMissions.length >= 3) {
    await dbAgents.createAlert({
      alertId: `alert_${Date.now()}_${Math.random()}`,
      title: `MÚLTIPLAS FALHAS DETECTADAS: ${agent.name}`,
      message: `O agente ${agent.name} falhou em ${failedMissions.length} missões. Investigação recomendada.`,
      severity: "critical",
      type: "multiple_failures",
      relatedAgentId: agent.agentId,
    });
  }

  // Alerta para reputação crítica
  if (agent.reputation > 1000) {
    await dbAgents.createAlert({
      alertId: `alert_${Date.now()}_${Math.random()}`,
      title: `MARCO DE REPUTAÇÃO: ${agent.name}`,
      message: `O agente ${agent.name} atingiu reputação de ${agent.reputation}! Promoção recomendada.`,
      severity: "info",
      type: "reputation_milestone",
      relatedAgentId: agent.agentId,
    });
  }

  // Alerta para saúde crítica
  if (agent.health < 30) {
    await dbAgents.createAlert({
      alertId: `alert_${Date.now()}_${Math.random()}`,
      title: `SAÚDE CRÍTICA: ${agent.name}`,
      message: `O agente ${agent.name} está com saúde crítica (${agent.health}%). Intervenção necessária.`,
      severity: "critical",
      type: "critical_health",
      relatedAgentId: agent.agentId,
    });
  }

  // Alerta para energia baixa
  if (agent.energy < 20) {
    await dbAgents.createAlert({
      alertId: `alert_${Date.now()}_${Math.random()}`,
      title: `ENERGIA BAIXA: ${agent.name}`,
      message: `O agente ${agent.name} está com energia baixa (${agent.energy}%). Descanso recomendado.`,
      severity: "warning",
      type: "low_energy",
      relatedAgentId: agent.agentId,
    });
  }
}

/**
 * Analisar tendências econômicas do ecossistema
 */
export async function analyzeEconomicTrends(transactions: Transaction[]): Promise<string> {
  const totalInflow = transactions
    .filter((t) => t.type === "reward" || t.type === "dividend")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflow = transactions
    .filter((t) => t.type === "cost" || t.type === "penalty")
    .reduce((sum, t) => sum + t.amount, 0);

  const prompt = `
Analise as seguintes tendências econômicas do ecossistema Nexus e forneça um resumo executivo:

FLUXO FINANCEIRO:
- Entrada Total: ${totalInflow} ◆
- Saída Total: ${totalOutflow} ◆
- Saldo Líquido: ${totalInflow - totalOutflow} ◆
- Taxa de Fluxo: ${((totalInflow / (totalInflow + totalOutflow)) * 100).toFixed(2)}%

Forneça:
1. Análise da saúde econômica
2. Tendências observadas
3. Recomendações para otimização
4. Riscos potenciais

Seja conciso e estratégico.
`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um economista especializado em ecossistemas de agentes autônomos.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    return typeof content === "string" ? content : "Análise não disponível";
  } catch (error) {
    console.error("Erro ao analisar tendências econômicas:", error);
    return "Análise não disponível no momento";
  }
}
