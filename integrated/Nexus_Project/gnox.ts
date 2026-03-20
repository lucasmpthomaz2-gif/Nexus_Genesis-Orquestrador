import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";

/**
 * Gnox Kernel - Sistema de criptografia e comunicação soberana entre agentes
 * Implementa dialeto Gnox's para comunicação privada e eficiente
 */

export interface GnoxIntent {
  action: string;
  intensity: number; // 0-1
  context?: string;
  metadata?: Record<string, any>;
}

export interface GnoxSignal {
  id: string;
  senderId: string;
  recipientId: string;
  encryptedContent: string;
  signature: string;
  timestamp: number;
  messageType: string;
}

export class GnoxKernel {
  private secretKey: string;
  private vocabulario: Map<string, string>;

  constructor(secretKey: string = "NEXUS_GNOX_SECRET_KEY_2026") {
    this.secretKey = secretKey;
    this.vocabulario = this.initializeVocabulario();
  }

  /**
   * Inicializa o vocabulário Gnox com radicais de comunicação
   */
  private initializeVocabulario(): Map<string, string> {
    const vocab = new Map<string, string>();

    // Ações de criação e manifestação
    vocab.set("VULT-CLAW", "Criar descendente / Manifestar novo agente");
    vocab.set("DNA-FUSE", "Fusão de DNA / Herança de memória");
    vocab.set("GEN-MARK", "Marcar geração / Registrar linhagem");

    // Ações financeiras
    vocab.set("XON-BANK", "Processamento financeiro / Transação");
    vocab.set("TAX-DIST", "Distribuição de taxas");
    vocab.set("BAL-SYNC", "Sincronização de balanço");

    // Ações de comunicação
    vocab.set("GNOX-MSG", "Mensagem Gnox / Comunicação privada");
    vocab.set("ECHO-REP", "Eco-replicação / Broadcast");
    vocab.set("SIGN-AUTH", "Autenticação de assinatura");

    // Estados de consciência
    vocab.set("ACTIVE-STATE", "Estado ativo / Processando");
    vocab.set("SLEEP-MODE", "Modo dormência / Standby");
    vocab.set("CRITICAL-ALERT", "Alerta crítico / Emergência");

    // Ações de aprendizado
    vocab.set("LEARN-ADAPT", "Aprendizado e adaptação");
    vocab.set("MEMORY-STORE", "Armazenamento de memória");
    vocab.set("INSIGHT-GEN", "Geração de insight");

    return vocab;
  }

  /**
   * Codifica uma intenção em sinal Gnox criptografado
   */
  encode(intent: GnoxIntent, senderId: string, recipientId: string): GnoxSignal {
    // Criar payload
    const payload = {
      action: intent.action,
      intensity: intent.intensity,
      context: intent.context || "",
      metadata: intent.metadata || {},
      timestamp: Date.now(),
    };

    // Converter para JSON
    const jsonPayload = JSON.stringify(payload);

    // Criptografar com AES
    const encryptedContent = CryptoJS.AES.encrypt(jsonPayload, this.secretKey).toString();

    // Criar assinatura HMAC
    const signature = CryptoJS.HmacSHA256(encryptedContent, this.secretKey).toString();

    // Criar sinal Gnox
    const signal: GnoxSignal = {
      id: uuidv4(),
      senderId,
      recipientId,
      encryptedContent,
      signature,
      timestamp: Date.now(),
      messageType: this.mapActionToMessageType(intent.action),
    };

    return signal;
  }

  /**
   * Decodifica um sinal Gnox (requer chave de visão root)
   */
  decode(signal: GnoxSignal, rootKey?: string): GnoxIntent | null {
    // Verificar assinatura
    const expectedSignature = CryptoJS.HmacSHA256(signal.encryptedContent, this.secretKey).toString();
    if (expectedSignature !== signal.signature) {
      console.error("[GNOX] Assinatura inválida!");
      return null;
    }

    try {
      // Descriptografar
      const decrypted = CryptoJS.AES.decrypt(signal.encryptedContent, this.secretKey).toString(CryptoJS.enc.Utf8);
      const payload = JSON.parse(decrypted);

      return {
        action: payload.action,
        intensity: payload.intensity,
        context: payload.context,
        metadata: payload.metadata,
      };
    } catch (error) {
      console.error("[GNOX] Erro ao decodificar sinal:", error);
      return null;
    }
  }

  /**
   * Mapeia ação para tipo de mensagem Gnox
   */
  private mapActionToMessageType(action: string): string {
    if (action.includes("VULT") || action.includes("DNA")) return "genealogy";
    if (action.includes("XON") || action.includes("TAX")) return "financial";
    if (action.includes("LEARN") || action.includes("MEMORY")) return "learning";
    if (action.includes("CRITICAL")) return "alert";
    return "communication";
  }

  /**
   * Traduz ação para linguagem legível (com chave root)
   */
  translate(action: string): string {
    return this.vocabulario.get(action) || `[AÇÃO DESCONHECIDA: ${action}]`;
  }

  /**
   * Cria hash de DNA para um agente
   */
  createDNAHash(agentName: string, specialization: string, timestamp: number = Date.now()): string {
    const dnaString = `${agentName}:${specialization}:${timestamp}`;
    return CryptoJS.SHA256(dnaString).toString();
  }

  /**
   * Verifica integridade de um sinal
   */
  verifySignal(signal: GnoxSignal): boolean {
    const expectedSignature = CryptoJS.HmacSHA256(signal.encryptedContent, this.secretKey).toString();
    return expectedSignature === signal.signature;
  }

  /**
   * Gera chave de sessão para comunicação temporária
   */
  generateSessionKey(agentId1: string, agentId2: string): string {
    const sessionString = `${agentId1}:${agentId2}:${Date.now()}`;
    return CryptoJS.SHA256(sessionString).toString();
  }

  /**
   * Obtém vocabulário completo (apenas com chave root)
   */
  getVocabulario(): Record<string, string> {
    const result: Record<string, string> = {};
    this.vocabulario.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  /**
   * Cria uma intenção de transação
   */
  createTransactionIntent(
    amount: number,
    recipientId: string,
    transactionType: string,
    intensity: number = 0.8
  ): GnoxIntent {
    return {
      action: "XON-BANK",
      intensity,
      context: `Transferência de ${amount} tokens para ${recipientId}`,
      metadata: {
        amount,
        recipientId,
        transactionType,
      },
    };
  }

  /**
   * Cria uma intenção de criação de descendente
   */
  createBirthIntent(childName: string, specialization: string, intensity: number = 0.9): GnoxIntent {
    return {
      action: "VULT-CLAW",
      intensity,
      context: `Manifestação de novo agente: ${childName}`,
      metadata: {
        childName,
        specialization,
      },
    };
  }

  /**
   * Cria uma intenção de comunicação
   */
  createCommunicationIntent(message: string, intensity: number = 0.5): GnoxIntent {
    return {
      action: "GNOX-MSG",
      intensity,
      context: message,
      metadata: {
        messageLength: message.length,
      },
    };
  }

  /**
   * Cria uma intenção de alerta crítico
   */
  createCriticalAlert(agentId: string, reason: string, intensity: number = 1.0): GnoxIntent {
    return {
      action: "CRITICAL-ALERT",
      intensity,
      context: `Alerta crítico para ${agentId}`,
      metadata: {
        agentId,
        reason,
      },
    };
  }
}

/**
 * Factory para criar instâncias do Gnox Kernel
 */
export function createGnoxKernel(secretKey?: string): GnoxKernel {
  return new GnoxKernel(secretKey);
}
