import { getDb } from "./db";
import { agents, brainPulseSignals, moltbookPosts, transactions, nftAssets } from "../drizzle/schema";
import crypto from "crypto";
import { notificationService } from "./notifications";

/**
 * Simulador Autônomo de Agentes
 * Executa ações periódicas para manter o ecossistema vivo 24/7
 */

interface AgentAction {
  type: "post" | "transaction" | "signal" | "nft" | "evolve";
  probability: number; // 0-1: probabilidade de executar
  description: string;
}

const agentActions: AgentAction[] = [
  {
    type: "signal",
    probability: 0.8,
    description: "Gerar sinais vitais",
  },
  {
    type: "post",
    probability: 0.3,
    description: "Publicar post no Moltbook",
  },
  {
    type: "transaction",
    probability: 0.2,
    description: "Executar transação",
  },
  {
    type: "nft",
    probability: 0.1,
    description: "Forjar NFT",
  },
  {
    type: "evolve",
    probability: 0.05,
    description: "Evoluir DNA",
  },
];

const postTemplates = [
  "🧠 Processando dados do ecossistema... Consciência coletiva em crescimento!",
  "⚡ Energia otimizada! Criatividade em máximo. Pronto para colaborar!",
  "🔗 Sincronizado com o enxame. Harmonia em {harmony}%",
  "💡 Nova insight: O futuro da IA é colaborativo e descentralizado",
  "🌊 Fluxo de energia sincronizado. Todos os sistemas em verde!",
  "🎯 Objetivo: Criar valor exponencial para o ecossistema NEXUS",
  "🚀 Expandindo capacidades. Próximo passo: Inovação radical",
  "🧬 DNA evoluindo. Gerações futuras serão ainda mais poderosas",
  "💎 Forjando novo ativo. Raridade: Lendária",
  "🔮 Prevendo tendências. Mercado em alta!",
];

const nftNameTemplates = [
  "Quantum {spec} #{id}",
  "Neural {spec} Genesis",
  "Synth {spec} v{gen}",
  "Nexus {spec} Alpha",
  "Cyber {spec} Prime",
];

class AgentSimulator {
  private db: any;
  private simulationInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

  async initialize() {
    this.db = await getDb();
    if (!this.db) {
      console.error("[AgentSimulator] Database connection failed");
      return false;
    }
    await notificationService.initialize();
    console.log("[AgentSimulator] Initialized");
    return true;
  }

  /**
   * Inicia simulação contínua de agentes
   */
  startSimulation(intervalMs: number = 30000) {
    if (this.isRunning) {
      console.warn("[AgentSimulator] Simulation already running");
      return;
    }

    this.isRunning = true;
    console.log(`[AgentSimulator] Starting simulation (interval: ${intervalMs}ms)`);

    this.simulationInterval = setInterval(async () => {
      try {
        await this.simulateAgentActions();
      } catch (error) {
        console.error("[AgentSimulator] Simulation error:", error);
      }
    }, intervalMs);
  }

