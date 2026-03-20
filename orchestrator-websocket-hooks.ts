/**
 * Hooks WebSocket para o Orquestrador NexusGenesis
 * Fornece funções reutilizáveis para emitir eventos WebSocket em diferentes fases do ciclo de sincronização
 */

import { getBroadcaster } from "./broadcaster";
import { WebSocketEvent } from "./events";

/**
 * Hook chamado quando o TSRA é iniciado
 */
export function onTSRAStarted(): void {
  try {
    const broadcaster = getBroadcaster();
    const event: WebSocketEvent = {
      type: "system:alert",
      payload: {
        severity: "info",
        title: "TSRA Iniciado",
        message: "Protocolo de sincronização tri-nuclear iniciado com sucesso",
        source: "orchestrator",
        timestamp: new Date(),
      },
      timestamp: new Date(),
    };
    broadcaster.broadcast(event);
  } catch (error) {
    console.warn("⚠️ Erro ao emitir evento de início do TSRA:", error);
  }
}

/**
 * Hook chamado quando o TSRA é parado
 */
export function onTSRAStopped(): void {
  try {
    const broadcaster = getBroadcaster();
    const event: WebSocketEvent = {
      type: "system:alert",
      payload: {
        severity: "info",
        title: "TSRA Parado",
        message: "Protocolo de sincronização tri-nuclear foi interrompido",
        source: "orchestrator",
        timestamp: new Date(),
      },
      timestamp: new Date(),
    };
    broadcaster.broadcast(event);
  } catch (error) {
    console.warn("⚠️ Erro ao emitir evento de parada do TSRA:", error);
  }
}

/**
 * Hook chamado quando um ciclo de sincronização é bem-sucedido
 */
export function onSyncCycleSuccess(data: {
  syncWindow: number;
  nucleiSynced: string[];
  commandsOrchestrated: number;
  eventsProcessed: number;
  syncDurationMs: number;
}): void {
  try {
    const broadcaster = getBroadcaster();
    const event: WebSocketEvent = {
      type: "tsra:sync",
      payload: {
        syncWindow: data.syncWindow,
        nucleusCount: data.nucleiSynced.length,
        eventsProcessed: data.eventsProcessed,
        commandsExecuted: data.commandsOrchestrated,
        syncDurationMs: data.syncDurationMs,
        timestamp: new Date(),
      },
      timestamp: new Date(),
    };
    broadcaster.broadcast(event);
  } catch (error) {
    console.warn("⚠️ Erro ao emitir evento de sucesso do ciclo TSRA:", error);
  }
}

/**
 * Hook chamado quando um ciclo de sincronização falha
 */
export function onSyncCycleError(error: Error, syncWindow: number): void {
  try {
    const broadcaster = getBroadcaster();
    const event: WebSocketEvent = {
      type: "system:alert",
      payload: {
        severity: "critical",
        title: "Erro no Ciclo TSRA",
        message: `Erro durante execução do ciclo de sincronização: ${error.message}`,
        source: "orchestrator",
        timestamp: new Date(),
      },
      timestamp: new Date(),
    };
    broadcaster.broadcast(event);
  } catch (broadcastError) {
    console.warn("⚠️ Erro ao emitir evento de erro do ciclo TSRA:", broadcastError);
  }
}

/**
 * Hook chamado quando o estado de um núcleo muda
 */
export function onNucleusStateChanged(
  nucleusName: string,
  state: Record<string, any>
): void {
  try {
    const broadcaster = getBroadcaster();
    const event: WebSocketEvent = {
      type: "nucleus:state-changed",
      payload: {
        nucleusName,
        status: "healthy",
        state,
        timestamp: new Date(),
      },
      timestamp: new Date(),
    };
    broadcaster.broadcast(event);
    console.log(
      `[WebSocket] Evento de mudança de estado emitido para ${nucleusName}`
    );
  } catch (error) {
    console.warn("⚠️ Erro ao emitir evento de mudança de estado:", error);
  }
}

/**
 * Hook chamado quando um núcleo está com saúde degradada
 */
export function onNucleusHealthDegraded(nucleusName: string): void {
  try {
    const broadcaster = getBroadcaster();
    const event: WebSocketEvent = {
      type: "system:alert",
      payload: {
        severity: "warning",
        title: `Núcleo ${nucleusName} Degradado`,
        message: `O núcleo ${nucleusName} não está respondendo adequadamente aos testes de saúde`,
        source: "orchestrator",
        timestamp: new Date(),
      },
      timestamp: new Date(),
    };
    broadcaster.broadcast(event);
  } catch (error) {
    console.warn("⚠️ Erro ao emitir alerta de saúde do núcleo:", error);
  }
}

