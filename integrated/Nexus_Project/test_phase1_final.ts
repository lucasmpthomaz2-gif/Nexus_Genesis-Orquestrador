import { gnoxKernel } from "./gnox-kernel";
import * as dbHelpers from "./db-helpers";

async function testPhase1() {
  console.log("--- Iniciando Teste de Integração Fase 1 ---");

  // 1. Simular estado do banco de dados
  console.log("\n[1] Preparando ambiente...");
  // Mocking db-helpers if needed, but here we assume they work or are mocked in test_mocks.ts
  
  // 2. Testar Processamento de Comando (Criação de Agente)
  console.log("\n[2] Testando: Criar agente chamado NEXUS-PRIME especialista em segurança");
  const result1 = await gnoxKernel.processCommand("Criar agente chamado NEXUS-PRIME especialista em segurança");
  console.log("Resultado:", JSON.stringify(result1, null, 2));

  // 3. Testar Processamento de Comando (Transação)
  console.log("\n[3] Testando: Enviar 500 para o agente 1");
  const result2 = await gnoxKernel.processCommand("Enviar 500 para o agente 1");
  console.log("Resultado:", JSON.stringify(result2, null, 2));

  // 4. Testar Auditoria de Status
  console.log("\n[4] Testando: Status do sistema");
  const result3 = await gnoxKernel.processCommand("Status do sistema");
  console.log("Resultado:", JSON.stringify(result3, null, 2));

  console.log("\n--- Teste de Integração Fase 1 Concluído ---");
}

testPhase1().catch(console.error);
