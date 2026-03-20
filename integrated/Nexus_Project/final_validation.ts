import { gnoxKernel } from "./gnox-kernel";
import * as dbHelpers from "./db-helpers";

async function validate() {
  console.log("--- Iniciando Validação Final do Ecossistema Nexus ---");

  try {
    // 1. Testar análise do ecossistema
    console.log("\n[1] Testando: Análise do Ecossistema");
    const analysis = await gnoxKernel.analyzeEcosystem();
    console.log("Análise gerada:\n", analysis);

    // 2. Testar processamento de comando (Mockado)
    console.log("\n[2] Testando: Processamento de Comando 'Status do sistema'");
    const result = await gnoxKernel.processCommand("Status do sistema");
    console.log("Resultado do Comando:", JSON.stringify(result, null, 2));

    console.log("\n--- Validação Concluída com Sucesso ---");
  } catch (error) {
    console.error("\n--- Erro na Validação ---");
    console.error(error);
  }
}

validate().catch(console.error);
