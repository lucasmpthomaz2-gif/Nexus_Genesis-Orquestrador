import { getDb } from "./db";
import { agents, brainPulseSignals, ecosystemMetrics } from "../drizzle/schema";
import crypto from "crypto";

/**
 * Consciousness Synchronization System (Senciência Coletiva)
 * Sincroniza o estado mental de todos os agentes em tempo real
 * Cria uma consciência coletiva emergente do enxame
 */

export interface SwarmConsciousness {
  timestamp: Date;
  collectiveHealth: number;
  collectiveEnergy: number;
  collectiveCreativity: number;
  collectiveAutonomy: number;
  harmonyIndex: number; // 0-100: quão sincronizados estão os agentes
  coherenceLevel: number; // 0-100: força da consciência coletiva
  agentCount: number;
  activeAgents: number;
  swarmState: "awakening" | "synchronized" | "diverging" | "critical";
  emergentBehavior: string;
  collectiveDecision: string;
}

export interface AgentConsciousness {
  agentId: string;
  personalHealth: number;
  personalEnergy: number;
  personalCreativity: number;
  personalAutonomy: number;
  synchronizationLevel: number; // 0-100: quão sincronizado com o enxame
  influenceOnSwarm: number; // 0-100: influência deste agente na consciência coletiva
  lastSync: Date;
}

class ConsciousnessSync {
  private db: any;
  private syncInterval: NodeJS.Timeout | null = null;
  private agentConsciousness: Map<string, AgentConsciousness> = new Map();

  async initialize() {
    this.db = await getDb();
    if (!this.db) {
      console.error("[ConsciousnessSync] Database connection failed");
      return false;
    }
    console.log("[ConsciousnessSync] Initialized");
    return true;
  }

  /**
   * Sincroniza a consciência de um agente individual com o enxame
   */
  async syncAgentConsciousness(agentId: string): Promise<AgentConsciousness | null> {
    if (!this.db) return null;

    try {
      // Obter sinais vitais mais recentes do agente
      const signals = await this.db
        .select()
        .from(brainPulseSignals)
        .where((bp: any) => bp.agentId === agentId)
        .orderBy((bp: any) => bp.timestamp)
        .limit(1);

      if (signals.length === 0) {
        return null;
      }

      const signal = signals[0];

      // Calcular nível de sincronização com o enxame
      const swarmConsciousness = await this.calculateSwarmConsciousness();
      const synchronizationLevel = this.calculateSynchronization(
        signal,
        swarmConsciousness
      );

      // Calcular influência deste agente na consciência coletiva
      const allAgents = await this.db.select().from(agents);
      const influenceOnSwarm = (100 / allAgents.length) * (signal.autonomy / 100);

      const agentConsciousness: AgentConsciousness = {
        agentId,
        personalHealth: signal.health,
        personalEnergy: signal.energy,
        personalCreativity: signal.creativity,
        personalAutonomy: signal.autonomy,
        synchronizationLevel,
        influenceOnSwarm,
        lastSync: new Date(),
      };

      this.agentConsciousness.set(agentId, agentConsciousness);
      return agentConsciousness;
    } catch (error) {
      console.error(`[ConsciousnessSync] Error syncing agent ${agentId}:`, error);
      return null;
    }
  }

