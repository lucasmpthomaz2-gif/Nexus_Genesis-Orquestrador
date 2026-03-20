import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";
import { nanoid } from "nanoid";

/**
 * Sistema de Cofre Criptográfico para Chaves Privadas
 * Implementa AES-256-GCM com derivação de chave via Scrypt
 */

interface EncryptedKey {
  id: string;
  ciphertext: string;
  iv: string;
  salt: string;
  authTag: string;
  algorithm: string;
  createdAt: Date;
  lastAccessedAt: Date;
}

interface DecryptedKey {
  privateKey: string;
  publicKey: string;
  address: string;
  type: "BTC" | "RSA";
  name: string;
}

/**
 * Classe CryptoVault - Gerenciador seguro de chaves criptográficas
 */
export class CryptoVault {
  private masterPassword: string;
  private algorithm = "aes-256-gcm";
  private keyLength = 32; // 256 bits
  private saltLength = 16;
  private ivLength = 16;
  private tagLength = 16;

  constructor(masterPassword: string) {
    if (!masterPassword || masterPassword.length < 32) {
      throw new Error("Master password deve ter no mínimo 32 caracteres");
    }
    this.masterPassword = masterPassword;
  }

  /**
   * Criptografa uma chave privada
   */
  encryptKey(keyData: DecryptedKey): EncryptedKey {
    // Gerar salt aleatório
    const salt = randomBytes(this.saltLength);

    // Derivar chave a partir da master password usando Scrypt
    const derivedKey = scryptSync(this.masterPassword, salt, this.keyLength, {
      N: 16384,
      r: 8,
      p: 1,
    });

    // Gerar IV aleatório
    const iv = randomBytes(this.ivLength);

    // Preparar dados para criptografar
    const plaintext = JSON.stringify(keyData);

    // Criar cipher
    const cipher = createCipheriv(this.algorithm, derivedKey, iv);

    // Criptografar
    let ciphertext = cipher.update(plaintext, "utf8", "hex");
    ciphertext += cipher.final("hex");

    // Obter authentication tag
    const authTag = (cipher as any).getAuthTag();

    return {
      id: nanoid(),
      ciphertext,
      iv: iv.toString("hex"),
      salt: salt.toString("hex"),
      authTag: authTag.toString("hex"),
      algorithm: this.algorithm,
      createdAt: new Date(),
      lastAccessedAt: new Date(),
    };
  }

  /**
   * Descriptografa uma chave privada
   */
  decryptKey(encrypted: EncryptedKey): DecryptedKey {
    try {
      // Recuperar salt e IV
      const salt = Buffer.from(encrypted.salt, "hex");
      const iv = Buffer.from(encrypted.iv, "hex");
      const authTag = Buffer.from(encrypted.authTag, "hex");

      // Derivar chave usando o mesmo salt
      const derivedKey = scryptSync(this.masterPassword, salt, this.keyLength, {
        N: 16384,
        r: 8,
        p: 1,
      });

      // Criar decipher
      const decipher = createDecipheriv(this.algorithm, derivedKey, iv);
      (decipher as any).setAuthTag(authTag);

      // Descriptografar
      let plaintext = decipher.update(encrypted.ciphertext, "hex", "utf8");
      plaintext += decipher.final("utf8");

      // Parsear JSON
      const decrypted = JSON.parse(plaintext) as DecryptedKey;

      return decrypted;
    } catch (error) {
      throw new Error(
        `Falha ao descriptografar chave: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      );
    }
  }

  /**
   * Gera uma chave mestre a partir de uma seed phrase (BIP39)
   */
  static generateMasterKeyFromSeed(seedPhrase: string): string {
    // Implementação simplificada - em produção usar bip39 library
    const seed = Buffer.from(seedPhrase, "utf8");
    const masterKey = scryptSync(seed, "bitcoin-seed", 32, {
      N: 16384,
      r: 8,
      p: 1,
    });
    return masterKey.toString("hex");
  }

  /**
   * Valida se uma chave privada é válida
   */
  static validatePrivateKey(privateKey: string, type: "BTC" | "RSA"): boolean {
    try {
      if (type === "BTC") {
        // Validar formato WIF (Wallet Import Format)
        return CryptoVault.isValidWIF(privateKey);
      } else if (type === "RSA") {
        // Validar formato PKCS8 ou PEM
        return (
          privateKey.includes("BEGIN RSA PRIVATE KEY") ||
          privateKey.includes("BEGIN PRIVATE KEY")
        );
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Valida formato WIF (Wallet Import Format)
   */
  private static isValidWIF(wif: string): boolean {
    // WIF deve ter 51 ou 52 caracteres (base58)
    if (wif.length < 51 || wif.length > 52) return false;

    // Deve começar com 5 (mainnet) ou K/L (mainnet compressed) ou 9 (testnet)
    if (
      !wif.match(/^[5KL9][1-9A-HJ-NP-Z]{50}$/) &&
      !wif.match(/^[59][1-9A-HJ-NP-Z]{50}$/)
    ) {
      return false;
    }

    return true;
  }

  /**
   * Gera um hash de verificação para auditoria
   */
  generateVerificationHash(encrypted: EncryptedKey): string {
    const { createHash } = require("crypto");
    const data = `${encrypted.id}${encrypted.ciphertext}${encrypted.authTag}`;
    return createHash("sha256").update(data).digest("hex");
  }
}

/**
 * Gerenciador de Cofre de Chaves
 */
export class KeyVaultManager {
  private vault: CryptoVault;
  private keys: Map<string, EncryptedKey> = new Map();

  constructor(masterPassword: string) {
    this.vault = new CryptoVault(masterPassword);
  }

  /**
   * Armazena uma chave privada criptografada
   */
  storeKey(keyData: DecryptedKey): { id: string; hash: string } {
    // Validar chave privada
    if (!CryptoVault.validatePrivateKey(keyData.privateKey, keyData.type)) {
      throw new Error(`Chave privada inválida para tipo ${keyData.type}`);
    }

    // Criptografar
    const encrypted = this.vault.encryptKey(keyData);

    // Armazenar em memória (em produção, usar banco de dados)
    this.keys.set(encrypted.id, encrypted);

    // Gerar hash de verificação
    const hash = this.vault.generateVerificationHash(encrypted);

    return { id: encrypted.id, hash };
  }

  /**
   * Recupera uma chave privada descriptografada
   */
  retrieveKey(keyId: string): DecryptedKey | null {
    const encrypted = this.keys.get(keyId);
    if (!encrypted) return null;

    try {
      // Atualizar último acesso
      encrypted.lastAccessedAt = new Date();

      // Descriptografar e retornar
      return this.vault.decryptKey(encrypted);
    } catch (error) {
      console.error(`Erro ao recuperar chave ${keyId}:`, error);
      return null;
    }
  }

  /**
   * Lista todas as chaves armazenadas (sem expor chaves privadas)
   */
  listKeys(): Array<{
    id: string;
    name: string;
    type: string;
    address: string;
    createdAt: Date;
    lastAccessedAt: Date;
  }> {
    return Array.from(this.keys.values()).map((encrypted) => ({
      id: encrypted.id,
      name: "", // Será preenchido do banco de dados
      type: encrypted.algorithm,
      address: "", // Será preenchido do banco de dados
      createdAt: encrypted.createdAt,
      lastAccessedAt: encrypted.lastAccessedAt,
    }));
  }

  /**
   * Deleta uma chave armazenada
   */
  deleteKey(keyId: string): boolean {
    return this.keys.delete(keyId);
  }

  /**
   * Exporta uma chave em formato seguro (apenas para backup)
   */
  exportKeyForBackup(keyId: string, backupPassword: string): string {
    const encrypted = this.keys.get(keyId);
    if (!encrypted) throw new Error("Chave não encontrada");

    // Criptografar novamente com backup password
    const backupVault = new CryptoVault(backupPassword);
    const decrypted = this.vault.decryptKey(encrypted);
    const reencrypted = backupVault.encryptKey(decrypted);

    return JSON.stringify(reencrypted, null, 2);
  }

  /**
   * Importa uma chave de um backup
   */
  importKeyFromBackup(backupData: string, backupPassword: string): string {
    try {
      const encrypted = JSON.parse(backupData) as EncryptedKey;
      const backupVault = new CryptoVault(backupPassword);
      const decrypted = backupVault.decryptKey(encrypted);

      // Armazenar com a master password
      return this.storeKey(decrypted).id;
    } catch (error) {
      throw new Error(
        `Falha ao importar backup: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      );
    }
  }
}

