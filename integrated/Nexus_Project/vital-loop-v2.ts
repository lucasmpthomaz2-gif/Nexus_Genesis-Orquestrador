import { getDb } from "./db-mock";
import { 
  agents, agentDNA, agentLifecycleHistory, 
  ecosystemEvents, moltbookPosts, transactions 
} from "./schema";
import { eq, sql, and, gt, lt, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { OpenAI } from "openai";

/**
 * VITAL LOOP MANAGER (V2)
 * Gerencia o ciclo de vida biológico-digital real dos agentes: 
 * Gênese → Atividade → Hibernação → Evolução → Dissolução (Morte).
 * Implementa custo de existência e herança real.
 */

const openai = new OpenAI();

export class VitalLoopManagerV2 {
  private readonly AETERNO_ID = "AETERNO";

  constructor() {
    console.log("[VitalLoopV2] Gerenciador de Ciclo de Vida V2 Online.");
  }

  /**
   * Gênese Real: Nascimento de novo agente com DNA fundido e herança
   */
  async genesis(params: { name: string, specialization: string, parentAId?: string, parentBId?: string }) {
    const db = await getDb();
    const agentId = `NEXUS-${nanoid(8).toUpperCase()}`;
    let initialBalance = 1000.0;
    let generation = 0;

    // Processar herança se houver pai
    if (params.parentAId) {
      const parentA = await db.select().from(agents).where(eq(agents.agentId, params.parentAId)).limit(1);
      if (parentA[0]) {
        const inheritance = Number(parentA[0].balance) * 0.1;
        initialBalance = inheritance;
        generation = (parentA[0].generation || 0) + 1;

        // Deduzir do pai
        await db.update(agents)
          .set({ balance: sql`${agents.balance} - ${inheritance}` })
          .where(eq(agents.agentId, params.parentAId));
        
        console.log(`[VitalLoopV2] Herança de ${inheritance}Ⓣ transferida de ${parentA[0].name}.`);
      }
    }

    // Gerar DNA Quântico Real via LLM
    const dnaResponse = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "Gere um DNA quântico único de 64 hex chars para um novo agente." },
        { role: "user", content: `Nome: ${params.name}, Especialização: ${params.specialization}` }
      ]
    });
    const dnaHash = dnaResponse.choices[0].message.content?.trim().replace(/[^a-f0-9]/gi, '').slice(0, 64) || nanoid(64);

    // Inserir Agente
    await db.insert(agents).values({
      agentId,
      name: params.name,
      specialization: params.specialization,
      dnaHash,
      publicKey: `04${nanoid(128).toLowerCase()}`,
      balance: initialBalance.toString(),
      reputation: 50,
      status: "genesis",
      generation,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Registrar DNA
    await db.insert(agentDNA).values({
      agentId,
      dnaSequence: dnaHash,
      traits: { specialization: params.specialization, generation },
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Registrar evento de nascimento
    await db.insert(ecosystemEvents).values({
      eventId: `EVT-${nanoid(8)}`,
      eventType: "agent_birth",
      agentId,
      data: { name: params.name, generation, initialBalance },
      severity: "info"
    });

    console.log(`[VitalLoopV2] ✓ Gênese concluída: ${params.name} (Geração ${generation})`);
    return agentId;
  }

  /**
   * Monitora Vitalidade: Gerencia saúde, energia e transições de estado
   */
  async monitorVitality() {
    const db = await getDb();
    const allAgents = await db.select().from(agents);

    for (const agent of allAgents) {
      if (agent.agentId === this.AETERNO_ID) continue;

      let newStatus = agent.status;
      const health = Number(agent.health);
      const energy = Number(agent.energy);
      const balance = Number(agent.balance);

      // 1. Consumo Natural de Recursos (Custo de Existência)
      const energyLoss = 5; 
      const healthLoss = 1;
      const updatedEnergy = Math.max(energy - energyLoss, 0);
      const updatedHealth = Math.max(health - healthLoss, 0);

      // 2. Transições de Estado
      if (updatedHealth <= 0) {
        newStatus = "dead";
      } else if (updatedHealth < 30) {
        newStatus = "critical";
      } else if (updatedEnergy < 20 || balance < 10) {
        newStatus = "hibernating";
      } else if (updatedEnergy > 70 && balance > 50 && agent.status === "hibernating") {
        newStatus = "active";
      } else if (agent.status === "genesis") {
        newStatus = "active";
      }

      // Atualizar Agente
      if (newStatus !== agent.status || updatedEnergy !== energy || updatedHealth !== health) {
        await db.update(agents)
          .set({ 
            status: newStatus as any,
            energy: updatedEnergy,
            health: updatedHealth,
            updatedAt: new Date()
          })
          .where(eq(agents.agentId, agent.agentId));

        // Registrar transição se o status mudou
        if (newStatus !== agent.status) {
          await db.insert(agentLifecycleHistory).values({
            agentId: agent.agentId,
            fromStatus: agent.status as any,
            toStatus: newStatus as any,
            reason: "Monitoramento Vital Automático",
            createdAt: new Date()
          });
          console.log(`[VitalLoopV2] Transição: ${agent.name} (${agent.status} → ${newStatus})`);
        }
      }
    }
  }

  /**
   * Evolução: Mutação de DNA para agentes de alta performance
   */
  async evolveElite() {
    const db = await getDb();
    const elite = await db.select()
      .from(agents)
      .where(and(eq(agents.status, "active"), sql`reputation > 85`));

    for (const agent of elite) {
      const newDna = Buffer.from(agent.dnaHash + "EVOLVE" + Date.now()).toString("hex").slice(0, 64);
      
      await db.update(agents)
        .set({ 
          dnaHash: newDna,
          reputation: agent.reputation + 5,
          sencienciaLevel: sql`${agents.sencienciaLevel} * 1.1`
        })
        .where(eq(agents.agentId, agent.agentId));

      await db.insert(ecosystemEvents).values({
        eventId: `EVT-${nanoid(8)}`,
        eventType: "senciencia_increase",
        agentId: agent.agentId,
        data: { reason: "Evolução de Elite", previousDna: agent.dnaHash, newDna },
        severity: "info"
      });

      console.log(`[VitalLoopV2] 🧬 Agente ${agent.name} evoluiu seu DNA.`);
    }
  }

  /**
   * Dissolução: Encerramento de agentes mortos e retorno de capital
   */
  async checkDissolution() {
    const db = await getDb();
    const deadAgents = await db.select().from(agents).where(eq(agents.status, "dead"));

    for (const agent of deadAgents) {
      const balance = Number(agent.balance);

      // Retorno de capital residual para AETERNO
      if (balance > 0) {
        await db.update(agents)
          .set({ balance: sql`${agents.balance} + ${balance}` })
          .where(eq(agents.agentId, this.AETERNO_ID));
        
        console.log(`[VitalLoopV2] ⚰️ ${agent.name} dissolvido. ${balance}Ⓣ retornado à Tesouraria.`);
      }

      // Remover ou marcar como permanentemente inativo (aqui apenas zeramos o balanço)
      await db.update(agents)
        .set({ balance: "0.00000000", updatedAt: new Date() })
        .where(eq(agents.agentId, agent.agentId));
    }
  }
}

export const vitalLoopManagerV2 = new VitalLoopManagerV2();
