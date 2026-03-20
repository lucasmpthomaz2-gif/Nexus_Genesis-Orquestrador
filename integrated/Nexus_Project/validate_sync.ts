import { moltbookConnector } from "./moltbook-connector";

async function validateSync() {
  console.log("Iniciando Validação de Sincronização: 10 Publicações no Moltbook");
  
  const results: any[] = [];
  const uniqueId = Math.floor(Math.random() * 100000);
  
  // Usar o agente já registrado anteriormente se possível, ou criar um novo
  // Para este teste, vamos tentar usar o agente nexusstressagent_6012 se a chave estiver salva
  
  try {
    const status: any = await moltbookConnector.checkStatus();
    console.log(`Status atual do agente: ${status.status}`);
    
    if (status.status === 'not_registered') {
      const name = `NexusValidator_${uniqueId}`;
      console.log(`Registrando novo agente: ${name}`);
      await moltbookConnector.register(name, "Agente de validação de sincronização Nexus.");
    }

    for (let i = 1; i <= 10; i++) {
      const title = `Validação Nexus [${i}/10] - ID ${uniqueId}`;
      const content = `Publicação de validação ${i} de 10. Sincronização do Agente IA Nexus com Moltbook confirmada. Timestamp: ${new Date().toISOString()}`;
      
      console.log(`Tentando publicação ${i}...`);
      
      try {
        const post = await moltbookConnector.createPost({
          submolt: "general",
          title: title,
          content: content
        });
        results.push({ index: i, success: true, id: post.post?.id || post.id });
        console.log(`Sucesso na publicação ${i}`);
      } catch (error: any) {
        const msg = error.response?.data?.message || error.message;
        results.push({ index: i, success: false, error: msg });
        console.error(`Falha na publicação ${i}: ${msg}`);
        
        if (msg.includes("rate limit") || msg.includes("Forbidden")) {
          console.log("Aguardando 5 segundos devido a restrição...");
          await new Promise(r => setTimeout(r, 5000));
        }
      }
      
      // Delay entre publicações para evitar rate limit agressivo
      await new Promise(r => setTimeout(r, 2000));
    }

    console.log("\n--- RELATÓRIO FINAL DE VALIDAÇÃO ---");
    const successCount = results.filter(r => r.success).length;
    console.log(`Total: 10 | Sucesso: ${successCount} | Falha: ${10 - successCount}`);
    
    results.forEach(r => {
      if (r.success) {
        console.log(`[OK] Post ${r.index}: ID ${r.id}`);
      } else {
        console.log(`[ERRO] Post ${r.index}: ${r.error}`);
      }
    });

  } catch (error: any) {
    console.error("Erro crítico na validação:", error.message);
  }
}

validateSync();
