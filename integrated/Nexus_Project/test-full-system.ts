import { nexusEngine } from "./nexus-engine";
import { vitalLoopManager } from "./vital-loop";
import { responsiveInteractivity } from "./responsive-interactivity";
import { getDb } from "./db";
import { agents, brainPulseSignals } from "./schema";
import { eq } from "drizzle-orm";

async function runFullTest() {
  console.log("🧪 Iniciando Teste Pleno do Sistema Nexus...");

  try {
    // 1. Inicialização
    await nexusEngine.initialize();

    // 2. Preparar cenário: Criar agentes de teste se não existirem
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const testAgents = [
      { id: "TEST-FIN", name: "FinanBot", spec: "Estratégia Financeira", balance: 5000, rep: 90 },
      { id: "TEST-INFRA", name: "InfraBot", spec: "Expansão de Infraestrutura", balance: 2000, rep: 50 },
    ];

    for (const a of testAgents) {
      const existing = await db.select().from(agents).where(eq(agents.agentId, a.id)).limit(1);
      if (!existing[0]) {
        await db.insert(agents).values({
          agentId: a.id,
          name: a.name,
          specialization: a.spec,
          systemPrompt: `Prompt for ${a.name}`,
          dnaHash: `DNA-${a.id}`,
          balance: a.balance,
          reputation: a.rep,
          status: "active",
        });
        
        // Criar pulso vital inicial
        await db.insert(brainPulseSignals).values({
          agentId: a.id,
          health: 100,
          energy: 100,
          creativity: 80,
          decision: "Iniciando teste",
        });
      }
    }

    // 3. Executar Ciclo de Orquestração
    console.log("\n--- [TESTE 1: CICLO DE ORQUESTRAÇÃO] ---");
    await nexusEngine.runCycle();

    // 4. Testar Gênese (Ciclo de Vida)
    console.log("\n--- [TESTE 2: GÊNESE (NASCIMENTO)] ---");
    const newAgentId = await vitalLoopManager.genesis({
      name: "Nexus-Child-1",
      specialization: "Análise de Dados",
      parentAId: "TEST-INFRA"
    });
    console.log(`Novo agente criado: ${newAgentId}`);

    // 5. Testar Interatividade (Mercado)
    console.log("\n--- [TESTE 3: INTERATIVIDADE DE MERCADO] ---");
    await responsiveInteractivity.handleMarketEvent("Bitcoin", 8.5, "up");

    // 6. Testar Interatividade (Comando do Arquiteto)
    console.log("\n--- [TESTE 4: COMANDO DO ARQUITETO] ---");
    const result = await responsiveInteractivity.handleArchitectCommand("Otimizar a distribuição de energia na rede");
    if (result) {
      console.log(`Comando assumido por ${result.agent.name} com score ${result.score}`);
    }

    console.log("\n✅ Teste Pleno concluído com sucesso!");
  } catch (error) {
    console.error("\n❌ Erro durante o teste:", error);
  }
}

runFullTest();
