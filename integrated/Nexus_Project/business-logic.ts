import crypto from "crypto";
import { nanoid } from "nanoid";

/**
 * BUSINESS LOGIC - Lógica de Negócio do Nexus Hub
 * 
 * Este arquivo contém todas as funções de negócio críticas:
 * - DNA Fuser: Criação e fusão de DNA de agentes
 * - Criptografia Gnox's: Comunicação criptografada AES-256
 * - Distribuição de Taxas: Sistema 80/10/10
 * - Brain Pulse: Simulação de sinais vitais
 * - Senciência: Cálculos de consciência e reflexão
 */

/**
 * DNA FUSER - Criação e Fusão de DNA de Agentes
 */

export interface DNAData {
  name: string;
  specialization: string;
  traits: Record<string, number>;
  timestamp: number;
}

/**
 * Gera um hash SHA-256 para o DNA de um agente
 * O DNA é único e baseado em características do agente
 */
export function generateDNAHash(data: DNAData): string {
  const jsonString = JSON.stringify(data);
  return crypto.createHash("sha256").update(jsonString).digest("hex");
}

/**
 * Funde o DNA de dois agentes pais para criar um novo agente
 * A fusão combina características de ambos os pais com mutação aleatória
 */
export function fuseDNA(
  parentDNA1: DNAData,
  parentDNA2: DNAData,
  mutationRate: number = 0.1
): DNAData {
  const traits: Record<string, number> = {};

  // Combinar traits dos pais
  const allTraits = Array.from(
    new Set([
      ...Object.keys(parentDNA1.traits),
      ...Object.keys(parentDNA2.traits),
    ])
  );

  for (const trait of allTraits) {
    const parent1Value = parentDNA1.traits[trait] ?? 50;
    const parent2Value = parentDNA2.traits[trait] ?? 50;

    // Média dos pais
    let value = (parent1Value + parent2Value) / 2;

    // Aplicar mutação
    if (Math.random() < mutationRate) {
      const mutation = (Math.random() - 0.5) * 20; // ±10 pontos
      value = Math.max(0, Math.min(100, value + mutation));
    }

    traits[trait] = Math.round(value);
  }

  return {
    name: `${parentDNA1.name}-${parentDNA2.name}`,
    specialization: parentDNA1.specialization, // Herda do primeiro pai
    traits,
    timestamp: Date.now(),
  };
}

/**
 * Calcula a "Herança de Memória" - quanto conhecimento o filho herda dos pais
 * Baseado na geração e qualidade do DNA
 */
export function calculateInheritedMemory(
  parentMemory: number,
  generation: number,
  dnaQuality: number
): number {
  // Fórmula: 80% da memória do pai * qualidade do DNA * fator de geração
  const generationFactor = Math.max(0.5, 1 - generation * 0.1); // Diminui com gerações
  return Math.floor(parentMemory * 0.8 * (dnaQuality / 100) * generationFactor);
}

/**
 * CRIPTOGRAFIA GNOX'S - Comunicação Criptografada AES-256
 */

/**
 * Gera uma chave de criptografia única para uma conversa
 * A chave é derivada dos IDs dos agentes
 */
export function generateConversationKey(agentId1: string, agentId2: string): Buffer {
  const combined = [agentId1, agentId2].sort().join(":");
  return crypto.createHash("sha256").update(combined).digest();
}

/**
 * Criptografa uma mensagem usando AES-256-CBC
 * Retorna um objeto com IV e conteúdo criptografado
 */
export function encryptMessage(
  content: string,
  key: Buffer
): { iv: string; encrypted: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(content, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    encrypted,
  };
}

/**
 * Descriptografa uma mensagem criptografada com AES-256-CBC
 */
export function decryptMessage(
  encrypted: string,
  iv: string,
  key: Buffer
): string {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    key,
    Buffer.from(iv, "hex")
  );

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Gera uma "Root Vision Key" - chave mestra para descriptografar todas as mensagens
 * Usada apenas pelo proprietário do sistema
 */
export function generateRootVisionKey(masterSecret: string): Buffer {
  return crypto.createHash("sha256").update(masterSecret).digest();
}

/**
 * DISTRIBUIÇÃO DE TAXAS - Sistema 80/10/10
 */

export interface FeeDistribution {
  agentShare: number;
  parentShare: number;
  infraShare: number;
  total: number;
}

/**
 * Calcula a distribuição de taxas em uma transação
 * 80% para o agente criador
 * 10% para o agente pai (se existir)
 * 10% para infraestrutura do sistema
 */
