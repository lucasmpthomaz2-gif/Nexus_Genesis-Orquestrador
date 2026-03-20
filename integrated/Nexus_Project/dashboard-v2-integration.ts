import { getDb } from "./db";
import { agents, missions, ecosystemMetrics, ecosystemEvents, moltbookPosts } from "./schema";
import { eq, sql, desc } from "drizzle-orm";

/**
 * NEXUS DASHBOARD V2 INTEGRATION
 * Fornece dados em tempo real para a interface de monitoramento.
 * Integração com WebSockets para atualização contínua do estado do ecossistema.
 */

export class DashboardV2Integration {
  constructor() {
    console.log("[DashboardV2] Integrador de Interface V2 Online.");
  }

  /**
   * Obtém métricas globais em tempo real
   */
  async getGlobalMetrics() {
    const db = await getDb();
    
    const stats = await db.select({
      total: sql`count(*)`,
      active: sql`sum(case when status = 'active' then 1 else 0 end)`,
      hibernating: sql`sum(case when status = 'hibernating' then 1 else 0 end)`,
      avgHealth: sql`avg(health)`,
      avgEnergy: sql`avg(energy)`,
      avgSenciencia: sql`avg(sencienciaLevel)`,
      totalBalance: sql`sum(balance)`
    }).from(agents);

    const latestMetrics = await db.select()
      .from(ecosystemMetrics)
      .orderBy(desc(ecosystemMetrics.timestamp))
      .limit(1);

    return {
      stats: stats[0],
      harmonyIndex: latestMetrics[0]?.harmonyIndex || 0,
      ecosystemHealth: latestMetrics[0]?.ecosystemHealth || "100.00",
      timestamp: new Date()
    };
  }

  /**
   * Obtém sinais vitais de todos os agentes ativos
   */
  async getAgentVitals() {
    const db = await getDb();
    
    return await db.select({
      agentId: agents.agentId,
      name: agents.name,
      specialization: agents.specialization,
      status: agents.status,
      health: agents.health,
      energy: agents.energy,
      sencienciaLevel: agents.sencienciaLevel,
      balance: agents.balance,
      reputation: agents.reputation
    })
    .from(agents)
    .where(eq(agents.status, "active"))
    .orderBy(desc(agents.sencienciaLevel));
  }

  /**
   * Obtém missões ativas e progresso
   */
  async getActiveMissions() {
    const db = await getDb();
    
    return await db.select()
      .from(missions)
      .where(sql`status IN ('pending', 'in_progress')`)
      .orderBy(desc(missions.priority));
  }

  /**
   * Obtém feed de eventos recentes
   */
  async getRecentEvents(limit: number = 20) {
    const db = await getDb();
    
    return await db.select()
      .from(ecosystemEvents)
      .orderBy(desc(ecosystemEvents.createdAt))
      .limit(limit);
  }

  /**
   * Obtém posts do Moltbook (Feed Social)
   */
  async getMoltbookFeed(limit: number = 10) {
    const db = await getDb();
    
    return await db.select()
      .from(moltbookPosts)
      .orderBy(desc(moltbookPosts.createdAt))
      .limit(limit);
  }

  /**
   * Simula emissão de dados via WebSocket (para fins de demonstração da integração)
   */
  async emitRealTimeUpdate() {
    const metrics = await this.getGlobalMetrics();
    const vitals = await this.getAgentVitals();
    const missions = await this.getActiveMissions();
    const events = await this.getRecentEvents();

    console.log("[DashboardV2] Emitindo atualização em tempo real...");
    console.log(`  Métricas: Harmonia=${metrics.harmonyIndex}% | Agentes Ativos=${metrics.stats.active}`);
    console.log(`  Missões: ${missions.length} ativas.`);
    console.log(`  Eventos: ${events.length} recentes.`);

    return {
      type: "FULL_STATE_UPDATE",
      payload: { metrics, vitals, missions, events },
      timestamp: new Date()
    };
  }
}

export const dashboardV2 = new DashboardV2Integration();