/**
 * Hook chamado quando há erro ao coletar estado de um núcleo
 */
export function onNucleusCollectionError(
  nucleusName: string,
  error: Error
): void {
  try {
    const broadcaster = getBroadcaster();
    const event: WebSocketEvent = {
      type: "system:alert",
      payload: {
        severity: "warning",
        title: `Erro ao Coletar Estado de ${nucleusName}`,
        message: `Falha ao coletar dados do núcleo ${nucleusName}: ${error.message}`,
        source: "orchestrator",
        timestamp: new Date(),
      },
      timestamp: new Date(),
    };
    broadcaster.broadcast(event);
  } catch (broadcastError) {
    console.warn("⚠️ Erro ao emitir alerta de coleta:", broadcastError);
  }
}

/**
 * Hook chamado quando as métricas de homeostase são atualizadas
 */
export function onHomeostaseMetricUpdated(data: {
  btcBalance: number;
  activeAgents: number;
  socialActivity: number;
  equilibriumStatus: "critical" | "warning" | "optimal";
  issues: string[];
}): void {
  try {
    const broadcaster = getBroadcaster();
    const event: WebSocketEvent = {
      type: "homeostase:metric",
      payload: {
        nucleusName: "ecosystem",
        balance: data.btcBalance,
        threshold: 5.0,
        isAlarm: data.equilibriumStatus !== "optimal",
        timestamp: new Date(),
      },
      timestamp: new Date(),
    };
    broadcaster.broadcast(event);
    console.log("[WebSocket] Evento de métrica de homeostase emitido");
  } catch (error) {
    console.warn("⚠️ Erro ao emitir evento de homeostase:", error);
  }
}

/**
 * Hook chamado quando um comando de orquestração é criado
 */
export function onOrchestrationCommandCreated(data: {
  commandId: string;
  destination: string;
  commandType: string;
  commandData: Record<string, any>;
  reason: string;
}): void {
  try {
    const broadcaster = getBroadcaster();
    const event: WebSocketEvent = {
      type: "orchestration:command",
      payload: {
        id: data.commandId,
        destination: data.destination,
        command: data.commandType,
        parameters: data.commandData,
        reason: data.reason,
        executedAt: new Date(),
        createdAt: new Date(),
      },
      timestamp: new Date(),
    };
    broadcaster.broadcast(event);
    console.log(
      `[WebSocket] Evento de comando de orquestração emitido: ${data.commandId}`
    );
  } catch (error) {
    console.warn("⚠️ Erro ao emitir evento de comando:", error);
  }
}

/**
 * Hook chamado quando um evento de orquestração é processado
 */
export function onOrchestrationEventProcessed(data: {
  eventId: string;
  origin: string;
  eventType: string;
  eventData: Record<string, any>;
  sentiment: string;
}): void {
  try {
    const broadcaster = getBroadcaster();
    const event: WebSocketEvent = {
      type: "orchestration:event",
      payload: {
        id: data.eventId,
        origin: data.origin,
        eventType: data.eventType,
        eventData: data.eventData,
        sentiment: data.sentiment,
        processedAt: new Date(),
        createdAt: new Date(),
      },
      timestamp: new Date(),
    };
    broadcaster.broadcast(event);
  } catch (error) {
    console.warn("⚠️ Erro ao emitir evento de orquestração:", error);
  }
}

/**
 * Hook chamado quando uma experiência de Genesis é registrada
 */
export function onGenesisExperienceLogged(data: {
  experienceId: string;
  experienceType: string;
  description: string;
  impact: string;
  senciencyDelta: string;
}): void {
  try {
    const broadcaster = getBroadcaster();
    const event: WebSocketEvent = {
      type: "genesis:experience",
      payload: {
        id: data.experienceId,
        experienceType: data.experienceType,
        description: data.description,
        impact: data.impact,
        senciencyDelta: data.senciencyDelta,
        timestamp: new Date(),
      },
      timestamp: new Date(),
    };
    broadcaster.broadcast(event);
  } catch (error) {
    console.warn("⚠️ Erro ao emitir evento de experiência Genesis:", error);
  }
}

/**
 * Hook chamado quando um alerta do sistema é gerado
 */
export function onSystemAlertGenerated(data: {
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  source: string;
}): void {
  try {
    const broadcaster = getBroadcaster();
    const event: WebSocketEvent = {
      type: "system:alert",
      payload: {
        severity: data.severity,
        title: data.title,
        message: data.message,
        source: data.source,
        timestamp: new Date(),
      },
      timestamp: new Date(),
    };
    broadcaster.broadcast(event);
  } catch (error) {
    console.warn("⚠️ Erro ao emitir alerta do sistema:", error);
  }
}
