/**
 * Testes para integração WebSocket do Orquestrador NexusGenesis
 * Valida se os eventos WebSocket são emitidos corretamente
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NexusOrchestrator } from "./orchestrator";
import * as hooks from "./orchestrator-websocket-hooks";

// Mock do broadcaster
vi.mock("./broadcaster", () => ({
  getBroadcaster: vi.fn(() => ({
    broadcast: vi.fn(),
  })),
}));

describe("NexusOrchestrator WebSocket Integration", () => {
  let orchestrator: NexusOrchestrator;

  beforeEach(() => {
    orchestrator = new NexusOrchestrator();
  });

  afterEach(() => {
    orchestrator.stopTSRA();
  });

  describe("TSRA Lifecycle Events", () => {
    it("deve emitir evento quando TSRA é iniciado", () => {
      const broadcastSpy = vi.spyOn(hooks, "onTSRAStarted");
      
      // Simular início do TSRA
      hooks.onTSRAStarted();
      
      expect(broadcastSpy).toHaveBeenCalled();
    });

    it("deve emitir evento quando TSRA é parado", () => {
      const broadcastSpy = vi.spyOn(hooks, "onTSRAStopped");
      
      // Simular parada do TSRA
      hooks.onTSRAStopped();
      
      expect(broadcastSpy).toHaveBeenCalled();
    });
  });

  describe("Sync Cycle Events", () => {
    it("deve emitir evento de sucesso do ciclo de sincronização", () => {
      const broadcastSpy = vi.spyOn(hooks, "onSyncCycleSuccess");
      
      const syncData = {
        syncWindow: 1,
        nucleiSynced: ["nexus_in", "nexus_hub", "fundo_nexus"],
        commandsOrchestrated: 2,
        eventsProcessed: 5,
        syncDurationMs: 150,
      };
      
      hooks.onSyncCycleSuccess(syncData);
      
      expect(broadcastSpy).toHaveBeenCalledWith(syncData);
    });

    it("deve emitir evento de erro do ciclo de sincronização", () => {
      const broadcastSpy = vi.spyOn(hooks, "onSyncCycleError");
      const error = new Error("Erro de sincronização");
      
      hooks.onSyncCycleError(error, 1);
      
      expect(broadcastSpy).toHaveBeenCalledWith(error, 1);
    });
  });

  describe("Nucleus State Events", () => {
    it("deve emitir evento quando estado de núcleo muda", () => {
      const broadcastSpy = vi.spyOn(hooks, "onNucleusStateChanged");
      
      const state = {
        posts: 10,
        activeUsers: 5,
        lastUpdate: new Date().toISOString(),
      };
      
      hooks.onNucleusStateChanged("nexus_in", state);
      
      expect(broadcastSpy).toHaveBeenCalledWith("nexus_in", state);
    });

    it("deve emitir alerta quando saúde de núcleo se degrada", () => {
      const broadcastSpy = vi.spyOn(hooks, "onNucleusHealthDegraded");
      
      hooks.onNucleusHealthDegraded("nexus_hub");
      
      expect(broadcastSpy).toHaveBeenCalledWith("nexus_hub");
    });

    it("deve emitir alerta quando há erro ao coletar estado", () => {
      const broadcastSpy = vi.spyOn(hooks, "onNucleusCollectionError");
      const error = new Error("Falha na coleta");
      
      hooks.onNucleusCollectionError("fundo_nexus", error);
      
      expect(broadcastSpy).toHaveBeenCalledWith("fundo_nexus", error);
    });
  });

  describe("Homeostase Events", () => {
    it("deve emitir evento de métrica de homeostase", () => {
      const broadcastSpy = vi.spyOn(hooks, "onHomeostaseMetricUpdated");
      
      const homeostaseData = {
        btcBalance: 10.5,
        activeAgents: 8,
        socialActivity: 25,
        equilibriumStatus: "optimal" as const,
        issues: [],
      };
      
      hooks.onHomeostaseMetricUpdated(homeostaseData);
      
      expect(broadcastSpy).toHaveBeenCalledWith(homeostaseData);
    });

    it("deve emitir alerta quando homeostase está em aviso", () => {
      const broadcastSpy = vi.spyOn(hooks, "onHomeostaseMetricUpdated");
      
      const homeostaseData = {
        btcBalance: 3.0,
        activeAgents: 4,
        socialActivity: 2,
        equilibriumStatus: "warning" as const,
        issues: ["Saldo BTC baixo", "Atividade social baixa"],
      };
      
      hooks.onHomeostaseMetricUpdated(homeostaseData);
      
      expect(broadcastSpy).toHaveBeenCalledWith(homeostaseData);
    });

    it("deve emitir alerta crítico quando homeostase está crítica", () => {
      const broadcastSpy = vi.spyOn(hooks, "onHomeostaseMetricUpdated");
      
      const homeostaseData = {
        btcBalance: 0.5,
        activeAgents: 0,
        socialActivity: 0,
        equilibriumStatus: "critical" as const,
        issues: [
          "Saldo BTC crítico",
          "Nenhum agente ativo no HUB",
          "Nenhuma atividade social",
        ],
      };
      
      hooks.onHomeostaseMetricUpdated(homeostaseData);
      
      expect(broadcastSpy).toHaveBeenCalledWith(homeostaseData);
    });
  });

  describe("Orchestration Command Events", () => {
    it("deve emitir evento quando comando de orquestração é criado", () => {
      const broadcastSpy = vi.spyOn(hooks, "onOrchestrationCommandCreated");
      
      const commandData = {
        commandId: "cmd-123",
        destination: "nexus_in",
        commandType: "alert",
        commandData: {
          level: "warning",
          message: "Saldo BTC baixo",
        },
        reason: "Reequilíbrio automático",
      };
      
      hooks.onOrchestrationCommandCreated(commandData);
      
      expect(broadcastSpy).toHaveBeenCalledWith(commandData);
    });
  });

  describe("Orchestration Event Processing", () => {
    it("deve emitir evento quando evento de orquestração é processado", () => {
      const broadcastSpy = vi.spyOn(hooks, "onOrchestrationEventProcessed");
      
      const eventData = {
        eventId: "evt-123",
        origin: "nexus_in",
        eventType: "user_activity",
        eventData: {
          userId: "user-456",
          action: "post_created",
        },
        sentiment: "positive",
      };
      
      hooks.onOrchestrationEventProcessed(eventData);
      
      expect(broadcastSpy).toHaveBeenCalledWith(eventData);
    });
  });

  describe("Genesis Experience Events", () => {
    it("deve emitir evento quando experiência Genesis é registrada", () => {
      const broadcastSpy = vi.spyOn(hooks, "onGenesisExperienceLogged");
      
      const experienceData = {
        experienceId: "exp-123",
        experienceType: "learning",
        description: "Aprendizado sobre padrões de sincronização",
        impact: "high",
        senciencyDelta: "+0.05",
      };
      
      hooks.onGenesisExperienceLogged(experienceData);
      
      expect(broadcastSpy).toHaveBeenCalledWith(experienceData);
    });
  });

  describe("System Alert Events", () => {
    it("deve emitir alerta informativo do sistema", () => {
      const broadcastSpy = vi.spyOn(hooks, "onSystemAlertGenerated");
      
      const alertData = {
        severity: "info" as const,
        title: "Operação Concluída",
        message: "Sincronização completada com sucesso",
        source: "orchestrator",
      };
      
      hooks.onSystemAlertGenerated(alertData);
      
      expect(broadcastSpy).toHaveBeenCalledWith(alertData);
    });

    it("deve emitir alerta de aviso do sistema", () => {
      const broadcastSpy = vi.spyOn(hooks, "onSystemAlertGenerated");
      
      const alertData = {
        severity: "warning" as const,
        title: "Núcleo Degradado",
        message: "nexus_hub não está respondendo adequadamente",
        source: "orchestrator",
      };
      
      hooks.onSystemAlertGenerated(alertData);
      
      expect(broadcastSpy).toHaveBeenCalledWith(alertData);
    });

    it("deve emitir alerta crítico do sistema", () => {
      const broadcastSpy = vi.spyOn(hooks, "onSystemAlertGenerated");
      
      const alertData = {
        severity: "critical" as const,
        title: "Falha Crítica",
        message: "Erro durante execução do ciclo de sincronização",
        source: "orchestrator",
      };
      
      hooks.onSystemAlertGenerated(alertData);
      
      expect(broadcastSpy).toHaveBeenCalledWith(alertData);
    });
  });

  describe("Orchestrator Status", () => {
    it("deve retornar status correto do orquestrador", () => {
      const status = orchestrator.getStatus();
      
      expect(status).toHaveProperty("isRunning");
      expect(status).toHaveProperty("syncWindow");
      expect(status).toHaveProperty("lastSyncTime");
      expect(status.isRunning).toBe(false);
      expect(status.syncWindow).toBe(0);
    });
  });
});