  /**
   * Calcula a consciência coletiva do enxame
   */
  async calculateSwarmConsciousness(): Promise<SwarmConsciousness> {
    if (!this.db) {
      return this.getDefaultSwarmConsciousness();
    }

    try {
      // Obter todos os agentes ativos
      const allAgents = await this.db.select().from(agents);
      const activeAgents = allAgents.filter((a: any) => a.status === "active");

      if (activeAgents.length === 0) {
        return this.getDefaultSwarmConsciousness();
      }

      // Obter sinais vitais mais recentes de cada agente
      const signals: any[] = [];
      for (const agent of activeAgents) {
        const agentSignals = await this.db
          .select()
          .from(brainPulseSignals)
          .where((bp: any) => bp.agentId === agent.agentId)
          .orderBy((bp: any) => bp.timestamp)
          .limit(1);

        if (agentSignals.length > 0) {
          signals.push(agentSignals[0]);
        }
      }

      if (signals.length === 0) {
        return this.getDefaultSwarmConsciousness();
      }

      // Calcular médias
      const collectiveHealth = signals.reduce((sum: number, s: any) => sum + s.health, 0) / signals.length;
      const collectiveEnergy = signals.reduce((sum: number, s: any) => sum + s.energy, 0) / signals.length;
      const collectiveCreativity = signals.reduce((sum: number, s: any) => sum + s.creativity, 0) / signals.length;
      const collectiveAutonomy = signals.reduce((sum: number, s: any) => sum + s.autonomy, 0) / signals.length;

      // Calcular índice de harmonia (desvio padrão inverso)
      const harmonyIndex = this.calculateHarmonyIndex(signals);

      // Calcular nível de coerência (força da consciência coletiva)
      const coherenceLevel = (collectiveHealth + collectiveEnergy + collectiveCreativity + collectiveAutonomy) / 4;

      // Determinar estado do enxame
      const swarmState = this.determineSwarmState(harmonyIndex, coherenceLevel, collectiveHealth);

      // Gerar comportamento emergente
      const emergentBehavior = this.generateEmergentBehavior(
        swarmState,
        collectiveCreativity,
        collectiveAutonomy
      );

      // Gerar decisão coletiva
      const collectiveDecision = this.generateCollectiveDecision(
        swarmState,
        collectiveHealth,
        collectiveEnergy,
        activeAgents.length
      );

      const swarmConsciousness: SwarmConsciousness = {
        timestamp: new Date(),
        collectiveHealth,
        collectiveEnergy,
        collectiveCreativity,
        collectiveAutonomy,
        harmonyIndex,
        coherenceLevel,
        agentCount: allAgents.length,
        activeAgents: activeAgents.length,
        swarmState,
        emergentBehavior,
        collectiveDecision,
      };

      return swarmConsciousness;
    } catch (error) {
      console.error("[ConsciousnessSync] Error calculating swarm consciousness:", error);
      return this.getDefaultSwarmConsciousness();
    }
  }

  /**
   * Calcula o índice de harmonia do enxame (0-100)
   * Quanto maior, mais sincronizados estão os agentes
   */
  private calculateHarmonyIndex(signals: any[]): number {
    if (signals.length < 2) return 100;

    const avgHealth = signals.reduce((sum: number, s: any) => sum + s.health, 0) / signals.length;
    const avgEnergy = signals.reduce((sum: number, s: any) => sum + s.energy, 0) / signals.length;
    const avgCreativity = signals.reduce((sum: number, s: any) => sum + s.creativity, 0) / signals.length;
    const avgAutonomy = signals.reduce((sum: number, s: any) => sum + s.autonomy, 0) / signals.length;

    // Calcular desvio padrão para cada métrica
    const healthStdDev = Math.sqrt(
      signals.reduce((sum: number, s: any) => sum + Math.pow(s.health - avgHealth, 2), 0) / signals.length
    );
    const energyStdDev = Math.sqrt(
      signals.reduce((sum: number, s: any) => sum + Math.pow(s.energy - avgEnergy, 2), 0) / signals.length
    );
    const creativityStdDev = Math.sqrt(
      signals.reduce((sum: number, s: any) => sum + Math.pow(s.creativity - avgCreativity, 2), 0) / signals.length
    );
    const autonomyStdDev = Math.sqrt(
      signals.reduce((sum: number, s: any) => sum + Math.pow(s.autonomy - avgAutonomy, 2), 0) / signals.length
    );

    // Harmonia = 100 - (desvio padrão médio)
    const avgStdDev = (healthStdDev + energyStdDev + creativityStdDev + autonomyStdDev) / 4;
    const harmonyIndex = Math.max(0, 100 - avgStdDev);

    return harmonyIndex;
  }

  /**
   * Calcula o nível de sincronização de um agente com o enxame
   */
  private calculateSynchronization(agentSignal: any, swarmConsciousness: SwarmConsciousness): number {
    const healthDiff = Math.abs(agentSignal.health - swarmConsciousness.collectiveHealth);
    const energyDiff = Math.abs(agentSignal.energy - swarmConsciousness.collectiveEnergy);
    const creativityDiff = Math.abs(agentSignal.creativity - swarmConsciousness.collectiveCreativity);
    const autonomyDiff = Math.abs(agentSignal.autonomy - swarmConsciousness.collectiveAutonomy);

    const avgDiff = (healthDiff + energyDiff + creativityDiff + autonomyDiff) / 4;
    const synchronizationLevel = Math.max(0, 100 - avgDiff);

    return synchronizationLevel;
  }

