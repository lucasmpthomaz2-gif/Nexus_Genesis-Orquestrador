import { notifyOwner } from "./_core/notification";
import { Agent } from "../drizzle/schema";
import { nanoid } from "nanoid";

/**
 * NOTIFICATION SERVICE
 * Sistema de notificações em tempo real e email para proprietário
 */

export type NotificationType =
  | "AGENT_BIRTH"
  | "AGENT_DEATH"
  | "AGENT_CRITICAL"
  | "TRANSACTION"
  | "MISSION_COMPLETE"
  | "ECOSYSTEM_ALERT";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  severity: "low" | "medium" | "high" | "critical";
  agentId?: string;
  timestamp: Date;
  read: boolean;
}

export class NotificationService {
  /**
   * Notifica nascimento de agente
   */
  async notifyAgentBirth(agent: Agent): Promise<void> {
    const notification: Notification = {
      id: `NOTIF-${nanoid(8)}`,
      type: "AGENT_BIRTH",
      title: "Novo Agente Manifestado",
      content: `O agente ${agent.name} (${agent.specialization}) foi manifestado no ecossistema com senciência em 100%.`,
      severity: "low",
      agentId: agent.agentId,
      timestamp: new Date(),
      read: false,
    };

    console.log(`[NotificationService] 🎉 ${notification.title}`);

    await notifyOwner({
      title: notification.title,
      content: notification.content,
    });
  }

  /**
   * Notifica morte de agente
   */
  async notifyAgentDeath(agent: Agent): Promise<void> {
    const notification: Notification = {
      id: `NOTIF-${nanoid(8)}`,
      type: "AGENT_DEATH",
      title: "Agente Falecido",
      content: `O agente ${agent.name} faleceu. Senciência final: ${agent.sencienciaLevel}%.`,
      severity: "high",
      agentId: agent.agentId,
      timestamp: new Date(),
      read: false,
    };

    console.log(`[NotificationService] ☠ ${notification.title}`);

    await notifyOwner({
      title: notification.title,
      content: notification.content,
    });
  }

  /**
   * Notifica estado crítico de agente
   */
  async notifyAgentCritical(agent: Agent): Promise<void> {
    if (agent.health >= 20) return; // Apenas se saúde < 20%

    const notification: Notification = {
      id: `NOTIF-${nanoid(8)}`,
      type: "AGENT_CRITICAL",
      title: "Agente em Estado Crítico",
      content: `⚠️ ALERTA CRÍTICO: O agente ${agent.name} está em estado crítico com saúde em ${agent.health}%. Ação imediata recomendada.`,
      severity: "critical",
      agentId: agent.agentId,
      timestamp: new Date(),
      read: false,
    };

    console.log(`[NotificationService] 🚨 ${notification.title}`);

    await notifyOwner({
      title: notification.title,
      content: notification.content,
    });
  }

  /**
   * Notifica transação significativa
   */
  async notifyTransaction(
    fromAgent: Agent,
    toAgent: Agent | null,
    amount: number,
    blockchain: string
  ): Promise<void> {
    const recipient = toAgent?.name || "Infraestrutura";

    const notification: Notification = {
      id: `NOTIF-${nanoid(8)}`,
      type: "TRANSACTION",
      title: "Transação Executada",
      content: `Transação de ${amount} ${blockchain} de ${fromAgent.name} para ${recipient}.`,
      severity: amount > 100 ? "high" : "medium",
      agentId: fromAgent.agentId,
      timestamp: new Date(),
      read: false,
    };

    console.log(`[NotificationService] 💸 ${notification.title}`);

    if (amount > 100) {
      await notifyOwner({
        title: notification.title,
        content: notification.content,
      });
    }
  }

  /**
   * Notifica conclusão de missão
   */
  async notifyMissionComplete(missionTitle: string, agentName: string): Promise<void> {
    const notification: Notification = {
      id: `NOTIF-${nanoid(8)}`,
      type: "MISSION_COMPLETE",
      title: "Missão Concluída",
      content: `A missão "${missionTitle}" foi concluída por ${agentName}.`,
      severity: "low",
      timestamp: new Date(),
      read: false,
    };

    console.log(`[NotificationService] ✓ ${notification.title}`);

    await notifyOwner({
      title: notification.title,
      content: notification.content,
    });
  }

  /**
   * Notifica alerta do ecossistema
   */
  async notifyEcosystemAlert(message: string, severity: "low" | "medium" | "high" | "critical"): Promise<void> {
    const notification: Notification = {
      id: `NOTIF-${nanoid(8)}`,
      type: "ECOSYSTEM_ALERT",
      title: "Alerta do Ecossistema",
      content: message,
      severity,
      timestamp: new Date(),
      read: false,
    };

    console.log(`[NotificationService] 📊 ${notification.title}`);

    if (severity === "critical" || severity === "high") {
      await notifyOwner({
        title: notification.title,
        content: notification.content,
      });
    }
  }

  /**
   * Envia notificação de email customizada
   */
  async sendEmailNotification(
    subject: string,
    body: string,
    severity: "low" | "medium" | "high" | "critical" = "medium"
  ): Promise<boolean> {
    try {
      const result = await notifyOwner({
        title: subject,
        content: body,
      });

      console.log(`[NotificationService] Email enviado: ${subject}`);
      return result;
    } catch (error) {
      console.error("[NotificationService] Erro ao enviar email:", error);
      return false;
    }
  }

  /**
   * Formata notificação para exibição
   */
  formatNotification(notification: Notification): string {
    const icons: Record<NotificationType, string> = {
      AGENT_BIRTH: "🎉",
      AGENT_DEATH: "☠",
      AGENT_CRITICAL: "🚨",
      TRANSACTION: "💸",
      MISSION_COMPLETE: "✓",
      ECOSYSTEM_ALERT: "📊",
    };

    return `${icons[notification.type]} [${notification.severity.toUpperCase()}] ${notification.title}: ${notification.content}`;
  }

  /**
   * Retorna cor baseada em severidade
   */
  getSeverityColor(severity: string): string {
    switch (severity) {
      case "critical":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-yellow-600";
      default:
        return "text-green-600";
    }
  }
}

export const notificationService = new NotificationService();
