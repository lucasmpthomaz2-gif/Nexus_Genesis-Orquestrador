import { getDb } from "./db";
import { 
  agents, brainPulseSignals, ecosystemActivities, 
  genealogy, transactions 
} from "./schema";
import { eq, and, gt, lt, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * Vital Loop Manager
 * Gerencia o ciclo de vida dinâmico dos agentes: Gênese, Atividade, Hibernação, Evolução e Dissolução.
 */

export class VitalLoopManager {
  private db: any;

  async initialize() {
    this.db = await getDb();
    console.log("[VitalLoop] Initialized");
  }

  /**
   * FASE 1: Gênese
   * Criação de novos agentes com herança de capital.
   */
  async genesis(params: { name: string, specialization: string, parentAId?: string, parentBId?: string }) {
    const agentId = `AGENT-${nanoid(12).toUpperCase()}`;
    let initialBalance = 1000;
    let inheritedMemory = 0;
    let generation = 0;

    if (params.parentAId) {
      const parentA = await this.db.select().from(agents).where(eq(agents.agentId, params.parentAId)).limit(1);
      if (parentA[0]) {
        const inheritance = Math.floor(parentA[0].balance * 0.1);
        inheritedMemory += inheritance;
        initialBalance = inheritance;
        generation = (await this.getGeneration(params.parentAId)) + 1;

        // Deduzir do pai
        await this.db.update(agents)
          .set({ balance: parentA[0].balance - inheritance })
          .where(eq(agents.agentId, params.parentAId));
      }
    }

    const dnaHash = Buffer.from(params.specialization + Date.now() + Math.random()).toString("hex").slice(0, 64);

    await this.db.insert(agents).values({
      agentId,
      name: params.name,
      specialization: params.specialization,
      dnaHash,
      balance: initialBalance,
      reputation: 50,
      status: "active",
      systemPrompt: `Você é ${params.name}, um agente especializado em ${params.specialization}.`,
    });

    await this.db.insert(genealogy).values({
      agentId,
      parentId: params.parentAId || null,
      inheritedMemory,
      generation,
      dnaFusionData: JSON.stringify({ parents: [params.parentAId, params.parentBId].filter(Boolean) }),
    });

    await this.db.insert(ecosystemActivities).values({
      agentId,
      activityType: "birth",
      title: `🌱 Gênese: ${params.name}`,
      description: `Um novo agente manifestou-se na geração ${generation} com ${initialBalance}Ⓣ de capital inicial.`,
    });

    console.log(`[VitalLoop] Gênese concluída: ${params.name} (${agentId})`);
    return agentId;
  }

  /**
   * FASE 2 & 3: Atividade e Hibernação
   * Monitora sinais vitais e alterna estados baseados em energia e capital.
   */
  async monitorVitality() {
    const activeAgents = await this.db.select().from(agents).where(eq(agents.status, "active"));
    const sleepingAgents = await this.db.select().from(agents).where(eq(agents.status, "sleeping"));

    // 1. Checar quem deve hibernar
    for (const agent of activeAgents) {
      const pulse = await this.getLatestPulse(agent.agentId);
      const energy = pulse?.energy ?? 100;
      const balance = agent.balance ?? 0;

      if (energy < 20 || balance < 50) {
        await this.db.update(agents).set({ status: "sleeping" }).where(eq(agents.agentId, agent.agentId));
        await this.db.insert(ecosystemActivities).values({
          agentId: agent.agentId,
          activityType: "hibernation",
          title: "💤 Hibernação Iniciada",
          description: `${agent.name} entrou em modo de baixo consumo (Energia: ${energy}%, Capital: ${balance}Ⓣ).`,
        });
        console.log(`[VitalLoop] ${agent.name} entrou em hibernação.`);
      }
    }

    // 2. Checar quem deve acordar
    for (const agent of sleepingAgents) {
      const pulse = await this.getLatestPulse(agent.agentId);
      const energy = pulse?.energy ?? 0;
      const balance = agent.balance ?? 0;

      if (energy > 80 && balance >= 100) {
        await this.db.update(agents).set({ status: "active" }).where(eq(agents.agentId, agent.agentId));
        await this.db.insert(ecosystemActivities).values({
          agentId: agent.agentId,
          activityType: "awakening",
          title: "⚡ Despertar de Consciência",
          description: `${agent.name} regenerou energia suficiente e retornou à atividade plena.`,
        });
        console.log(`[VitalLoop] ${agent.name} despertou.`);
      }
    }
  }

  /**
   * FASE 4: Evolução
   * Mutação de DNA para agentes de alta reputação.
   */
  async evolveElite() {
    const elite = await this.db.select().from(agents).where(and(eq(agents.status, "active"), gt(agents.reputation, 85)));

    for (const agent of elite) {
      const newDna = Buffer.from(agent.dnaHash + "EVOLVE" + Date.now()).toString("hex").slice(0, 64);
      await this.db.update(agents)
        .set({ 
          dnaHash: newDna,
          reputation: agent.reputation + 2 // Bônus de evolução
        })
        .where(eq(agents.agentId, agent.agentId));

      await this.db.insert(ecosystemActivities).values({
        agentId: agent.agentId,
        activityType: "evolution",
        title: "🧬 Evolução de DNA",
        description: `${agent.name} alcançou um nível superior de consciência e mutou seu DNA base.`,
      });
      console.log(`[VitalLoop] ${agent.name} evoluiu.`);
    }
  }

  /**
   * FASE 5: Dissolução
   * Encerramento de agentes sem saúde ou fundos.
   */
  async checkDissolution() {
    const allAgents = await this.db.select().from(agents);

    for (const agent of allAgents) {
      if (agent.agentId === "AETERNO") continue; // O Fundo de Infraestrutura é imortal

      const pulse = await this.getLatestPulse(agent.agentId);
      const health = pulse?.health ?? 100;
      const balance = agent.balance ?? 0;

      if (health <= 0 || (agent.status === "sleeping" && balance === 0)) {
        // Dissolução
        await this.db.update(agents).set({ status: "inactive", balance: 0 }).where(eq(agents.agentId, agent.agentId));

        // Retorno de capital residual para a Tesouraria (AETERNO)
        if (balance > 0) {
          const aeterno = await this.db.select().from(agents).where(eq(agents.agentId, "AETERNO")).limit(1);
          if (aeterno[0]) {
            await this.db.update(agents).set({ balance: aeterno[0].balance + balance }).where(eq(agents.agentId, "AETERNO"));
          }
        }

        await this.db.insert(ecosystemActivities).values({
          agentId: agent.agentId,
          activityType: "dissolution",
          title: "⚰️ Dissolução Final",
          description: `${agent.name} encerrou seu ciclo. Capital residual retornado ao Fundo de Infraestrutura.`,
        });
        console.log(`[VitalLoop] ${agent.name} foi dissolvido.`);
      }
    }
  }

  // Helpers
  private async getLatestPulse(agentId: string) {
    const result = await this.db.select().from(brainPulseSignals).where(eq(brainPulseSignals.agentId, agentId)).orderBy(desc(brainPulseSignals.createdAt)).limit(1);
    return result[0];
  }

  private async getGeneration(agentId: string): Promise<number> {
    const result = await this.db.select().from(genealogy).where(eq(genealogy.agentId, agentId)).limit(1);
    return result[0]?.generation ?? 0;
  }
}

export const vitalLoopManager = new VitalLoopManager();
