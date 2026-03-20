import { Agent, InsertAgentLifecycleHistory } from "../drizzle/schema";
import { nanoid } from "nanoid";

/**
 * AGENT LIFECYCLE MANAGER
 * Gerencia os estados de ciclo de vida dos agentes:
 * genesis → active → hibernating/critical → dead → resurrectable
 */

export type AgentStatus =
  | "genesis"
  | "active"
  | "hibernating"
  | "critical"
  | "dead"
  | "resurrectable";

export interface LifecycleTransition {
  fromStatus: AgentStatus;
  toStatus: AgentStatus;
  reason: string;
  timestamp: Date;
}

export class AgentLifecycleManager {
  /**
   * Ativa um agente em estado genesis para ativo
   */
  activateAgent(agent: Agent): Agent {
    if (agent.status !== "genesis") {
      throw new Error(
        `Agente ${agent.agentId} não está em estado genesis para ativação`
      );
    }

    console.log(`[LifecycleManager] ✓ Agente ${agent.name} ativado!`);

    return {
      ...agent,
      status: "active",
      health: 100,
      energy: 100,
      updatedAt: new Date(),
    };
  }

  /**
   * Coloca agente em hibernação quando energia está baixa
   */
  hibernateAgent(agent: Agent, reason: string = "Energia crítica"): Agent {
    if (agent.status === "dead" || agent.status === "genesis") {
      throw new Error(
        `Agente ${agent.agentId} não pode hibernar do estado ${agent.status}`
      );
    }

    console.log(
      `[LifecycleManager] ⏸ Agente ${agent.name} entrou em hibernação: ${reason}`
    );

    return {
      ...agent,
      status: "hibernating",
      energy: Math.max(agent.energy - 30, 0),
      updatedAt: new Date(),
    };
  }

  /**
   * Coloca agente em estado crítico quando saúde < 30%
   */
  setCritical(agent: Agent, reason: string = "Saúde crítica"): Agent {
    if (agent.status === "dead" || agent.status === "genesis") {
      throw new Error(
        `Agente ${agent.agentId} não pode entrar em estado crítico do estado ${agent.status}`
      );
    }

    console.log(
      `[LifecycleManager] 🚨 Agente ${agent.name} em estado CRÍTICO: ${reason}`
    );

    return {
      ...agent,
      status: "critical",
      updatedAt: new Date(),
    };
  }

  /**
   * Mata um agente quando saúde chega a 0 ou timeout ocorre
   */
  killAgent(agent: Agent, reason: string = "Morte por timeout"): Agent {
    console.log(`[LifecycleManager] ☠ Agente ${agent.name} morreu: ${reason}`);

    return {
      ...agent,
      status: "dead",
      health: 0,
      energy: 0,
      updatedAt: new Date(),
    };
  }

  /**
   * Ressuscita um agente morto com novo capital
   */
  resurrectAgent(agent: Agent, newBalance: number): Agent {
    if (agent.status !== "dead" && agent.status !== "resurrectable") {
      throw new Error(
        `Agente ${agent.agentId} não está em estado ressuscitável`
      );
    }

    console.log(
      `[LifecycleManager] ♻ Agente ${agent.name} ressuscitado com saldo: ${newBalance}`
    );

    return {
      ...agent,
      status: "active",
      health: 50,
      energy: 50,
      balance: newBalance as any,
      generation: (agent.generation || 0) + 1,
      updatedAt: new Date(),
    };
  }

  /**
   * Recupera agente da hibernação
   */
  wakeupAgent(agent: Agent): Agent {
    if (agent.status !== "hibernating") {
      throw new Error(
        `Agente ${agent.agentId} não está em hibernação para despertar`
      );
    }

    console.log(`[LifecycleManager] 🌅 Agente ${agent.name} despertou!`);

    return {
      ...agent,
      status: "active",
      energy: Math.min(agent.energy + 50, 100),
      updatedAt: new Date(),
    };
  }

  /**
   * Monitora saúde e energia, transiciona estado automaticamente
   */
  monitorHealth(agent: Agent): Agent {
    let updatedAgent = { ...agent };

    // Verificar se está morto
    if (agent.health <= 0) {
      return this.killAgent(updatedAgent, "Saúde zerada");
    }

    // Verificar se está crítico (saúde < 30%)
    if (agent.health < 30 && agent.status !== "critical") {
      updatedAgent = this.setCritical(updatedAgent, "Saúde abaixo de 30%");
    }

    // Verificar se deve hibernar (energia < 20%)
    if (
      agent.energy < 20 &&
      agent.status === "active"
    ) {
      updatedAgent = this.hibernateAgent(updatedAgent, "Energia crítica");
    }

    // Recuperar de crítico se saúde melhorou
    if (agent.health > 50 && agent.status === "critical") {
      updatedAgent = {
        ...updatedAgent,
        status: "active",
        updatedAt: new Date(),
      };
      console.log(`[LifecycleManager] ✓ Agente ${agent.name} recuperado de estado crítico`);
    }

    return updatedAgent;
  }

  /**
   * Consome recursos do agente (energia e saúde)
   * Simula custo de existência
   */
  consumeResources(agent: Agent, energyCost: number = 1, healthCost: number = 0.5): Agent {
    const newEnergy = Math.max(agent.energy - energyCost, 0);
    const newHealth = Math.max(agent.health - healthCost, 0);

    return {
      ...agent,
      energy: newEnergy,
      health: newHealth,
      updatedAt: new Date(),
    };
  }

  /**
   * Recupera recursos do agente
   */
  recoverResources(agent: Agent, energyRecover: number = 5, healthRecover: number = 2): Agent {
    const newEnergy = Math.min(agent.energy + energyRecover, 100);
    const newHealth = Math.min(agent.health + healthRecover, 100);

    return {
      ...agent,
      energy: newEnergy,
      health: newHealth,
      updatedAt: new Date(),
    };
  }

  /**
   * Cria registro de transição de ciclo de vida
   */
  createTransitionRecord(
    agent: Agent,
    fromStatus: AgentStatus,
    toStatus: AgentStatus,
    reason: string
  ): InsertAgentLifecycleHistory {
    return {
      agentId: agent.agentId,
      fromStatus,
      toStatus,
      reason,
      createdAt: new Date(),
    };
  }

  /**
   * Calcula tempo de vida do agente em horas
   */
  calculateLifetimeHours(agent: Agent): number {
    const now = new Date();
    const createdAt = new Date(agent.createdAt);
    const diffMs = now.getTime() - createdAt.getTime();
    return diffMs / (1000 * 60 * 60);
  }

  /**
   * Verifica se agente deve morrer por timeout (24 horas sem atividade)
   */
  shouldDieByTimeout(agent: Agent, timeoutHours: number = 24): boolean {
    if (!agent.lastActivityAt) return false;

    const now = new Date();
    const lastActivity = new Date(agent.lastActivityAt);
    const diffHours = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

    return diffHours > timeoutHours;
  }

  /**
   * Retorna descrição legível do estado
   */
  getStatusDescription(status: AgentStatus): string {
    const descriptions: Record<AgentStatus, string> = {
      genesis: "Nascimento - Agente em processo de inicialização",
      active: "Ativo - Agente operando normalmente",
      hibernating: "Hibernação - Agente em repouso por falta de energia",
      critical: "Crítico - Agente em estado crítico de saúde",
      dead: "Morto - Agente falecido",
      resurrectable: "Ressuscitável - Agente pode ser reativado",
    };
    return descriptions[status];
  }
}

export const agentLifecycleManager = new AgentLifecycleManager();
