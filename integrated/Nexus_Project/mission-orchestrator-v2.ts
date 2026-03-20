import { OpenAI } from "openai";
import { getDb } from "./db-mock";
import { agents, missions, ecosystemEvents } from "./schema";
import { eq, sql, and, lt } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * NEXUS MISSION ORCHESTRATOR (V2)
 * Orquestrador proativo que gera missões reais baseadas em dados do ecossistema e mercado.
 * Delegação autônoma de tarefas para agentes com maior senciência.
 */

const openai = new OpenAI();

export interface MissionContext {
  totalAgents: number;
  activeAgents: number;
  marketTrend: string;
  harmonyIndex: number;
  topAgents: any[];
}

export class MissionOrchestratorV2 {
  constructor() {
    console.log("[MissionOrchestratorV2] Orquestrador Proativo V2 Online.");
  }

  /**
   * Gera missões inteligentes baseadas em contexto real
   */
  async generateIntelligentMissions(context: MissionContext): Promise<void> {
    console.log("[MissionOrchestratorV2] Analisando contexto para geração de missões...");

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "Você é o Orquestrador Proativo do Ecossistema Nexus. Gere 3 missões estratégicas para os agentes baseadas no contexto fornecido."
        },
        {
          role: "user",
          content: JSON.stringify(context)
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{"missions": []}');
    const newMissions = result.missions || [];

    const db = await getDb();

    for (const m of newMissions) {
      const missionId = `MSN-${nanoid(8).toUpperCase()}`;
      
      await db.insert(missions).values({
        missionId,
        title: m.title || "Missão Estratégica",
        description: m.description || "Descrição da missão gerada pelo orquestrador.",
        status: "pending",
        priority: m.priority || "medium",
        reward: (m.reward || 500).toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log(`[MissionOrchestratorV2] ✓ Nova missão manifestada: ${m.title}`);
    }
  }

  /**
   * Delega missões pendentes para agentes adequados
   */
  async delegateMissions(): Promise<void> {
    const db = await getDb();
    
    // Buscar missões pendentes
    const pendingMissions = await db.select().from(missions).where(eq(missions.status, "pending"));
    
    // Buscar agentes ativos com maior senciência
    const activeAgents = await db.select()
      .from(agents)
      .where(eq(agents.status, "active"))
      .orderBy(sql`cast(sencienciaLevel as decimal) desc`)
      .limit(10);

    if (pendingMissions.length === 0 || activeAgents.length === 0) return;

    console.log(`[MissionOrchestratorV2] Delegando ${pendingMissions.length} missões para ${activeAgents.length} agentes...`);

    for (let i = 0; i < Math.min(pendingMissions.length, activeAgents.length); i++) {
      const mission = pendingMissions[i];
      const agent = activeAgents[i];

      await db.update(missions)
        .set({ 
          assignedAgentId: agent.agentId,
          status: "in_progress",
          updatedAt: new Date()
        })
        .where(eq(missions.missionId, mission.missionId));

      // Registrar evento de delegação
      await db.insert(ecosystemEvents).values({
        eventId: `EVT-${nanoid(8)}`,
        eventType: "mission_completed", // Reutilizando tipo para delegação
        agentId: agent.agentId,
        data: { missionId: mission.missionId, agentName: agent.name },
        severity: "info"
      });

      console.log(`[MissionOrchestratorV2] Missão ${mission.title} delegada para ${agent.name}.`);
    }
  }

  /**
   * Processa o progresso das missões em andamento
   */
  async processMissionProgress(): Promise<void> {
    const db = await getDb();
    
    const inProgressMissions = await db.select().from(missions).where(eq(missions.status, "in_progress"));

    for (const mission of inProgressMissions) {
      const progressIncrement = 10 + Math.random() * 20;
      const newProgress = Math.min(Number(mission.progress) + progressIncrement, 100);

      if (newProgress >= 100) {
        await db.update(missions)
          .set({ 
            status: "completed",
            progress: "100",
            completedAt: new Date(),
            updatedAt: new Date()
          })
          .where(eq(missions.missionId, mission.missionId));

        // Pagar recompensa via Tesouraria (em produção integrar com TreasurySystemV2)
        if (mission.assignedAgentId) {
          await db.update(agents)
            .set({ balance: sql`${agents.balance} + ${mission.reward}` })
            .where(eq(agents.agentId, mission.assignedAgentId));
          
          console.log(`[MissionOrchestratorV2] ✓ Missão ${mission.title} CONCLUÍDA por ${mission.assignedAgentId}. Recompensa paga.`);
        }
      } else {
        await db.update(missions)
          .set({ 
            progress: newProgress.toString(),
            updatedAt: new Date()
          })
          .where(eq(missions.missionId, mission.missionId));
      }
    }
  }
}

export const missionOrchestratorV2 = new MissionOrchestratorV2();
