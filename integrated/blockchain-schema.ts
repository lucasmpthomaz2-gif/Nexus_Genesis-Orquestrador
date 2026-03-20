import { int, mysqlTable, text, timestamp, varchar, json, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Schema de Blockchain - Fundo Nexus
 * Tabelas para gerenciar carteiras, endereços e transações Bitcoin
 */

/**
 * Tabela de Carteiras Criptografadas
 * Armazena metadados de carteiras (chaves privadas armazenadas no CryptoVault)
 */
export const bitcoinWallets = mysqlTable("bitcoin_wallets", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // "BTC", "RSA", "MULTI_SIG"
  masterPublicKey: text("master_public_key"), // xpub para HD wallets
  masterFingerprint: varchar("master_fingerprint", { length: 8 }),
  derivationPath: varchar("derivation_path", { length: 255 }), // m/44'/0'/0'/0
  encryptedKeyId: varchar("encrypted_key_id", { length: 64 }).notNull(), // Referência ao CryptoVault
  keyVerificationHash: varchar("key_verification_hash", { length: 64 }).notNull(),
  network: varchar("network", { length: 50 }).notNull(), // "mainnet", "testnet"
  balance: decimal("balance", { precision: 20, scale: 8 }).default("0"), // BTC
  totalReceived: decimal("total_received", { precision: 20, scale: 8 }).default("0"),
  totalSent: decimal("total_sent", { precision: 20, scale: 8 }).default("0"),
  isActive: boolean("is_active").default(true),
  lastSyncedAt: timestamp("last_synced_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

/**
 * Tabela de Endereços Bitcoin
 * Armazena todos os endereços derivados de uma carteira
 */
export const bitcoinAddresses = mysqlTable("bitcoin_addresses", {
  id: varchar("id", { length: 64 }).primaryKey(),
  walletId: varchar("wallet_id", { length: 64 }).notNull(),
  address: varchar("address", { length: 255 }).notNull().unique(),
  publicKey: text("public_key").notNull(),
  derivationIndex: int("derivation_index").notNull(),
  addressType: varchar("address_type", { length: 50 }).notNull(), // "p2pkh", "p2sh", "p2wpkh", "p2wsh"
  isChangeAddress: boolean("is_change_address").default(false),
  balance: decimal("balance", { precision: 20, scale: 8 }).default("0"),
  totalReceived: decimal("total_received", { precision: 20, scale: 8 }).default("0"),
  transactionCount: int("transaction_count").default(0),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

/**
 * Tabela de UTXOs (Unspent Transaction Outputs)
 * Rastreia outputs não gastos disponíveis para transações
 */
export const bitcoinUTXOs = mysqlTable("bitcoin_utxos", {
  id: varchar("id", { length: 64 }).primaryKey(),
  walletId: varchar("wallet_id", { length: 64 }).notNull(),
  addressId: varchar("address_id", { length: 64 }).notNull(),
  txid: varchar("txid", { length: 64 }).notNull(),
  vout: int("vout").notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  scriptPubKey: text("script_pub_key").notNull(),
  confirmations: int("confirmations").default(0),
  blockHeight: int("block_height"),
  isSpent: boolean("is_spent").default(false),
  spentInTxid: varchar("spent_in_txid", { length: 64 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

/**
 * Tabela de Transações Bitcoin
 * Histórico de todas as transações da carteira
 */
export const bitcoinTransactions = mysqlTable("bitcoin_transactions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  walletId: varchar("wallet_id", { length: 64 }).notNull(),
  txid: varchar("txid", { length: 64 }).notNull().unique(),
  direction: varchar("direction", { length: 50 }).notNull(), // "incoming", "outgoing", "internal"
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  fee: decimal("fee", { precision: 20, scale: 8 }).default("0"),
  fromAddresses: json("from_addresses"), // JSON array de endereços
  toAddresses: json("to_addresses"), // JSON array de endereços
  status: varchar("status", { length: 50 }).notNull(), // "pending", "confirmed", "failed"
  confirmations: int("confirmations").default(0),
  blockHeight: int("block_height"),
  blockHash: varchar("block_hash", { length: 64 }),
  timestamp: timestamp("timestamp"),
  rawTx: text("raw_tx"), // Transação serializada em hex
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

/**
 * Tabela de Transações Orquestradas (Nexus Genesis)
 * Integração entre orquestração e transações blockchain
 */
export const orchestratedBlockchainTx = mysqlTable("orchestrated_blockchain_tx", {
  id: varchar("id", { length: 64 }).primaryKey(),
  walletId: varchar("wallet_id", { length: 64 }).notNull(),
  txid: varchar("txid", { length: 64 }),
  commandId: varchar("command_id", { length: 64 }).notNull(), // Referência ao comando de orquestração
  eventId: varchar("event_id", { length: 64 }), // Referência ao evento que disparou
  transactionType: varchar("transaction_type", { length: 50 }).notNull(), // "arbitrage", "investment", "distribution"
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  recipient: varchar("recipient", { length: 255 }).notNull(),
  purpose: text("purpose"), // Descrição do propósito
  status: varchar("status", { length: 50 }).notNull(), // "pending", "signed", "broadcast", "confirmed", "failed"
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  executedAt: timestamp("executed_at"),
  confirmedAt: timestamp("confirmed_at"),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

/**
 * Tabela de Chaves de Assinatura (para Multi-Sig)
 * Armazena informações sobre signatários em transações multi-assinatura
 */
export const multiSigSignatures = mysqlTable("multi_sig_signatures", {
  id: varchar("id", { length: 64 }).primaryKey(),
  walletId: varchar("wallet_id", { length: 64 }).notNull(),
  txid: varchar("txid", { length: 64 }).notNull(),
  signerIndex: int("signer_index").notNull(),
  publicKey: text("public_key").notNull(),
  signature: text("signature"),
  hasSignedAt: timestamp("has_signed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

/**
 * Tabela de Auditoria de Acesso a Chaves
 * Rastreia todos os acessos a chaves privadas para segurança
 */
export const keyAccessAudit = mysqlTable("key_access_audit", {
  id: varchar("id", { length: 64 }).primaryKey(),
  walletId: varchar("wallet_id", { length: 64 }).notNull(),
  keyId: varchar("key_id", { length: 64 }).notNull(),
  action: varchar("action", { length: 50 }).notNull(), // "encrypt", "decrypt", "export", "import", "sign"
  userId: varchar("user_id", { length: 64 }).notNull(),
  success: boolean("success").notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  reason: text("reason"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Tabela de Configuração de Segurança
 * Armazena políticas de segurança e limites de transação
 */
export const securityPolicies = mysqlTable("security_policies", {
  id: varchar("id", { length: 64 }).primaryKey(),
  walletId: varchar("wallet_id", { length: 64 }).notNull(),
  dailyTransactionLimit: decimal("daily_transaction_limit", {
    precision: 20,
    scale: 8,
  }),
  requireMultiSig: boolean("require_multi_sig").default(false),
  minSignatures: int("min_signatures").default(1),
  requireApproval: boolean("require_approval").default(false),
  approvalTimeoutMinutes: int("approval_timeout_minutes").default(60),
  ipWhitelist: json("ip_whitelist"), // JSON array de IPs permitidos
  enableTwoFactor: boolean("enable_two_factor").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

/**
 * Tabela de Integração com Fundo Nexus
 * Rastreia sincronização entre orquestrador e blockchain
 */
export const fundoNexusSyncLog = mysqlTable("fundo_nexus_sync_log", {
  id: varchar("id", { length: 64 }).primaryKey(),
  syncWindow: int("sync_window").notNull(),
  walletId: varchar("wallet_id", { length: 64 }).notNull(),
  balanceBefore: decimal("balance_before", { precision: 20, scale: 8 }),
  balanceAfter: decimal("balance_after", { precision: 20, scale: 8 }),
  transactionsProcessed: int("transactions_processed").default(0),
  utxosUpdated: int("utxos_updated").default(0),
  syncDurationMs: int("sync_duration_ms"),
  status: varchar("status", { length: 50 }).notNull(), // "success", "partial", "failed"
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Tipos TypeScript Exportados
 */
export type BitcoinWallet = typeof bitcoinWallets.$inferSelect;
export type InsertBitcoinWallet = typeof bitcoinWallets.$inferInsert;

export type BitcoinAddress = typeof bitcoinAddresses.$inferSelect;
export type InsertBitcoinAddress = typeof bitcoinAddresses.$inferInsert;

export type BitcoinUTXO = typeof bitcoinUTXOs.$inferSelect;
export type InsertBitcoinUTXO = typeof bitcoinUTXOs.$inferInsert;

export type BitcoinTransaction = typeof bitcoinTransactions.$inferSelect;
export type InsertBitcoinTransaction = typeof bitcoinTransactions.$inferInsert;

export type OrchestratedBlockchainTx = typeof orchestratedBlockchainTx.$inferSelect;
export type InsertOrchestratedBlockchainTx = typeof orchestratedBlockchainTx.$inferInsert;

export type MultiSigSignature = typeof multiSigSignatures.$inferSelect;
export type InsertMultiSigSignature = typeof multiSigSignatures.$inferInsert;

export type KeyAccessAudit = typeof keyAccessAudit.$inferSelect;
export type InsertKeyAccessAudit = typeof keyAccessAudit.$inferInsert;

export type SecurityPolicy = typeof securityPolicies.$inferSelect;
export type InsertSecurityPolicy = typeof securityPolicies.$inferInsert;

export type FundoNexusSyncLog = typeof fundoNexusSyncLog.$inferSelect;
export type InsertFundoNexusSyncLog = typeof fundoNexusSyncLog.$inferInsert;
