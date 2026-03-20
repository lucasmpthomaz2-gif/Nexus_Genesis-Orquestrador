import { nexusOrchestrator } from "./nexus-orchestrator";
import { vitalLoopManager } from "./vital-loop.ts";
import { responsiveInteractivity } from "./responsive-interactivity";
import { createGnoxKernel } from "./gnox-kernel";

/**
 * Nexus Integration Engine
 * O ponto central que conecta o Orquestrador, o Ciclo Vital e a Interatividade.
 */

export class NexusIntegrationEngine {
  private gnoxKernel = createGnoxKernel();

  async start() {
    console.log("🚀 Iniciando Nexus Integration Engine...");

    // 1. Inicializar componentes
    await nexusOrchestrator.initialize();
    await vitalLoopManager.initialize();
    await responsiveInteractivity.initialize();

    // 2. Ciclo de Orquestração (Swarm Intelligence)
    console.log("\n--- [FASE 1: SWARM INTELLIGENCE] ---");
    await nexusOrchestrator.generateMissions();
    await nexusOrchestrator.distributeTasks();

    // 3. Ciclo Vital (Vital Loop)
    console.log("\n--- [FASE 2: VITAL LOOP] ---");
    await vitalLoopManager.processVitalSigns();
    await vitalLoopManager.checkEvolution();
    await vitalLoopManager.checkDissolution();

    // 4. Simular Interatividade Responsiva (Mercado)
    console.log("\n--- [FASE 3: RESPONSIVE INTERACTIVITY - MARKET] ---");
    await responsiveInteractivity.handleMarketEvent("Bitcoin", 5.4, "up");

    // 5. Simular Interatividade Responsiva (Humana via Gnox Kernel)
    console.log("\n--- [FASE 4: RESPONSIVE INTERACTIVITY - ARCHITECT] ---");
    const command = "Expandir a infraestrutura de rede para suportar novos agentes";
    const kernelCommand = this.gnoxKernel.processCommand(command);
    
    console.log(`[Kernel] Comando Processado: ${kernelCommand.action} (${kernelCommand.gnoxSignal})`);
    
    const winner = await responsiveInteractivity.handleArchitectCommand(command, "Expansão de Ecossistema");
    if (winner) {
      console.log(`[Nexus] Comando assumido por: ${winner.name}`);
    }

    console.log("\n✅ Ciclo de Integração Nexus concluído com sucesso.");
  }
}

// Executar se for o script principal
if (require.main === module) {
  const engine = new NexusIntegrationEngine();
  engine.start().catch(console.error);
}
