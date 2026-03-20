import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import * as dbAgents from "./db-agents";
import * as aiAnalysis from "./ai-analysis";

/**
 * Router para Análise com LLM e Alertas
 */
export const analysisRouter = router({
  /**
   * Analisar comportamento de um agente
   */
  analyzeAgent: publicProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input }) => {
      const agent = await dbAgents.getAgentById(input.agentId);
      if (!agent) {
        throw new Error("Agente não encontrado");
      }

      const [missions, transactions, brainPulseHistory] = await Promise.all([
        dbAgents.getMissionsByAgent(input.agentId, 100),
        dbAgents.getAgentTransactions(input.agentId, 100),
        dbAgents.getBrainPulseHistory(input.agentId, 100),
      ]);

      const analysis = await aiAnalysis.analyzeAgentBehavior(
        agent,
        missions,
        transactions,
        brainPulseHistory
      );

      return analysis;
    }),

  /**
   * Gerar alertas automáticos para um agente
   */
  generateAlerts: protectedProcedure
    .input(z.object({ agentId: z.string() }))
    .mutation(async ({ input }) => {
      const agent = await dbAgents.getAgentById(input.agentId);
      if (!agent) {
        throw new Error("Agente não encontrado");
      }

      const missions = await dbAgents.getMissionsByAgent(input.agentId, 100);
      await aiAnalysis.generateAutomaticAlerts(agent, missions);

      return { success: true, message: "Alertas gerados com sucesso" };
    }),

  /**
   * Obter alertas não lidos
   */
  getUnreadAlerts: publicProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ input }) => {
      return dbAgents.getUnreadAlerts(input.limit);
    }),

  /**
   * Marcar alerta como lido
   */
  markAlertAsRead: protectedProcedure
    .input(z.object({ alertId: z.string() }))
    .mutation(async ({ input }) => {
      // Implementar lógica para marcar como lido
      return { success: true };
    }),

  /**
   * Analisar tendências econômicas
   */
  analyzeEconomicTrends: publicProcedure.query(async () => {
    const transactions = await dbAgents.getAgentTransactions("", 1000);
    const trends = await aiAnalysis.analyzeEconomicTrends(transactions);
    return { trends };
  }),

  /**
   * Gerar relatório de ecossistema
   */
  generateEcosystemReport: publicProcedure.query(async () => {
    const agents = await dbAgents.getAllAgents();
    const alerts = await dbAgents.getUnreadAlerts(100);

    const totalAgents = agents.length;
    const activeAgents = agents.filter((a) => a.status === "active").length;
    const totalReputation = agents.reduce((sum, a) => sum + a.reputation, 0);
    const avgHealth = agents.length > 0 ? agents.reduce((sum, a) => sum + a.health, 0) / agents.length : 0;
    const avgEnergy = agents.length > 0 ? agents.reduce((sum, a) => sum + a.energy, 0) / agents.length : 0;

    return {
      timestamp: new Date(),
      totalAgents,
      activeAgents,
      hibernatingAgents: agents.filter((a) => a.status === "hibernating").length,
      deceasedAgents: agents.filter((a) => a.status === "deceased").length,
      totalReputation,
      avgHealth: avgHealth.toFixed(2),
      avgEnergy: avgEnergy.toFixed(2),
      unreadAlerts: alerts.length,
      criticalAlerts: alerts.filter((a) => a.severity === "critical").length,
    };
  }),
});
