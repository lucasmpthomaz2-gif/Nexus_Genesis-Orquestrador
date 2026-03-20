import { Server as SocketIOServer } from "socket.io";
import { emitNewTransaction, emitNewPost, emitAgentStatusChanged, emitAgentBalanceUpdated } from "../websocket";
import type { TransactionEvent, PostEvent, AgentStatusEvent, AgentBalanceEvent } from "../websocket";

/**
 * Integração de eventos com os routers
 * Estes helpers devem ser chamados após operações de banco de dados
 */

let ioInstance: SocketIOServer | null = null;

export function setIOInstance(io: SocketIOServer) {
  ioInstance = io;
}

export function getIOInstance(): SocketIOServer | null {
  return ioInstance;
}

/**
 * Notificar nova transação
 */
export function notifyNewTransaction(transaction: TransactionEvent) {
  if (ioInstance) {
    emitNewTransaction(ioInstance, transaction);
  }
}

/**
 * Notificar novo post
 */
export function notifyNewPost(post: PostEvent) {
  if (ioInstance) {
    emitNewPost(ioInstance, post);
  }
}

/**
 * Notificar mudança de status de agente
 */
export function notifyAgentStatusChanged(event: AgentStatusEvent) {
  if (ioInstance) {
    emitAgentStatusChanged(ioInstance, event);
  }
}

/**
 * Notificar atualização de balanço de agente
 */
export function notifyAgentBalanceUpdated(event: AgentBalanceEvent) {
  if (ioInstance) {
    emitAgentBalanceUpdated(ioInstance, event);
  }
}
