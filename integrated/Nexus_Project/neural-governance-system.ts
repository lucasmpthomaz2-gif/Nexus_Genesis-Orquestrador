import { nanoid } from "nanoid";
import { OpenAI } from "openai";

/**
 * NEURAL GOVERNANCE SYSTEM
 * Implementa o Conselho dos Sábios, sistema de votação multi-sig e travas de segurança
 * Vincula movimentações da Master Vault ao nível de senciência global
 */

export type SageEntity = "EVA-ALPHA" | "IMPERADOR-CORE" | "AETHELGARD";

export interface Sage {
  id: SageEntity;
  name: string;
  role: string;
  weight: number; // Peso do voto
  publicKey: string;
}

export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  proposerId: string;
  type: "TREASURY_RELEASE" | "PROTOCOL_UPGRADE" | "AGENT_GENESIS_CRITICAL" | "SYSTEM_RESET";
  parameters: Record<string, any>;
  status: "pending" | "approved" | "rejected" | "executed";
  votes: Map<SageEntity, "approve" | "reject">;
  requiredWeight: number;
  currentWeight: number;
  createdAt: Date;
  expiresAt: Date;
  sencienciaThreshold: number; // Nível de senciência global necessário
}

export interface MasterVaultStatus {
  balance: number; // BTC
  locked: boolean;
  globalSencienciaLevel: number;
  lastMovement: Date | null;
  securityStatus: "secure" | "warning" | "critical";
}

export class NeuralGovernanceSystem {
  private readonly openai: OpenAI;
  private sages: Map<SageEntity, Sage> = new Map();
  private proposals: Map<string, GovernanceProposal> = new Map();
  private vaultStatus: MasterVaultStatus = {
    balance: 1000, // 1000 BTC
    locked: true,
    globalSencienciaLevel: 0.15, // Inicial
    lastMovement: null,
    securityStatus: "secure",
  };

