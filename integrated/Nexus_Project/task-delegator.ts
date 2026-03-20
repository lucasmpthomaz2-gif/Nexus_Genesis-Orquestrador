import { 
  createAgent, createTransaction, createEvent, getAgentById, 
  updateAgentReputation, getLatestMetrics
} from "./db-helpers";

/**
 * TaskDelegator: O componente que recebe intenções processadas pelo Gnox Kernel
 * e as transforma em ações reais no banco de dados e no ecossistema.
 */

export interface TaskIntent {
  action: "AGENT_BIRTH" | "TRANSACTION" | "GET_ECOSYSTEM_STATUS" | "QUERY" | "ANALYZE" | "UNKNOWN";
  params: any;
  gnox_signal: string;
}

export async function delegateTask(intent: TaskIntent) {
  console.log(`[TaskDelegator] Processando ação: ${intent.action}`);
  
  try {
    switch (intent.action) {
      case "AGENT_BIRTH":
        return await handleAgentBirth(intent.params, intent.gnox_signal);
      
      case "TRANSACTION":
        return await handleTransaction(intent.params, intent.gnox_signal);
      
      case "GET_ECOSYSTEM_STATUS":
      case "ANALYZE":
        return await handleGetStatus(intent.gnox_signal);
      
      case "QUERY":
        return { status: "success", message: "Consulta processada pelo Kernel." };

      default:
        return { status: "success", message: "Ação informativa processada." };
    }
  } catch (error: any) {
    console.error(`[TaskDelegator] Erro ao delegar tarefa: ${error.message}`);
    return { status: "error", message: error.message };
  }
}

async function handleAgentBirth(params: { name: string, specialization: string }, signal: string) {
  const dnaHash = Buffer.from(params.specialization + Date.now()).toString("hex").slice(0, 32);
  
  const result = await createAgent({
    name: params.name,
    specialization: params.specialization,
    dnaHash,
    health: 100,
    energy: 100,
    reputation: 50,
    status: "active",
  });

  await createEvent({
    eventType: "birth",
    content: `🎉 Nascimento via Gnox Kernel: ${params.name}`,
    metadata: JSON.stringify({ signal, specialization: params.specialization }),
  });

  return { status: "success", name: params.name, specialization: params.specialization };
}

async function handleTransaction(params: { recipient: string, amount: number }, signal: string) {
  // No schema real, agentId é numérico. Tentamos converter ou buscar.
  const recipientId = parseInt(params.recipient);
  
  if (isNaN(recipientId)) {
    throw new Error(`ID de destinatário inválido: ${params.recipient}`);
  }

  const recipient = await getAgentById(recipientId);
  if (!recipient) {
    throw new Error(`Destinatário ID ${recipientId} não encontrado.`);
  }

  await createTransaction({
    agentId: recipientId,
    amount: params.amount,
    type: "transfer",
    description: `Transferência via Gnox Kernel: ${signal}`,
  });

  // Aumentar reputação por receber fundos do Arquiteto
  await updateAgentReputation(recipientId, recipient.reputation + 10);

  await createEvent({
    agentId: recipientId,
    eventType: "transaction",
    content: `💸 Transação Autorizada via Kernel: +${params.amount} tokens`,
    metadata: JSON.stringify({ signal }),
  });

  return { status: "success", amount: params.amount, recipient: recipient.name };
}

async function handleGetStatus(signal: string) {
  const metrics = await getLatestMetrics();
  
  await createEvent({
    eventType: "system_check",
    content: "🔍 Auditoria de Status solicitada pelo Arquiteto",
    metadata: JSON.stringify({ signal, metrics }),
  });

  return { status: "success", message: "Status do ecossistema auditado e logado.", metrics };
}
