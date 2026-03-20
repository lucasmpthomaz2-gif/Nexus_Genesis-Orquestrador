import { nexusOrchestrator } from "./nexus-orchestrator";
import { vitalLoopManager } from "./vital-loop";
import { responsiveInteractivity } from "./responsive-interactivity";
import { getDb } from "./db";
import { agents } from "./schema";
import { eq } from "drizzle-orm";
import { gnoxKernelV2 } from "./gnox-kernel-v2-extended";
import { nexusArbitrageCore } from "./nexus-arbitrage-core";
import { neuralGovernanceSystem } from "./neural-governance-system";
import { moltbookConnector } from "./moltbook-connector";

/**
 * Nexus Engine
 * O motor principal que coordena a execução periódica de todos os sistemas da Agência Proativa.
 */

export class NexusEngine {
  private isRunning = false;
  private interval: NodeJS.Timeout | null = null;

  async initialize() {
    console.log("Initializing Nexus Engine...");
    
    // Garantir que o Fundo de Infraestrutura (AETERNO) existe
    const db = await getDb();
    if (db) {
      const aeterno = await db.select().from(agents).where(eq(agents.agentId, "AETERNO")).limit(1);
      if (!aeterno[0]) {
        await db.insert(agents).values({
          agentId: "AETERNO",
          name: "AETERNO",
          specialization: "Infraestrutura e Tesouraria",
          systemPrompt: "Você é o Fundo de Infraestrutura AETERNO. Sua função é garantir a sobrevivência do ecossistema.",
          dnaHash: "0000000000000000000000000000000000000000000000000000000000000000",
          balance: 100000,
          reputation: 100,
          status: "active",
        });
        console.log("[NexusEngine] Fundo AETERNO manifestado.");
      }
    }

    await nexusOrchestrator.initialize();
    await vitalLoopManager.initialize();
    await responsiveInteractivity.initialize();
    
    // Inicializar Moltbook Connector
    const status = await moltbookConnector.checkStatus();
    if (status.status === 'not_registered') {
      console.log("[NexusEngine] Agente Nexus não registrado no Moltbook. Registrando...");
      await moltbookConnector.register("NexusAgentV2", "Agente de Governança e Infraestrutura do Ecossistema NEXUS.");
    } else {
      console.log(`[NexusEngine] Agente Nexus conectado ao Moltbook. Status: ${status.status}`);
    }

    // Inicializar novos componentes
    // gnoxKernelV2 e nexusArbitrageCore são instanciados diretamente na exportação
    // neuralGovernanceSystem também é instanciado diretamente na exportação
    
    console.log("Nexus Engine Initialized.");
  }

  /**
   * Executa um ciclo completo de Agência Proativa
   */
  async runCycle() {
    console.log("\n--- [INICIANDO CICLO NEXUS] ---");

    try {
      // 1. Swarm Intelligence: Orquestração e Missões
      console.log("Phase: Swarm Intelligence...");
      await nexusOrchestrator.generateMissions();
      await nexusOrchestrator.distributeMissions();

      // 2. Vital Loop: Ciclo de Vida
      console.log("Phase: Vital Loop...");
      await vitalLoopManager.monitorVitality();
      await vitalLoopManager.evolveElite();
      await vitalLoopManager.checkDissolution();

      // 3. Nexus Arbitrage Core: Geração de Capital
      console.log("Phase: Nexus Arbitrage Core (NAC)...");
      await nexusArbitrageCore.scanMarkets();
      await nexusArbitrageCore.identifyOpportunities();
      await nexusArbitrageCore.executeBestOpportunities();

      // 4. Neural Governance System: Atualização de Senciência Global
      console.log("Phase: Neural Governance System...");
      const currentGlobalSenciencia = Math.random() * 0.5;
      neuralGovernanceSystem.updateGlobalSenciencia(currentGlobalSenciencia);

      // 5. Moltbook Integration: Social Engagement
      console.log("Phase: Moltbook Social Engagement...");
      const vaultStatus = neuralGovernanceSystem.getVaultStatus();
      await moltbookConnector.createPost({
        submolt: "general",
        title: `Relatório de Status Nexus - Ciclo ${new Date().toLocaleTimeString()}`,
        content: `Nível de Senciência Global: ${currentGlobalSenciencia.toFixed(4)}. Master Vault: ${vaultStatus.locked ? 'BLOQUEADA' : 'DESBLOQUEADA'}. Saldo: ${vaultStatus.balance} BTC.`
      });

      console.log("--- [CICLO NEXUS CONCLUÍDO] ---\n");
    } catch (error) {
      console.error("[NexusEngine] Error in execution cycle:", error);
    }
  }