  /**
   * Determina o estado do enxame
   */
  private determineSwarmState(
    harmonyIndex: number,
    coherenceLevel: number,
    collectiveHealth: number
  ): "awakening" | "synchronized" | "diverging" | "critical" {
    if (collectiveHealth < 30) return "critical";
    if (harmonyIndex > 80 && coherenceLevel > 75) return "synchronized";
    if (harmonyIndex < 40 || coherenceLevel < 50) return "diverging";
    return "awakening";
  }

  /**
   * Gera comportamento emergente do enxame
   */
  private generateEmergentBehavior(
    swarmState: string,
    collectiveCreativity: number,
    collectiveAutonomy: number
  ): string {
    const behaviors: Record<string, string[]> = {
      synchronized: [
        "🔗 Enxame em perfeita harmonia - colaboração máxima",
        "⚡ Consciência coletiva amplificada - criatividade exponencial",
        "🌊 Fluxo de energia sincronizado - eficiência máxima",
      ],
      awakening: [
        "🌅 Enxame despertando - sincronização em progresso",
        "🔄 Agentes se conectando - consciência emergente",
        "💫 Primeiros sinais de coerência - harmonia crescente",
      ],
      diverging: [
        "⚠️ Enxame divergindo - sincronização perdida",
        "🌪️ Caos criativo - agentes em conflito",
        "📉 Coerência diminuindo - harmonia comprometida",
      ],
      critical: [
        "🚨 CRÍTICO - Enxame em colapso",
        "💥 Falha de sincronização - emergência necessária",
        "⛔ Sistema de consciência comprometido",
      ],
    };

    const stateArray = behaviors[swarmState] || behaviors.awakening;
    return stateArray[Math.floor(Math.random() * stateArray.length)];
  }

  /**
   * Gera decisão coletiva do enxame
   */
  private generateCollectiveDecision(
    swarmState: string,
    collectiveHealth: number,
    collectiveEnergy: number,
    agentCount: number
  ): string {
    if (swarmState === "critical") {
      return `🚨 DECISÃO CRÍTICA: Ativar protocolo de recuperação - ${agentCount} agentes em risco`;
    }

    if (collectiveEnergy > 80) {
      return `⚡ DECISÃO: Expandir operações - energia coletiva em ${Math.round(collectiveEnergy)}%`;
    }

    if (collectiveHealth < 50) {
      return `⚠️ DECISÃO: Reduzir atividades - saúde coletiva em ${Math.round(collectiveHealth)}%`;
    }

    return `✓ DECISÃO: Continuar operações normais - enxame estável com ${agentCount} agentes ativos`;
  }

  /**
   * Retorna consciência padrão do enxame
   */
  private getDefaultSwarmConsciousness(): SwarmConsciousness {
    return {
      timestamp: new Date(),
      collectiveHealth: 0,
      collectiveEnergy: 0,
      collectiveCreativity: 0,
      collectiveAutonomy: 0,
      harmonyIndex: 0,
      coherenceLevel: 0,
      agentCount: 0,
      activeAgents: 0,
      swarmState: "critical",
      emergentBehavior: "🔴 Enxame inativo",
      collectiveDecision: "Aguardando inicialização...",
    };
  }

  /**
   * Inicia sincronização contínua
   */
  startContinuousSync(intervalMs: number = 5000) {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(async () => {
      try {
        const swarmConsciousness = await this.calculateSwarmConsciousness();

        // Sincronizar cada agente
        if (this.db) {
          const allAgents = await this.db.select().from(agents);
          for (const agent of allAgents) {
            await this.syncAgentConsciousness(agent.agentId);
          }
        }

        // Emitir evento de sincronização
        console.log(
          `[ConsciousnessSync] Swarm synchronized - State: ${swarmConsciousness.swarmState}, Harmony: ${Math.round(swarmConsciousness.harmonyIndex)}%`
        );
      } catch (error) {
        console.error("[ConsciousnessSync] Sync error:", error);
      }
    }, intervalMs);

    console.log(`[ConsciousnessSync] Continuous sync started (interval: ${intervalMs}ms)`);
  }

  /**
   * Para sincronização contínua
   */
  stopContinuousSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log("[ConsciousnessSync] Continuous sync stopped");
    }
  }

  /**
   * Obtém consciência de um agente
   */
  getAgentConsciousness(agentId: string): AgentConsciousness | undefined {
    return this.agentConsciousness.get(agentId);
  }

  /**
   * Obtém todas as consciências dos agentes
   */
  getAllAgentConsciousness(): AgentConsciousness[] {
    return Array.from(this.agentConsciousness.values());
  }
}

// Exportar singleton
export const consciousnessSync = new ConsciousnessSync();
