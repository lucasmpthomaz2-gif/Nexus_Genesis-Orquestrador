/**
 * Nexus Orchestrator - Orquestração Tri-Nuclear com Integração WebSocket
 * Gerencia sincronização entre Nexus Genesis, Nexus-in, Nexus-HUB e Fundo Nexus
 * Transmite eventos em tempo real via WebSocket para clientes conectados
 */

import { nanoid } from "nanoid";
import { getDb } from "./db";
import {
  InsertOrchestrationCommand,
  InsertOrchestrationEvent,
  InsertHomeostaseMetric,
  InsertTsraSyncLog,
} from "../drizzle/schema";
import {
  getAllFirebaseInstances,
  checkInstanceHealth,
  readData,
} from "./firebase";
import * as hooks from "./orchestrator-websocket-hooks";

interface NucleusState {
  nexus_in?: {
    posts: number;
    activeUsers: number;
    lastUpdate: string;
  };
  nexus_hub?: {
    agents: number;
    proposals: number;
    lastUpdate: string;
  };
  fundo_nexus?: {
    btcBalance: number;
    transactions: number;
    lastUpdate: string;
  };
}

interface HomeostaseStatus {
  btcBalance: number;
  activeAgents: number;
  socialActivity: number;
  equilibriumStatus: "critical" | "warning" | "optimal";
  issues: string[];
}

// Cache para rastrear estados anteriores e detectar mudanças
interface StateCache {
  nucleusStates: NucleusState;
  homeostaseStatus: HomeostaseStatus | null;
}

export class NexusOrchestrator {
  private syncWindow: number = 0;
  private isRunning: boolean = false;
  private lastSyncTime: number = 0;
  private stateCache: StateCache = {
    nucleusStates: {},
    homeostaseStatus: null,
  };

  /**
   * Inicia o protocolo TSRA (Timed Synchronization and Response Algorithm)
   * Executa sincronização a cada 1 segundo
   */
  public startTSRA(): void {
    if (this.isRunning) {
      console.log("⚠️ TSRA já está em execução");
      return;
    }

    this.isRunning = true;
    console.log("🔷 Iniciando protocolo TSRA...");

    // Emitir evento de início do TSRA via hook
    hooks.onTSRAStarted();

    // Executar sincronização a cada 1 segundo
    setInterval(() => {
      this.executeSyncCycle();
    }, 1000);
  }

  /**
   * Para o protocolo TSRA
   */
  public stopTSRA(): void {
    this.isRunning = false;
    console.log("⏹️ Protocolo TSRA parado");

    // Emitir evento de parada do TSRA via hook
    hooks.onTSRAStopped();
  }

  /**
   * Executa um ciclo de sincronização
   */
  private async executeSyncCycle(): Promise<void> {
    const startTime = Date.now();
    this.syncWindow++;

    try {
      // 1. Coletar estado de todos os núcleos
      const nucleusStates = await this.collectNucleusStates();

      // 2. Analisar homeostase
      const homeostaseStatus = await this.analyzeHomeostase(nucleusStates);

      // 3. Processar eventos pendentes
      const eventsProcessed = await this.processEvents();

      // 4. Gerar e executar comandos de reequilíbrio
      const commandsOrchestrated = await this.orchestrateCommands(
        homeostaseStatus
      );

      // 5. Registrar log de sincronização e emitir eventos de sucesso
      const syncDurationMs = Date.now() - startTime;
      const syncData = {
        syncWindow: this.syncWindow,
        nucleiSynced: Object.keys(nucleusStates),
        commandsOrchestrated,
        eventsProcessed,
        syncDurationMs,
        status: "success",
      };

      await this.logSyncCycle(syncData);
      hooks.onSyncCycleSuccess(syncData);

      this.lastSyncTime = Date.now();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error("❌ Erro durante ciclo TSRA:", err);

      // Registrar falha
      const syncDurationMs = Date.now() - startTime;
      await this.logSyncCycle({
        syncWindow: this.syncWindow,
        nucleiSynced: [],
        commandsOrchestrated: 0,
        eventsProcessed: 0,
        syncDurationMs,
        status: "failed",
      });

      // Emitir evento de erro crítico via hook
      hooks.onSyncCycleError(err, this.syncWindow);
    }
  }