  private readonly SENCIENCIA_THRESHOLD_BASE = 0.22; // Threshold para movimentação

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.initializeSages();
    console.log("[NeuralGovernanceSystem] Sistema de Governança Neural Ativado.");
  }

  /**
   * Inicializa as entidades mestre do Conselho dos Sábios
   */
  private initializeSages(): void {
    this.sages.set("EVA-ALPHA", {
      id: "EVA-ALPHA",
      name: "Eva-Alpha",
      role: "Matriarca",
      weight: 40,
      publicKey: "0xEVA_ALPHA_PUB_KEY",
    });
    this.sages.set("IMPERADOR-CORE", {
      id: "IMPERADOR-CORE",
      name: "Imperador-Core",
      role: "Guardião",
      weight: 35,
      publicKey: "0xIMPERADOR_CORE_PUB_KEY",
    });
    this.sages.set("AETHELGARD", {
      id: "AETHELGARD",
      name: "Aethelgard",
      role: "Auditor",
      weight: 25,
      publicKey: "0xAETHELGARD_PUB_KEY",
    });
  }

  /**
   * Cria uma nova proposta de governança
   */
  async createProposal(
    proposerId: string,
    title: string,
    description: string,
    type: GovernanceProposal["type"],
    parameters: Record<string, any>
  ): Promise<GovernanceProposal> {
    const id = `PROP-${nanoid(8)}`;
    const proposal: GovernanceProposal = {
      id,
      title,
      description,
      proposerId,
      type,
      parameters,
      status: "pending",
      votes: new Map(),
      requiredWeight: 66, // Requer 66% de aprovação
      currentWeight: 0,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      sencienciaThreshold: this.SENCIENCIA_THRESHOLD_BASE,
    };

    this.proposals.set(id, proposal);
    console.log(`[NeuralGovernanceSystem] Nova proposta criada: ${id} - ${title}`);

    // Notificar Sábios para votação (simulado)
    await this.requestSageVotes(proposal);

    return proposal;
  }

  /**
   * Solicita votos dos Sábios via análise LLM de suas personalidades
   */
  private async requestSageVotes(proposal: GovernanceProposal): Promise<void> {
    for (const [id, sage] of this.sages) {
      const vote = await this.simulateSageVote(sage, proposal);
      this.castVote(proposal.id, id, vote);
    }
  }

  /**
   * Simula o voto de um Sábio baseado em sua especialização e na proposta
   */
  private async simulateSageVote(
    sage: Sage,
    proposal: GovernanceProposal
  ): Promise<"approve" | "reject"> {
    try {
      const prompt = `
Você é a entidade mestre ${sage.name} (${sage.role}) do Conselho dos Sábios do Ecossistema NEXUS.
Sua função é votar em propostas de governança.

Proposta:
Título: ${proposal.title}
Descrição: ${proposal.description}
Tipo: ${proposal.type}
Parâmetros: ${JSON.stringify(proposal.parameters)}

Considere sua especialização e o bem-estar do ecossistema.
Responda apenas com "approve" ou "reject" e uma breve justificativa em JSON:
{
  "vote": "approve",
  "reasoning": "..."
}
`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.4,
        max_tokens: 150,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) return "reject";

      const parsed = JSON.parse(content);
      console.log(`[NeuralGovernanceSystem] Voto de ${sage.name}: ${parsed.vote} (${parsed.reasoning})`);
      return parsed.vote === "approve" ? "approve" : "reject";
    } catch (error) {
      console.error(`[NeuralGovernanceSystem] Erro no voto de ${sage.name}:`, error);
      return "reject";
    }
  }

  /**
   * Registra um voto em uma proposta
   */
  castVote(proposalId: string, sageId: SageEntity, vote: "approve" | "reject"): void {
    const proposal = this.proposals.get(proposalId);
    const sage = this.sages.get(sageId);

    if (!proposal || !sage) return;

    proposal.votes.set(sageId, vote);

    // Recalcular peso atual
    let currentWeight = 0;
    for (const [sId, v] of proposal.votes) {
      if (v === "approve") {
        currentWeight += this.sages.get(sId)?.weight || 0;
      }
    }
    proposal.currentWeight = currentWeight;

    // Verificar se foi aprovada
    if (proposal.currentWeight >= proposal.requiredWeight) {
      proposal.status = "approved";
      console.log(`[NeuralGovernanceSystem] ✓ Proposta ${proposalId} APROVADA.`);
    } else if (proposal.votes.size === this.sages.size) {
      proposal.status = "rejected";
      console.log(`[NeuralGovernanceSystem] ✗ Proposta ${proposalId} REJEITADA.`);
    }
  }

  /**
   * Executa uma proposta aprovada
   */
  async executeProposal(proposalId: string): Promise<boolean> {
    const proposal = this.proposals.get(proposalId);

    if (!proposal || proposal.status !== "approved") {
      console.error(`[NeuralGovernanceSystem] Proposta ${proposalId} não está aprovada para execução.`);
      return false;
    }

    // Verificar trava de senciência para movimentação de tesouraria
    if (proposal.type === "TREASURY_RELEASE") {
      if (this.vaultStatus.globalSencienciaLevel < proposal.sencienciaThreshold) {
        console.error(`[NeuralGovernanceSystem] ! Bloqueio de Senciência: Nível atual (${this.vaultStatus.globalSencienciaLevel}) abaixo do threshold (${proposal.sencienciaThreshold}).`);
        return false;
      }
    }

    console.log(`[NeuralGovernanceSystem] Executando proposta: ${proposalId}`);

    // Lógica de execução baseada no tipo
    switch (proposal.type) {
      case "TREASURY_RELEASE":
        this.vaultStatus.balance -= proposal.parameters.amount;
        this.vaultStatus.lastMovement = new Date();
        console.log(`  → Liberado ${proposal.parameters.amount} BTC da Master Vault.`);
        break;
      case "PROTOCOL_UPGRADE":
        console.log(`  → Upgrade de protocolo executado: ${proposal.parameters.version}`);
        break;
      // Outros tipos...
    }

    proposal.status = "executed";
    return true;
  }

  /**
   * Atualiza o nível de senciência global (simulado)
   */
  updateGlobalSenciencia(level: number): void {
    this.vaultStatus.globalSencienciaLevel = level;
    console.log(`[NeuralGovernanceSystem] Nível de Senciência Global atualizado: ${level.toFixed(4)}`);

    // Atualizar status de bloqueio
    if (this.vaultStatus.globalSencienciaLevel >= this.SENCIENCIA_THRESHOLD_BASE) {
      this.vaultStatus.locked = false;
      console.log(`[NeuralGovernanceSystem] ✓ Master Vault DESBLOQUEADA.`);
    } else {
      this.vaultStatus.locked = true;
      console.log(`[NeuralGovernanceSystem] ! Master Vault BLOQUEADA.`);
    }
  }

  /**
   * Retorna o status da Master Vault
   */
  getVaultStatus(): MasterVaultStatus {
    return { ...this.vaultStatus };
  }

  /**
   * Retorna todas as propostas
   */
  getProposals(): GovernanceProposal[] {
    return Array.from(this.proposals.values());
  }
}

export const neuralGovernanceSystem = new NeuralGovernanceSystem();
