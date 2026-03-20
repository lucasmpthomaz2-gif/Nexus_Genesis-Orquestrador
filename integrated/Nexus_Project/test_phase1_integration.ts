import { delegateTask, TaskIntent } from "./task-delegator";

async function testIntegration() {
  console.log("--- Iniciando Teste de Integração Fase 1 ---");

  // 1. Teste de Nascimento de Agente
  const birthIntent: TaskIntent = {
    action: "AGENT_BIRTH",
    params: { name: "TEST-AGENT-PHASE1", specialization: "Integration" },
    gnox_signal: "[TEST]::VUL-CLAW::<<0.8>>//[ROOT]"
  };
  
  console.log("\n1. Testando Nascimento de Agente...");
  const birthResult = await delegateTask(birthIntent);
  console.log("Resultado:", JSON.stringify(birthResult, null, 2));

  // 2. Teste de Transação (Assumindo que o destinatário existe ou falhará graciosamente)
  const txIntent: TaskIntent = {
    action: "TRANSACTION",
    params: { recipient: "AETERNO", amount: 100 },
    gnox_signal: "[TEST]::XON-BANK::<<0.9>>//[ROOT]"
  };

  console.log("\n2. Testando Transação...");
  const txResult = await delegateTask(txIntent);
  console.log("Resultado:", JSON.stringify(txResult, null, 2));

  console.log("\n--- Teste de Integração Concluído ---");
}

testIntegration().catch(console.error);
