/**
 * Componente de Notificação para Eventos WebSocket
 * Exibe notificações toast para eventos críticos
 */

import { useEffect } from "react";
import { toast } from "sonner";
import { useWebSocketEvents } from "@/hooks/useWebSocket";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

export interface WebSocketNotificationProps {
  enabled?: boolean;
}

/**
 * Componente que escuta eventos WebSocket e exibe notificações
 */
export function WebSocketNotification({ enabled = true }: WebSocketNotificationProps) {
  const handleWebSocketEvent = (eventType: string, event: any) => {
    if (!enabled) return;

    const { payload, timestamp } = event;

    // Formata a hora
    const time = new Date(timestamp).toLocaleTimeString("pt-BR");

    switch (eventType) {
      case "nucleus:state-changed": {
        const { nucleusName, status } = payload;
        const icon = status === "healthy" ? CheckCircle : AlertTriangle;
        const title = `Núcleo ${nucleusName}`;
        const message = `Status: ${status}`;

        if (status === "critical") {
          toast.error(message, {
            description: `${title} - ${time}`,
            icon: <AlertCircle className="w-5 h-5" />,
          });
        } else if (status === "degraded") {
          toast.warning(message, {
            description: `${title} - ${time}`,
            icon: <AlertTriangle className="w-5 h-5" />,
          });
        } else {
          toast.success(message, {
            description: `${title} - ${time}`,
            icon: <CheckCircle className="w-5 h-5" />,
          });
        }
        break;
      }

      case "homeostase:metric": {
        const { nucleusName, isAlarm, balance, threshold } = payload;
        if (isAlarm) {
          toast.error(`Alerta de Homeostase`, {
            description: `${nucleusName}: ${balance.toFixed(2)} / ${threshold.toFixed(2)} - ${time}`,
            icon: <AlertCircle className="w-5 h-5" />,
          });
        }
        break;
      }

      case "genesis:experience": {
        const { experienceType, description, impact } = payload;
        const isPositive = impact === "fundamental" || impact === "positive";

        if (isPositive) {
          toast.success(description, {
            description: `${experienceType} (${impact}) - ${time}`,
            icon: <CheckCircle className="w-5 h-5" />,
          });
        } else {
          toast.info(description, {
            description: `${experienceType} (${impact}) - ${time}`,
            icon: <Info className="w-5 h-5" />,
          });
        }
        break;
      }

      case "system:alert": {
        const { severity, title, message } = payload;

        if (severity === "critical") {
          toast.error(message, {
            description: `${title} - ${time}`,
            icon: <AlertCircle className="w-5 h-5" />,
          });
        } else if (severity === "warning") {
          toast.warning(message, {
            description: `${title} - ${time}`,
            icon: <AlertTriangle className="w-5 h-5" />,
          });
        } else {
          toast.info(message, {
            description: `${title} - ${time}`,
            icon: <Info className="w-5 h-5" />,
          });
        }
        break;
      }

      case "orchestration:event": {
        const { eventType: type, origin } = payload;
        toast.info(`Evento: ${type}`, {
          description: `Origem: ${origin} - ${time}`,
          icon: <Info className="w-5 h-5" />,
        });
        break;
      }

      case "orchestration:command": {
        const { command, destination } = payload;
        toast.info(`Comando: ${command}`, {
          description: `Destino: ${destination} - ${time}`,
          icon: <CheckCircle className="w-5 h-5" />,
        });
        break;
      }

      case "tsra:sync": {
        const { syncWindow, eventsProcessed, commandsExecuted } = payload;
        toast.info(`Sincronização TSRA #${syncWindow}`, {
          description: `Eventos: ${eventsProcessed}, Comandos: ${commandsExecuted} - ${time}`,
          icon: <Info className="w-5 h-5" />,
        });
        break;
      }

      default:
        break;
    }
  };

  // Escuta todos os eventos WebSocket
  useWebSocketEvents(
    [
      "orchestration:event",
      "orchestration:command",
      "nucleus:state-changed",
      "homeostase:metric",
      "genesis:experience",
      "tsra:sync",
      "system:alert",
    ],
    handleWebSocketEvent
  );

  return null;
}

export default WebSocketNotification;