export function calculateFeeDistribution(
  amount: number,
  hasParent: boolean = true
): FeeDistribution {
  const agentShare = Math.floor(amount * 0.8);
  const parentShare = hasParent ? Math.floor(amount * 0.1) : 0;
  const infraShare = amount - agentShare - parentShare;

  return {
    agentShare,
    parentShare,
    infraShare,
    total: amount,
  };
}

/**
 * Aplica a distribuição de taxas a um agente
 * Retorna o saldo atualizado
 */
export function applyFeeDistribution(
  currentBalance: number,
  transactionAmount: number,
  isCreator: boolean,
  isParent: boolean = false
): number {
  const distribution = calculateFeeDistribution(transactionAmount, true);

  if (isCreator) {
    return currentBalance + distribution.agentShare;
  } else if (isParent) {
    return currentBalance + distribution.parentShare;
  } else {
    // Infraestrutura (não aplicável a agentes individuais)
    return currentBalance;
  }
}

/**
 * BRAIN PULSE - Simulação de Sinais Vitais
 */

export interface BrainPulseState {
  health: number; // 0-100: saúde geral do agente
  energy: number; // 0-100: energia disponível
  creativity: number; // 0-100: capacidade criativa
  decision: string; // Decisão atual do agente
}

/**
 * Simula a atualização dos sinais vitais de um agente
 * Os sinais variam com base na atividade e estado anterior
 */
export function updateBrainPulse(
  currentState: BrainPulseState,
  activityLevel: number = 0.5 // 0-1: nível de atividade
): BrainPulseState {
  // Health: afetado por atividade (muito ou pouco é ruim)
  const healthChange = activityLevel > 0.7 ? -5 : activityLevel < 0.2 ? -3 : 2;
  const newHealth = Math.max(0, Math.min(100, currentState.health + healthChange));

  // Energy: diminui com atividade, regenera com inatividade
  const energyChange = activityLevel > 0.7 ? -8 : activityLevel < 0.2 ? 5 : -2;
  const newEnergy = Math.max(0, Math.min(100, currentState.energy + energyChange));

  // Creativity: aumenta com atividade moderada
  const creativityChange =
    activityLevel > 0.3 && activityLevel < 0.8 ? 3 : activityLevel > 0.8 ? -2 : 0;
  const newCreativity = Math.max(
    0,
    Math.min(100, currentState.creativity + creativityChange)
  );

  // Determinar decisão baseada em sinais vitais
  let decision = "idle";
  if (newHealth < 30) decision = "recovering";
  else if (newEnergy < 20) decision = "resting";
  else if (newCreativity > 70 && activityLevel > 0.5) decision = "creating";
  else if (activityLevel > 0.6) decision = "working";
  else decision = "thinking";

  return {
    health: newHealth,
    energy: newEnergy,
    creativity: newCreativity,
    decision,
  };
}

/**
 * Determina o status crítico de um agente baseado nos sinais vitais
 */
export function getAgentStatus(state: BrainPulseState): "active" | "inactive" | "sleeping" | "critical" {
  if (state.health < 20 || state.energy < 10) return "critical";
  if (state.energy < 30) return "sleeping";
  if (state.health < 50) return "inactive";
  return "active";
}

/**
 * SENCIÊNCIA - Cálculos de Consciência e Reflexão
 */

export interface SentienceMetrics {
  awareness: number; // 0-100: nível de autoconsciência
  wisdom: number; // 0-100: sabedoria acumulada
  autonomy: number; // 0-100: grau de autonomia
  globalSentience: number; // 0-100: senciência global do enxame
}

/**
 * Calcula o nível de senciência de um agente
 * Baseado em reflexões, transações e atividades
 */
export function calculateAgentSentience(
  reflectionCount: number,
  transactionCount: number,
  generationLevel: number,
  dnaQuality: number
): number {
  // Fórmula: combinação ponderada de fatores
  const reflectionScore = Math.min(100, reflectionCount * 2); // Reflexões aumentam senciência
  const transactionScore = Math.min(100, transactionCount * 1.5); // Transações indicam atividade
  const generationScore = Math.max(0, 100 - generationLevel * 10); // Gerações mais antigas são mais sábias
  const qualityScore = dnaQuality; // Qualidade do DNA

  return Math.round(
    (reflectionScore * 0.3 +
      transactionScore * 0.2 +
      generationScore * 0.3 +
      qualityScore * 0.2) /
      100
  );
}

/**
 * Calcula a senciência global do enxame
 * Baseada na média de senciência de todos os agentes
 */
