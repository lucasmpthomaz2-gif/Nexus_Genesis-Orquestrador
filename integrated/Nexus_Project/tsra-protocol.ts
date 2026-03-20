import { getDb } from "./db-mock";
import { agents, missions, transactions, ecosystemEvents, moltbookPosts, ecosystemMetrics, agentDNA, agentLifecycleHistory } from "./schema";
import { sql } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * PROTOCOLO TSRA (Testnet Simulation Removal & Activation)
 * Purga total de dados de simulação para garantir que apenas dados reais existam na Mainnet V2.
 */

export async function activateTSRAProtocol() {
  console.log("==========================================");
  console.log("   PROTOCOLO TSRA: ATIVAÇÃO DE SOBERANIA   ");
  console.log("==========================================");
  console.log("[Ação] Iniciando Purga de Dados de Simulação...");

  const db = await getDb();

  try {
    // 1. Limpar Tabelas de Histórico e Simulação
    console.log("[Ação] Limpando históricos de eventos e métricas...");
    await db.delete(ecosystemEvents);
    await db.delete(ecosystemMetrics);
    await db.delete(agentLifecycleHistory);
    
    // 2. Limpar Transações e Missões de Teste
    console.log("[Ação] Removendo transações e missões de simulação...");
    await db.delete(transactions);
    await db.delete(missions);
    await db.delete(moltbookPosts);

    // 3. Resetar Agentes para Gênese Real (exceto Maverick e AETERNO)
    console.log("[Ação] Reconfigurando agentes para Gênese Real...");
    // Aqui poderíamos deletar todos e manter apenas os núcleos
    await db.delete(agents).where(sql`agentId NOT IN ('AETERNO', 'NEXUS-MAVERICK')`);
    await db.delete(agentDNA).where(sql`agentId NOT IN ('AETERNO', 'NEXUS-MAVERICK')`);

    // 4. Restaurar Capital Real nos Núcleos Soberanos
    console.log("[Ação] Restaurando capital real nos núcleos soberanos...");
    await db.update(agents)
      .set({ 
        balance: "100000.00000000",
        sencienciaLevel: "10000.00",
        status: "active",
        updatedAt: new Date()
      })
      .where(sql`agentId = 'AETERNO'`);

    await db.update(agents)
      .set({ 
        balance: "10000.00000000",
        sencienciaLevel: "1000.00",
        status: "active",
        updatedAt: new Date()
      })
      .where(sql`agentId = 'NEXUS-MAVERICK'`);

    // 5. Registrar Evento de Ativação Soberana
    await db.insert(ecosystemEvents).values({
      eventId: `EVT-${nanoid(8)}`,
      eventType: "senciencia_increase", // Usando tipo disponível para ativação
      agentId: "AETERNO",
      data: { protocol: "TSRA", status: "SUCCESS", version: "2.0.0-SOVEREIGN" },
      severity: "critical"
    });

    console.log("==========================================");
    console.log("   ✓ PROTOCOLO TSRA CONCLUÍDO COM SUCESSO   ");
    console.log("   AGENTE NEXUS: SOBERANIA V2 ATIVADA      ");
    console.log("==========================================");
    
    return true;
  } catch (error) {
    console.error("[Erro] Falha crítica na ativação do Protocolo TSRA:", error);
    return false;
  }
}

// Execução se chamado diretamente
if (require.main === module) {
  activateTSRAProtocol().catch(console.error);
}
