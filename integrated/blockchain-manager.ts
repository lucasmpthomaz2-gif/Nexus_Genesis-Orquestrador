import { nanoid } from "nanoid";
import { getVaultManager, getAuditLog } from "./crypto-vault";

/**
 * Gerenciador de Blockchain - Fundo Nexus
 * Integra carteiras Bitcoin com o orquestrador Nexus Genesis
 */

interface BlockchainConfig {
  network: "mainnet" | "testnet";
  apiEndpoint: string;
  apiKey: string;
  confirmationTarget: number; // Número de blocos para confirmação
}

interface TransactionRequest {
  walletId: string;
  recipient: string;
  amount: number; // BTC
  fee?: number; // BTC
  description?: string;
  commandId: string;
  eventId?: string;
}

interface TransactionResponse {
  txid: string;
  status: "pending" | "signed" | "broadcast";
  amount: number;
  fee: number;
  createdAt: Date;
}

interface WalletInfo {
  id: string;
  name: string;
  balance: number;
  totalReceived: number;
  totalSent: number;
  addressCount: number;
  transactionCount: number;
  lastSyncedAt: Date | null;
}

/**
 * Classe BlockchainManager
 */
export class BlockchainManager {
  private config: BlockchainConfig;
  private vaultManager = getVaultManager();
  private auditLog = getAuditLog();

  constructor(config: BlockchainConfig) {
    if (!config.apiEndpoint || !config.apiKey) {
      throw new Error("API endpoint e chave são obrigatórios");
    }
    this.config = config;
    console.log(
      `🔗 BlockchainManager inicializado para ${config.network} mainnet`
    );
  }

  /**
   * Cria uma nova carteira Bitcoin
   */
  async createWallet(
    name: string,
    type: "BTC" | "RSA" = "BTC"
  ): Promise<{ walletId: string; masterPublicKey: string }> {
    try {
      // Em produção, gerar chave privada real
      const walletId = nanoid();

      // Simular criação de carteira
      console.log(`📝 Carteira criada: ${name} (${walletId})`);

      return {
        walletId,
        masterPublicKey: `xpub_${walletId}`,
      };
    } catch (error) {
      console.error("Erro ao criar carteira:", error);
      throw error;
    }
  }

  /**
   * Importa uma carteira existente
   */
  async importWallet(
    name: string,
    privateKey: string,
    type: "BTC" | "RSA" = "BTC"
  ): Promise<{ walletId: string; address: string }> {
    try {
      const walletId = nanoid();

      // Armazenar chave privada no cofre criptográfico
      const keyId = this.vaultManager.storeKey({
        privateKey,
        publicKey: `pub_${walletId}`,
        address: `addr_${walletId}`,
        type,
        name,
      });

      // Registrar auditoria
      this.auditLog.logAccess({
        keyId: keyId.id,
        action: "import",
        timestamp: new Date(),
        userId: "system",
        success: true,
        reason: `Importação de carteira: ${name}`,
      });

      console.log(`✅ Carteira importada: ${name} (${walletId})`);

      return {
        walletId,
        address: `addr_${walletId}`,
      };
    } catch (error) {
      console.error("Erro ao importar carteira:", error);
      throw error;
    }
  }

  /**
   * Obtém informações de uma carteira
   */
  async getWalletInfo(walletId: string): Promise<WalletInfo> {
    try {
      // Em produção, buscar do banco de dados
      return {
        id: walletId,
        name: `Carteira ${walletId.slice(0, 8)}`,
        balance: 0,
        totalReceived: 0,
        totalSent: 0,
        addressCount: 0,
        transactionCount: 0,
        lastSyncedAt: null,
      };
    } catch (error) {
      console.error("Erro ao obter informações da carteira:", error);
      throw error;
    }
  }