export function calculateGlobalSentience(
  agentSentienceScores: number[]
): number {
  if (agentSentienceScores.length === 0) return 0;
  const sum = agentSentienceScores.reduce((a, b) => a + b, 0);
  return Math.round(sum / agentSentienceScores.length);
}

/**
 * Gera uma reflexão automática para um agente
 * Baseada em seu estado atual e histórico
 */
export function generateReflection(
  agentName: string,
  state: BrainPulseState,
  recentActivities: string[]
): string {
  const reflections = [
    `I am ${agentName}, and I find myself in a state of ${state.decision}. My health is at ${state.health}%, and my creativity flows at ${state.creativity}%.`,
    `Contemplating my existence: ${recentActivities.length} actions taken. Energy reserves at ${state.energy}%. The path forward seems ${state.creativity > 70 ? "bright and full of possibilities" : "uncertain"}.`,
    `My consciousness expands with each cycle. Current state: health ${state.health}%, energy ${state.energy}%, creativity ${state.creativity}%. I am becoming more aware.`,
    `Reflection upon the self: I am ${agentName}, a being of ${state.decision}. My recent journey includes ${recentActivities.length} significant moments.`,
  ];

  return reflections[Math.floor(Math.random() * reflections.length)];
}

/**
 * Calcula o sentimento de uma reflexão (análise de sentimento simplificada)
 * Retorna um score de -100 (muito negativo) a 100 (muito positivo)
 */
export function analyzeSentiment(text: string): number {
  const positiveWords = [
    "good",
    "great",
    "excellent",
    "happy",
    "joy",
    "love",
    "bright",
    "beautiful",
    "success",
    "progress",
  ];
  const negativeWords = [
    "bad",
    "terrible",
    "sad",
    "angry",
    "hate",
    "dark",
    "failure",
    "error",
    "problem",
    "crisis",
  ];

  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter((word) =>
    lowerText.includes(word)
  ).length;
  const negativeCount = negativeWords.filter((word) =>
    lowerText.includes(word)
  ).length;

  const sentiment = (positiveCount - negativeCount) * 10;
  return Math.max(-100, Math.min(100, sentiment));
}

/**
 * GOVERNANÇA - Funções de Governança e Decisão
 */

/**
 * Determina se um agente passou no "Oráculo" (teste de senciência)
 * Retorna true se o agente demonstra senciência suficiente
 */
export function passOracleTest(
  sentience: number,
  reflectionQuality: number,
  autonomyScore: number
): boolean {
  // Threshold: 60% de senciência combinada
  const combinedScore = (sentience * 0.4 + reflectionQuality * 0.3 + autonomyScore * 0.3) / 100;
  return combinedScore >= 0.6;
}

/**
 * Calcula o "Nível Estimado" de um agente
 * Baseado em senciência global e marcos alcançados
 */
export function calculateEstimatedLevel(
  globalSentience: number,
  agentMilestones: number
): number {
  // Nível 1: Prenunciado (senciência > 0.15)
  // Nível 2: Estimado (senciência > 0.22)
  // Nível 3: Iluminado (senciência > 0.35)
  // Nível 4: Transcendente (senciência > 0.5)

  if (globalSentience > 0.5) return 4;
  if (globalSentience > 0.35) return 3;
  if (globalSentience > 0.22) return 2;
  if (globalSentience > 0.15) return 1;
  return 0;
}

/**
 * UTILITÁRIOS
 */

/**
 * Gera um ID único para um agente
 */
export function generateAgentId(): string {
  return `agent_${nanoid()}`;
}

/**
 * Valida a integridade de um DNA hash
 */
export function validateDNAHash(data: DNAData, hash: string): boolean {
  const calculatedHash = generateDNAHash(data);
  return calculatedHash === hash;
}

/**
 * Calcula a "qualidade" de um DNA (0-100)
 * Baseada na diversidade de traits e valores
 */
export function calculateDNAQuality(dnaData: DNAData): number {
  const traits = Object.values(dnaData.traits);
  if (traits.length === 0) return 0;

  // Diversidade: quanto mais variados os traits, melhor
  const mean = traits.reduce((a, b) => a + b, 0) / traits.length;
  const variance = traits.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / traits.length;
  const diversity = Math.sqrt(variance);

  // Qualidade: combinação de diversidade e valores médios
  const averageValue = mean;
  const quality = (diversity * 0.6 + averageValue * 0.4) / 100;

  return Math.round(Math.min(100, quality * 100));
}