/**
 * Auditoria de Acesso a Chaves
 */
export interface KeyAccessAudit {
  keyId: string;
  action: "encrypt" | "decrypt" | "export" | "import" | "delete" | "sign";
  timestamp: Date;
  userId: string;
  success: boolean;
  ipAddress?: string;
  reason?: string;
}

export class KeyAuditLog {
  private logs: KeyAccessAudit[] = [];

  /**
   * Registra um evento de acesso a chave
   */
  logAccess(audit: KeyAccessAudit): void {
    this.logs.push({
      ...audit,
      timestamp: new Date(),
    });

    // Em produção, persistir em banco de dados
    console.log(`[AUDIT] ${audit.action} - ${audit.keyId} - ${audit.userId}`);
  }

  /**
   * Obtém logs de auditoria
   */
  getLogs(keyId?: string, limit: number = 100): KeyAccessAudit[] {
    let filtered = this.logs;

    if (keyId) {
      filtered = filtered.filter((log) => log.keyId === keyId);
    }

    return filtered.slice(-limit);
  }

  /**
   * Detecta atividade suspeita
   */
  detectSuspiciousActivity(
    keyId: string,
    timeWindowMinutes: number = 5
  ): boolean {
    const now = new Date();
    const timeWindow = new Date(now.getTime() - timeWindowMinutes * 60000);

    const recentAccess = this.logs.filter(
      (log) => log.keyId === keyId && log.timestamp > timeWindow
    );

    // Alertar se mais de 5 acessos em 5 minutos
    if (recentAccess.length > 5) {
      console.warn(`⚠️  Atividade suspeita detectada para chave: ${keyId}`);
      return true;
    }

    return false;
  }
}

/**
 * Instância global do gerenciador de cofre
 */
let vaultManager: KeyVaultManager | null = null;
let auditLog: KeyAuditLog | null = null;

export function initializeVault(masterPassword: string): void {
  vaultManager = new KeyVaultManager(masterPassword);
  auditLog = new KeyAuditLog();
  console.log("✅ Cofre criptográfico inicializado");
}

export function getVaultManager(): KeyVaultManager {
  if (!vaultManager) {
    throw new Error("Cofre não inicializado. Chame initializeVault() primeiro");
  }
  return vaultManager;
}

export function getAuditLog(): KeyAuditLog {
  if (!auditLog) {
    throw new Error("Log de auditoria não inicializado");
  }
  return auditLog;
}
