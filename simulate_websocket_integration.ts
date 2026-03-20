/**
 * Simulação de Integração WebSocket para NexusGenesis
 * Este script simula o ciclo de vida do orquestrador e emite eventos WebSocket
 */

import * as hooks from "./orchestrator-websocket-hooks";

console.log("🚀 Iniciando Simulação de Integração WebSocket NexusGenesis...");

async function runSimulation() {
  // 1. Início do TSRA
  console.log("\n--- [PASSO 1] Iniciando TSRA ---");
  hooks.onTSRAStarted();
  await sleep(1000);

  // 2. Ciclo de Sincronização 1 (Sucesso)
  console.log("\n--- [PASSO 2] Ciclo de Sincronização 1 (Sucesso) ---");
  hooks.onSyncCycleSuccess({
    syncWindow: 1,
    nucleiSynced: ["nexus_in", "nexus_hub", "fundo_nexus"],
    commandsOrchestrated: 0,
    eventsProcessed: 10,
    syncDurationMs: 120,
  });
  await sleep(1000);

  // 3. Mudança de Estado de Núcleo
  console.log("\n--- [PASSO 3] Mudança de Estado: Nexus-in ---");
  hooks.onNucleusStateChanged("nexus_in", {
    posts: 15,
    activeUsers: 8,
    lastUpdate: new Date().toISOString(),
  });
  await sleep(1000);

  // 4. Métrica de Homeostase (Alerta)
  console.log("\n--- [PASSO 4] Métrica de Homeostase (Aviso) ---");
  hooks.onHomeostaseMetricUpdated({
    btcBalance: 4.5,
    activeAgents: 12,
    socialActivity: 15,
    equilibriumStatus: "warning",
    issues: ["Saldo BTC baixo"],
  });
  await sleep(1000);

  // 5. Comando de Orquestração
  console.log("\n--- [PASSO 5] Criando Comando de Reequilíbrio ---");
  hooks.onOrchestrationCommandCreated({
    commandId: "cmd-" + Math.random().toString(36).substr(2, 9),
    destination: "nexus_in",
    commandType: "alert",
    commandData: { level: "warning", message: "Saldo BTC baixo" },
    reason: "Reequilíbrio automático: Saldo BTC baixo",
  });
  await sleep(1000);

  // 6. Núcleo Degradado
  console.log("\n--- [PASSO 6] Núcleo Degradado: Nexus-HUB ---");
  hooks.onNucleusHealthDegraded("nexus_hub");
  await sleep(1000);

  // 7. Erro de Ciclo
  console.log("\n--- [PASSO 7] Erro no Ciclo de Sincronização ---");
  hooks.onSyncCycleError(new Error("Conexão recusada pelo núcleo Fundo Nexus"), 5);
  await sleep(1000);

  // 8. Experiência Genesis
  console.log("\n--- [PASSO 8] Experiência Genesis ---");
  hooks.onGenesisExperienceLogged({
    experienceId: "exp-999",
    experienceType: "evolution",
    description: "Expansão da rede de monitoramento em tempo real",
    impact: "high",
    senciencyDelta: "+0.12",
  });
  await sleep(1000);

  // 9. Parada do TSRA
  console.log("\n--- [PASSO 9] Parando TSRA ---");
  hooks.onTSRAStopped();

  console.log("\n✅ Simulação concluída com sucesso!");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Executar simulação
runSimulation().catch(console.error);