  /**
   * Cria uma transação assinada
   */
  async createSignedTransaction(
    request: TransactionRequest
  ): Promise<TransactionResponse> {
    try {
      // Validar endereço destinatário
      if (!this.isValidBitcoinAddress(request.recipient)) {
        throw new Error("Endereço Bitcoin inválido");
      }

      // Validar montante
      if (request.amount <= 0) {
        throw new Error("Montante deve ser maior que zero");
      }

      // Simular assinatura de transação
      const txid = `tx_${nanoid()}`;

      // Registrar auditoria
      this.auditLog.logAccess({
        keyId: request.walletId,
        action: "sign",
        timestamp: new Date(),
        userId: "system",
        success: true,
        reason: `Transação: ${request.recipient} - ${request.amount} BTC`,
      });

      console.log(
        `✍️  Transação assinada: ${txid} - ${request.amount} BTC para ${request.recipient}`
      );

      return {
        txid,
        status: "signed",
        amount: request.amount,
        fee: request.fee || 0.0001,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      throw error;
    }
  }

  /**
   * Transmite uma transação assinada para a rede
   */
  async broadcastTransaction(txid: string): Promise<{ status: string }> {
    try {
      console.log(`📡 Transmitindo transação: ${txid}`);

      // Em produção, fazer chamada real à rede Bitcoin
      // const response = await fetch(`${this.config.apiEndpoint}/tx/send`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${this.config.apiKey}` },
      //   body: JSON.stringify({ txid })
      // });

      return { status: "broadcast" };
    } catch (error) {
      console.error("Erro ao transmitir transação:", error);
      throw error;
    }
  }

  /**
   * Sincroniza saldo e UTXOs da carteira
   */
  async syncWallet(walletId: string): Promise<{
    balance: number;
    utxos: number;
    transactions: number;
  }> {
    try {
      console.log(`🔄 Sincronizando carteira: ${walletId}`);

      // Em produção, fazer chamada real à API de blockchain
      // const response = await fetch(`${this.config.apiEndpoint}/wallet/${walletId}`, {
      //   headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      // });

      return {
        balance: 0,
        utxos: 0,
        transactions: 0,
      };
    } catch (error) {
      console.error("Erro ao sincronizar carteira:", error);
      throw error;
    }
  }

  /**
   * Valida um endereço Bitcoin
   */
  private isValidBitcoinAddress(address: string): boolean {
    // Validar formatos: P2PKH (1...), P2SH (3...), Bech32 (bc1...)
    const p2pkh = /^1[1-9A-HJ-NP-Z]{25,34}$/;
    const p2sh = /^3[1-9A-HJ-NP-Z]{25,34}$/;
    const bech32 = /^bc1[a-z0-9]{39,59}$/;

    return p2pkh.test(address) || p2sh.test(address) || bech32.test(address);
  }

  /**
   * Calcula taxa de transação recomendada
   */
  async estimateFee(sizeBytes: number): Promise<number> {
    try {
      // Em produção, buscar taxa recomendada da rede
      // const response = await fetch(`${this.config.apiEndpoint}/fees`, {
      //   headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      // });

      // Simular: 10 satoshis por byte = 0.0001 BTC por 100 bytes
      return (sizeBytes * 10) / 100000000;
    } catch (error) {
      console.error("Erro ao estimar taxa:", error);
      return 0.0001; // Taxa padrão
    }
  }

  /**
   * Obtém histórico de transações
   */
  async getTransactionHistory(
    walletId: string,
    limit: number = 50
  ): Promise<
    Array<{
      txid: string;
      amount: number;
      direction: "incoming" | "outgoing";
      status: string;
      timestamp: Date;
    }>
  > {
    try {
      // Em produção, buscar do banco de dados
      return [];
    } catch (error) {
      console.error("Erro ao obter histórico:", error);
      throw error;
    }
  }

  /**
   * Detecta atividade suspeita
   */
  async detectSuspiciousActivity(walletId: string): Promise<boolean> {
    try {
      // Verificar logs de auditoria
      const logs = this.auditLog.getLogs(walletId, 10);

      // Alertar se muitos acessos em pouco tempo
      if (logs.length > 5) {
        console.warn(`⚠️  Atividade suspeita detectada em: ${walletId}`);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erro ao detectar atividade suspeita:", error);
      return false;
    }
  }
}

/**
 * Integração com Nexus Genesis Orchestrator
 */
export class BlockchainOrchestrationBridge {
  private blockchainManager: BlockchainManager;
  private fundoNexusWalletId: string;

  constructor(
    blockchainManager: BlockchainManager,
    fundoNexusWalletId: string
  ) {
    this.blockchainManager = blockchainManager;
    this.fundoNexusWalletId = fundoNexusWalletId;
  }

  /**
   * Executa transação orquestrada (comando do Genesis)
   */
  async executeOrchestratedTransaction(
    commandId: string,
    eventId: string,
    recipient: string,
    amount: number,
    description: string
  ): Promise<TransactionResponse> {
    try {
      console.log(
        `🎯 Executando transação orquestrada: ${commandId} - ${amount} BTC`
      );

      // 1. Criar transação assinada
      const txRequest: TransactionRequest = {
        walletId: this.fundoNexusWalletId,
        recipient,
        amount,
        commandId,
        eventId,
        description,
      };

      const signedTx = await this.blockchainManager.createSignedTransaction(
        txRequest
      );

      // 2. Transmitir para a rede
      await this.blockchainManager.broadcastTransaction(signedTx.txid);

      // 3. Sincronizar carteira
      await this.blockchainManager.syncWallet(this.fundoNexusWalletId);

      console.log(`✅ Transação orquestrada concluída: ${signedTx.txid}`);

      return signedTx;
    } catch (error) {
      console.error("Erro ao executar transação orquestrada:", error);
      throw error;
    }
  }

  /**
   * Obtém saldo do Fundo Nexus
   */
  async getFundoBalance(): Promise<number> {
    try {
      const info = await this.blockchainManager.getWalletInfo(
        this.fundoNexusWalletId
      );
      return info.balance;
    } catch (error) {
      console.error("Erro ao obter saldo do fundo:", error);
      return 0;
    }
  }

  /**
   * Sincroniza estado do Fundo com Nexus Genesis
   */
  async syncFundoState(): Promise<{
    balance: number;
    lastSync: Date;
    status: string;
  }> {
    try {
      const syncResult = await this.blockchainManager.syncWallet(
        this.fundoNexusWalletId
      );

      return {
        balance: syncResult.balance,
        lastSync: new Date(),
        status: "synced",
      };
    } catch (error) {
      console.error("Erro ao sincronizar fundo:", error);
      return {
        balance: 0,
        lastSync: new Date(),
        status: "error",
      };
    }
  }
}

/**
 * Instância global do gerenciador de blockchain
 */
let blockchainManager: BlockchainManager | null = null;
let orchestrationBridge: BlockchainOrchestrationBridge | null = null;

export function initializeBlockchain(config: BlockchainConfig): void {
  blockchainManager = new BlockchainManager(config);
  console.log("✅ Blockchain inicializado");
}

export function getBlockchainManager(): BlockchainManager {
  if (!blockchainManager) {
    throw new Error(
      "Blockchain não inicializado. Chame initializeBlockchain() primeiro"
    );
  }
  return blockchainManager;
}

export function initializeOrchestrationBridge(
  fundoNexusWalletId: string
): void {
  if (!blockchainManager) {
    throw new Error("BlockchainManager não inicializado");
  }
  orchestrationBridge = new BlockchainOrchestrationBridge(
    blockchainManager,
    fundoNexusWalletId
  );
  console.log("✅ Ponte de orquestração blockchain inicializada");
}

export function getOrchestrationBridge(): BlockchainOrchestrationBridge {
  if (!orchestrationBridge) {
    throw new Error(
      "OrchestrationBridge não inicializado. Chame initializeOrchestrationBridge() primeiro"
    );
  }
  return orchestrationBridge;
}