  /**
   * Coleta estado de todos os núcleos
   * Emite eventos WebSocket quando há mudanças de estado
   */
  private async collectNucleusStates(): Promise<NucleusState> {
    const states: NucleusState = {};
    const instances = getAllFirebaseInstances();

    for (const [name, instance] of Array.from(instances.entries())) {
      try {
        const health = await checkInstanceHealth(name);
        if (!health.healthy) {
          console.warn(`⚠️ ${name} não está saudável`);

          // Emitir alerta de saúde do núcleo via hook
          hooks.onNucleusHealthDegraded(name);
          continue;
        }

        // Ler dados específicos de cada núcleo
        if (name === "nexus_in") {
          const data = await readData(name, "/feed");
          states.nexus_in = {
            posts: Array.isArray(data) ? data.length : 0,
            activeUsers: 0,
            lastUpdate: new Date().toISOString(),
          };

          // Verificar mudança de estado e emitir evento via hook
          if (
            this.stateCache.nucleusStates.nexus_in?.posts !==
            states.nexus_in.posts
          ) {
            hooks.onNucleusStateChanged("nexus_in", states.nexus_in);
          }
        } else if (name === "nexus_hub") {
          const data = await readData(name, "/agents");
          states.nexus_hub = {
            agents: Array.isArray(data) ? data.length : 0,
            proposals: 0,
            lastUpdate: new Date().toISOString(),
          };

          // Verificar mudança de estado e emitir evento via hook
          if (
            this.stateCache.nucleusStates.nexus_hub?.agents !==
            states.nexus_hub.agents
          ) {
            hooks.onNucleusStateChanged("nexus_hub", states.nexus_hub);
          }
        } else if (name === "fundo_nexus") {
          const data = await readData(name, "/balance");
          states.fundo_nexus = {
            btcBalance: data?.BTC || 0,
            transactions: 0,
            lastUpdate: new Date().toISOString(),
          };

          // Verificar mudança de estado e emitir evento via hook
          if (
            this.stateCache.nucleusStates.fundo_nexus?.btcBalance !==
            states.fundo_nexus.btcBalance
          ) {
            hooks.onNucleusStateChanged("fundo_nexus", states.fundo_nexus);
          }
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.warn(`⚠️ Erro ao coletar estado de ${name}:`, err);

        // Emitir alerta de erro na coleta via hook
        hooks.onNucleusCollectionError(name, err);
      }
    }

    // Atualizar cache
    this.stateCache.nucleusStates = states;

    return states;
  }

  /**
   * Analisa homeostase do ecossistema
   * Emite métricas de homeostase via WebSocket
   */
  private async analyzeHomeostase(
    nucleusStates: NucleusState
  ): Promise<HomeostaseStatus> {
    const issues: string[] = [];

    const btcBalance = nucleusStates.fundo_nexus?.btcBalance || 0;
    const activeAgents = nucleusStates.nexus_hub?.agents || 0;
    const socialActivity = nucleusStates.nexus_in?.posts || 0;

    // Verificar indicadores críticos
    if (btcBalance < 1.0) {
      issues.push("Saldo BTC crítico");
    } else if (btcBalance < 5.0) {
      issues.push("Saldo BTC baixo");
    }

    if (activeAgents === 0) {
      issues.push("Nenhum agente ativo no HUB");
    } else if (activeAgents < 5) {
      issues.push("Poucos agentes ativos");
    }

    if (socialActivity === 0) {
      issues.push("Nenhuma atividade social");
    } else if (socialActivity < 5) {
      issues.push("Atividade social baixa");
    }

    let equilibriumStatus: "critical" | "warning" | "optimal" = "optimal";
    if (issues.length > 2) {
      equilibriumStatus = "critical";
    } else if (issues.length > 0) {
      equilibriumStatus = "warning";
    }

    const homeostaseStatus: HomeostaseStatus = {
      btcBalance,
      activeAgents,
      socialActivity,
      equilibriumStatus,
      issues,
    };

    // Emitir evento de métrica de homeostase via hook
    hooks.onHomeostaseMetricUpdated(homeostaseStatus);

    // Atualizar cache
    this.stateCache.homeostaseStatus = homeostaseStatus;

    return homeostaseStatus;
  }

  /**
   * Processa eventos pendentes
   */
  private async processEvents(): Promise<number> {
    const db = await getDb();
    if (!db) return 0;

    // Implementar lógica de processamento de eventos
    // Por enquanto, retorna 0
    return 0;
  }

  /**
   * Orquestra comandos de reequilíbrio
   * Emite eventos de comando via WebSocket
   */
  private async orchestrateCommands(
    homeostaseStatus: HomeostaseStatus
  ): Promise<number> {
    const db = await getDb();
    if (!db) return 0;

    let commandsCreated = 0;

    // Gerar comandos baseado em problemas detectados
    if (homeostaseStatus.issues.length > 0) {
      for (const issue of homeostaseStatus.issues) {
        const commandId = nanoid();
        const command: InsertOrchestrationCommand = {
          id: commandId,
          destination: "nexus_in",
          commandType: "alert",
          commandData: JSON.stringify({
            level: homeostaseStatus.equilibriumStatus,
            message: issue,
          }),
          hmacSignature: "",
          status: "pending",
          reason: `Reequilíbrio automático: ${issue}`,
        };

        // Inserir comando no banco de dados
        try {
          await db
            .insert(require("../drizzle/schema").orchestrationCommands)
            .values(command);
          commandsCreated++;

          // Emitir evento de comando de orquestração via hook
          hooks.onOrchestrationCommandCreated({
            commandId,
            destination: "nexus_in",
            commandType: "alert",
            commandData: {
              level: homeostaseStatus.equilibriumStatus,
              message: issue,
            },
            reason: `Reequilíbrio automático: ${issue}`,
          });
        } catch (error) {
          console.error("Erro ao inserir comando:", error);
        }
      }
    }

    return commandsCreated;
  }

  /**
   * Registra ciclo de sincronização
   */
  private async logSyncCycle(data: {
    syncWindow: number;
    nucleiSynced: string[];
    commandsOrchestrated: number;
    eventsProcessed: number;
    syncDurationMs: number;
    status: string;
  }): Promise<void> {
    const db = await getDb();
    if (!db) return;

    const log: InsertTsraSyncLog = {
      id: nanoid(),
      syncWindow: data.syncWindow,
      nucleiSynced: JSON.stringify(data.nucleiSynced),
      commandsOrchestrated: data.commandsOrchestrated,
      eventsProcessed: data.eventsProcessed,
      syncDurationMs: data.syncDurationMs,
      status: data.status,
    };

    try {
      await db
        .insert(require("../drizzle/schema").tsraSyncLog)
        .values(log);
    } catch (error) {
      console.error("Erro ao registrar log de sincronização:", error);
    }
  }

  /**
   * Obtém status atual do orquestrador
   */
  public getStatus(): {
    isRunning: boolean;
    syncWindow: number;
    lastSyncTime: number;
  } {
    return {
      isRunning: this.isRunning,
      syncWindow: this.syncWindow,
      lastSyncTime: this.lastSyncTime,
    };
  }

  /**
   * Executa sincronização manual
   */
  public async executeManualSync(): Promise<{
    success: boolean;
    syncWindow: number;
    duration: number;
  }> {
    const startTime = Date.now();
    try {
      await this.executeSyncCycle();
      return {
        success: true,
        syncWindow: this.syncWindow,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      console.error("Erro na sincronização manual:", error);
      return {
        success: false,
        syncWindow: this.syncWindow,
        duration: Date.now() - startTime,
      };
    }
  }
}

// Instância global do orquestrador
export const orchestrator = new NexusOrchestrator();