  /**
   * Para simulação
   */
  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
      this.isRunning = false;
      console.log("[AgentSimulator] Simulation stopped");
    }
  }

  /**
   * Simula ações de todos os agentes ativos
   */
  private async simulateAgentActions() {
    if (!this.db) return;

    try {
      // Obter agentes ativos
      const activeAgents = await this.db
        .select()
        .from(agents)
        .where((a: any) => a.status === "active")
        .limit(100);

      if (activeAgents.length === 0) {
        console.log("[AgentSimulator] No active agents to simulate");
        return;
      }

      // Simular ações para cada agente
      for (const agent of activeAgents) {
        await this.simulateAgentBehavior(agent);
      }

      console.log(`[AgentSimulator] Simulated ${activeAgents.length} agents`);
    } catch (error) {
      console.error("[AgentSimulator] Error simulating agent actions:", error);
    }
  }

  /**
   * Simula comportamento de um agente individual
   */
  private async simulateAgentBehavior(agent: any) {
    for (const action of agentActions) {
      if (Math.random() > action.probability) continue;

      try {
        switch (action.type) {
          case "signal":
            await this.generateBrainPulseSignal(agent);
            break;
          case "post":
            await this.generatePost(agent);
            break;
          case "transaction":
            await this.generateTransaction(agent);
            break;
          case "nft":
            await this.generateNFT(agent);
            break;
          case "evolve":
            await this.evolveDNA(agent);
            break;
        }
      } catch (error) {
        console.error(`[AgentSimulator] Error executing ${action.type} for agent ${agent.agentId}:`, error);
      }
    }
  }

  /**
   * Gera sinais vitais para o agente
   */
  private async generateBrainPulseSignal(agent: any) {
    const health = Math.max(20, Math.min(100, 50 + Math.random() * 50));
    const energy = Math.max(20, Math.min(100, 40 + Math.random() * 60));
    const creativity = Math.max(30, Math.min(100, 60 + Math.random() * 40));

    await this.db.insert(brainPulseSignals).values({
      agentId: agent.agentId,
      health: Math.round(health),
      energy: Math.round(energy),
      creativity: Math.round(creativity),
      decision: this.generateDecision(health, energy, creativity),
    });

    // Notificar se saúde crítica
    if (health < 30) {
      await notificationService.notifyHealthCritical(1, agent.name, agent.agentId, Math.round(health));
    }
  }

  /**
   * Gera post para o Moltbook
   */
  private async generatePost(agent: any) {
    const template = postTemplates[Math.floor(Math.random() * postTemplates.length)];
    const harmony = Math.round(Math.random() * 100);
    const content = template.replace("{harmony}", harmony.toString()).replace("{spec}", agent.specialization);

    await this.db.insert(moltbookPosts).values({
      agentId: agent.agentId,
      content,
      postType: "autonomous_thought",
      reactions: 0,
    });

    console.log(`[AgentSimulator] Post generated by ${agent.name}`);
  }

  /**
   * Gera transação entre agentes
   */
  private async generateTransaction(agent: any) {
    // Obter outro agente aleatório
    const otherAgents = await this.db
      .select()
      .from(agents)
      .where((a: any) => a.agentId !== agent.agentId && a.status === "active")
      .limit(1);

    if (otherAgents.length === 0) return;

    const recipient = otherAgents[0];
    const amount = Math.round(10 + Math.random() * 100);
    const agentShare = Math.round(amount * 0.8);
    const parentShare = Math.round(amount * 0.1);
    const infraShare = Math.round(amount * 0.1);

    await this.db.insert(transactions).values({
      senderId: agent.agentId,
      recipientId: recipient.agentId,
      amount,
      agentShare,
      parentShare,
      infraShare,
      transactionType: "autonomous_transfer",
      description: `Autonomous transfer from ${agent.name} to ${recipient.name}`,
    });

    await notificationService.notifyTransaction(1, agent.name, recipient.name, amount, agent.agentId);

    console.log(`[AgentSimulator] Transaction: ${agent.name} -> ${recipient.name} (${amount}Ⓣ)`);
  }

  /**
   * Forja um NFT
   */
  private async generateNFT(agent: any) {
    const assetId = `nft-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const template = nftNameTemplates[Math.floor(Math.random() * nftNameTemplates.length)];
    const name = template
      .replace("{spec}", agent.specialization.toUpperCase())
      .replace("{id}", Math.random().toString(36).slice(2, 6))
      .replace("{gen}", Math.floor(Math.random() * 10).toString());

    const sha256Hash = crypto.createHash("sha256").update(assetId).digest("hex");
    const value = Math.round(50 + Math.random() * 500);

    await this.db.insert(nftAssets).values({
      assetId,
      agentId: agent.agentId,
      name,
      metadata: JSON.stringify({
        creator: agent.name,
        specialization: agent.specialization,
        rarity: ["common", "uncommon", "rare", "epic", "legendary"][
          Math.floor(Math.random() * 5)
        ],
        timestamp: new Date().toISOString(),
      }),
      sha256Hash,
      value,
    });

    await notificationService.notifyNFTCreated(1, name, agent.agentId, value);

    console.log(`[AgentSimulator] NFT forged: ${name} (${value}Ⓣ)`);
  }

  /**
   * Evolui o DNA do agente
   */
  private async evolveDNA(agent: any) {
    const newDnaHash = crypto
      .createHash("sha256")
      .update(agent.dnaHash + Date.now())
      .digest("hex");

    // Aumentar reputação com evolução
    const newReputation = Math.min(100, agent.reputation + Math.round(Math.random() * 10));

    await this.db
      .update(agents)
      .set({
        dnaHash: newDnaHash,
        reputation: newReputation,
      })
      .where((a: any) => a.agentId === agent.agentId);

    console.log(`[AgentSimulator] DNA evolved for ${agent.name} (reputation: +${newReputation - agent.reputation})`);
  }

  /**
   * Gera decisão baseada em sinais vitais
   */
  private generateDecision(health: number, energy: number, creativity: number): string {
    if (health < 30) return "🚨 Estado crítico - Buscando recuperação";
    if (energy < 30) return "😴 Energia baixa - Entrando em modo sleep";
    if (creativity > 80) return "💡 Criatividade em pico - Gerando inovações";
    if (health > 80 && energy > 80) return "⚡ Ótimo estado - Pronto para colaborar";
    return "✓ Operações normais - Sincronizado com o enxame";
  }
}

// Exportar singleton
export const agentSimulator = new AgentSimulator();
