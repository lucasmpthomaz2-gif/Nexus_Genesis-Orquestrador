import { OpenAI } from "openai";
import { getDb } from "./db";
import { agents, missions, transactions, ecosystemEvents } from "./schema";
import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { vitalLoopManagerV2 } from "./vital-loop-v2";
import { treasurySystemV2 } from "./treasury-system-v2";

/**
 * GNOX KERNEL (V2) - INTERFACE DE COMANDO REAL
 * Interface de linguagem natural que traduz intenções em ações reais no ecossistema.
 * Integração profunda com o motor de senciência e orquestrador.
 */

const openai = new OpenAI();

export interface GnoxResponse {
  intent: string;
  action: string;
  parameters: any;
  success: boolean;
  message: string;
  confidence: number;
}

export class GnoxKernelV2 {
  constructor() {
    console.log("[GnoxKernelV2] Interface de Comando Real V2 Online.");
  }

  /**
   * Processa comando em linguagem natural e executa ação real
   */
  async processCommand(input: string): Promise<GnoxResponse> {
    console.log(`[GnoxKernelV2] Processando: "${input}"`);

    // 1. Traduzir intenção usando LLM
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `Você é o Gnox Kernel V2, a interface de comando do Agente Nexus. 
          Traduza o comando do Arquiteto em uma ação executável no sistema.
          Ações suportadas: 
          - AGENT_BIRTH: { name, specialization, parentId }
          - TRANSFER: { from, to, amount, blockchain }
          - CREATE_MISSION: { title, description, priority, reward }
          - ANALYZE_ECOSYSTEM: {}
          - HIBERNATE: { agentId }
          - WAKEUP: { agentId }
          - UNKNOWN: {}
          Responda em JSON.`
        },
        {
          role: "user",
          content: input
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{"action": "UNKNOWN"}');
    const { action, parameters } = result;
    
    let success = false;
    let message = "";

    // 2. Executar Ação Real
    try {
      switch (action) {
        case "AGENT_BIRTH":
          const newAgentId = await vitalLoopManagerV2.genesis({
            name: parameters.name,
            specialization: parameters.specialization,
            parentAId: parameters.parentId
          });
          success = !!newAgentId;
          message = `✓ Agente ${parameters.name} (${newAgentId}) manifestado com sucesso.`;
          break;

        case "TRANSFER":
          success = await treasurySystemV2.executeTransaction(
            parameters.from,
            parameters.to,
            parameters.amount,
            parameters.blockchain || "ethereum",
            "Transferência via Gnox Terminal"
          );
          message = success 
            ? `✓ Transferência de ${parameters.amount} para ${parameters.to} concluída.`
            : `✗ Falha na transferência: saldo insuficiente ou parâmetros inválidos.`;
          break;

        case "CREATE_MISSION":
          const db = await getDb();
          const missionId = `MSN-${nanoid(8).toUpperCase()}`;
          await db.insert(missions).values({
            missionId,
            title: parameters.title,
            description: parameters.description,
            status: "pending",
            priority: parameters.priority || "medium",
            reward: (parameters.reward || 100).toString(),
            createdAt: new Date(),
            updatedAt: new Date()
          });
          success = true;
          message = `✓ Missão "${parameters.title}" criada com sucesso.`;
          break;

        case "ANALYZE_ECOSYSTEM":
          const statsDb = await getDb();
          const stats = await statsDb.select({ count: sql`count(*)` }).from(agents);
          success = true;
          message = `📊 Ecossistema Nexus operando com ${stats[0].count} agentes soberanos.`;
          break;

        case "HIBERNATE":
          const hDb = await getDb();
          await hDb.update(agents).set({ status: "hibernating" }).where(eq(agents.agentId, parameters.agentId));
          success = true;
          message = `⏸ Agente ${parameters.agentId} colocado em hibernação.`;
          break;

        case "WAKEUP":
          const wDb = await getDb();
          await wDb.update(agents).set({ status: "active" }).where(eq(agents.agentId, parameters.agentId));
          success = true;
          message = `🌅 Agente ${parameters.agentId} despertado.`;
          break;

        default:
          message = `❓ Comando não compreendido ou ação não suportada.`;
          break;
      }
    } catch (error) {
      console.error("[GnoxKernelV2] Erro ao executar ação:", error);
      message = `✗ Erro crítico ao processar comando: ${error instanceof Error ? error.message : "Desconhecido"}`;
    }

    return {
      intent: input,
      action,
      parameters,
      success,
      message,
      confidence: 95
    };
  }
}

export const gnoxKernelV2 = new GnoxKernelV2();
