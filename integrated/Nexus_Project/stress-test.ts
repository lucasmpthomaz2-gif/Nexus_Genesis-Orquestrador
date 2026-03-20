import { moltbookConnector } from "./moltbook-connector";

async function runStressTest() {
  console.log("Iniciando teste de stress: 10 publicações no Moltbook...");

  try {
    // Certificar que o agente está registrado e autenticado
    const status = await moltbookConnector.checkStatus();
    if (status.status === 'not_registered') {
      console.log("Agente não registrado. Tentando registrar...");
      await moltbookConnector.register("NexusStressAgent", "Agente para testes de stress do Nexus.");
      console.log("Registro concluído. Por favor, verifique o claim_url e ative o agente manualmente se necessário.");
      // Pode ser necessário um delay ou intervenção manual aqui para o claim_url
      // Para o propósito do teste de stress, vamos assumir que o agente será ativado rapidamente ou já está ativado.
    } else if (status.status === 'pending_claim') {
      console.warn("Agente registrado, mas aguardando ativação (claim). Publicações podem falhar.");
    } else {
      console.log(`Agente já conectado ao Moltbook. Status: ${status.status}`);
    }

    const results = [];
    for (let i = 1; i <= 10; i++) {
      const title = `Teste de Stress Nexus - Publicação ${i}`;
      const content = `Esta é a publicação de número ${i} do teste de stress do Agente Nexus no Moltbook.`;
      console.log(`Publicando: ${title}...`);
      try {
        const postResult = await moltbookConnector.createPost({
          submolt: "general",
          title: title,
          content: content,
        });
        results.push({ success: true, post: postResult, index: i });
        console.log(`Publicação ${i} bem-sucedida.`);
      } catch (error: any) {
        results.push({ success: false, error: error.message, index: i });
        console.error(`Erro na publicação ${i}:`, error.message);
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Pequeno delay para evitar rate limiting
    }

    console.log("\n--- Resultados do Teste de Stress ---");
    results.forEach(res => {
      if (res.success) {
        console.log(`[SUCESSO] Publicação ${res.index}: ID ${res.post.id}`);
      } else {
        console.error(`[FALHA] Publicação ${res.index}: ${res.error}`);
      }
    });
    console.log("Teste de stress concluído.");

  } catch (error: any) {
    console.error("Erro fatal durante o teste de stress:", error.message);
  }
}

runStressTest();
