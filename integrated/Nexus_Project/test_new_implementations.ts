import { dataAdapter } from "./data-adapter";
import { responsiveInteractivity } from "./responsive-interactivity";
import { nexusOrchestrator } from "./nexus-orchestrator";
import { governanceContract, nexusToken } from "./governance";

async function test() {
  console.log("--- Iniciando Testes das Novas Implementações ---");

  // 1. Testar DataAdapter
  console.log("\n1. Testando DataAdapter (CoinGecko)...");
  const prices = await dataAdapter.getCryptoPrices(["bitcoin", "ethereum"]);
  console.log("Preços obtidos:", JSON.stringify(prices, null, 2));

  // 2. Testar Governança e Tokenomics
  console.log("\n2. Testando Governança e Tokenomics...");
  const agentId = "AGENT-001";
  nexusToken.mint(agentId, 500);
  console.log(`Saldo do Agente ${agentId}: ${nexusToken.getBalance(agentId)} NEXUS`);

  await governanceContract.initialize();
  const proposal = await governanceContract.createProposal(
    agentId,
    "Expansão de Infraestrutura",
    "Aumentar a capacidade de processamento dos agentes financeiros.",
    { type: "upgrade", capacity: 2.0 }
  );

  if (proposal) {
    await governanceContract.vote(agentId, proposal.id, "for");
    await governanceContract.executeProposal(proposal.id);
  }

  // 3. Testar Interatividade Responsiva com Dados Reais
  console.log("\n3. Testando ResponsiveInteractivity com Dados Reais...");
  await responsiveInteractivity.initialize();
  await responsiveInteractivity.handleMarketEvent("bitcoin");

  // 4. Testar Orchestrator com Contexto de Mercado
  console.log("\n4. Testando NexusOrchestrator com Contexto de Mercado...");
  await nexusOrchestrator.initialize();
  const context = await nexusOrchestrator.analyzeContext();
  console.log("Contexto analisado com dados de mercado:", context?.marketData ? "OK" : "FALHA");
  
  await nexusOrchestrator.generateMissions();

  console.log("\n--- Testes Concluídos ---");
}

test().catch(console.error);