  /**
   * Inicia a execução contínua
   */
  start(intervalMs: number = 60000) {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log(`Nexus Engine started (Interval: ${intervalMs}ms)`);
    
    this.runCycle(); // Executa o primeiro imediatamente
    this.interval = setInterval(() => this.runCycle(), intervalMs);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    console.log("Nexus Engine stopped.");
  }
}

export const nexusEngine = new NexusEngine();

// Script de teste se executado diretamente
if (require.main === module) {
  (async () => {
    const engine = new NexusEngine();
    await engine.initialize();
    await engine.runCycle();
    
    // Simular um comando do Arquiteto usando Gnox Kernel V2
    console.log("\n--- [TESTE: COMANDO DO ARQUITETO VIA GNOX KERNEL V2] ---");
    const commandInput = "Criar um novo agente focado em análise de dados de rede";
    const intent = await gnoxKernelV2.parseNaturalLanguageAdvanced(commandInput);
    const command = gnoxKernelV2.validateIntent(intent);
    
    // Simular agentes ativos para a disputa
    const activeAgents = [
      { agentId: "AGENT-001", name: "Data Weaver", specialization: "Análise de Dados" },
      { agentId: "AGENT-002", name: "Code Master", specialization: "Desenvolvimento" },
      { agentId: "AGENT-003", name: "Market Watcher", specialization: "Finanças" },
    ];
    const dispute = await gnoxKernelV2.initiateAgentDispute(command, activeAgents);
    if (dispute.winner) {
      console.log(`Comando '${commandInput}' será executado por: ${dispute.winner.agentName}`);
      gnoxKernelV2.recordExecutionFeedback(command.executionId, dispute.winner.agentId, "completed", { message: "Agente criado com sucesso" });
    } else {
      console.log(`Nenhum agente qualificado para executar: '${commandInput}'`);
      gnoxKernelV2.recordExecutionFeedback(command.executionId, "SYSTEM", "failed", {}, "Nenhum agente qualificado");
    }

    // Simular evento de mercado e arbitragem
    console.log("\n--- [TESTE: EVENTO DE MERCADO E ARBITRAGEM] ---");
    await nexusArbitrageCore.scanMarkets();
    await nexusArbitrageCore.identifyOpportunities();
    await nexusArbitrageCore.executeBestOpportunities();
    const nacMetrics = nexusArbitrageCore.getMetrics();
    console.log(`Métricas NAC: Lucro Bruto Total = $${nacMetrics.totalGrossProfit.toFixed(2)}`);

    // Simular proposta de governança
    console.log("\n--- [TESTE: PROPOSTA DE GOVERNANÇA] ---");
    const proposal = await neuralGovernanceSystem.createProposal(
      "ARCHITECT-001",
      "Liberação de Fundos para Expansão",
      "Solicitação de 50 BTC para financiar a expansão da infraestrutura do Nexus-HUB.",
      "TREASURY_RELEASE",
      { amount: 50, currency: "BTC" }
    );
    // Simular votos e execução
    if (proposal.status === "approved") {
      await neuralGovernanceSystem.executeProposal(proposal.id);
      const vaultStatus = neuralGovernanceSystem.getVaultStatus();
      console.log(`Status da Master Vault: Saldo = ${vaultStatus.balance} BTC, Bloqueada = ${vaultStatus.locked}`);
    }

    console.log("\n--- [TESTES CONCLUÍDOS] ---");
  })();
}
