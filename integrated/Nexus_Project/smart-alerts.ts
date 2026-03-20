import { notifyOwner } from "./_core/notification";

export interface AlertRule {
  id: string;
  name: string;
  condition: "greater_than" | "less_than" | "equals" | "changed";
  metric: "agent_count" | "transaction_volume" | "avg_health" | "avg_reputation" | "active_agents";
  threshold: number;
  enabled: boolean;
  createdAt: Date;
}

export interface AlertEvent {
  id: string;
  ruleId: string;
  ruleName: string;
  metric: string;
  value: number;
  threshold: number;
  severity: "info" | "warning" | "critical";
  timestamp: Date;
  resolved: boolean;
}

const alertRules: AlertRule[] = [
  {
    id: "rule-1",
    name: "Low Agent Health",
    condition: "less_than",
    metric: "avg_health",
    threshold: 50,
    enabled: true,
    createdAt: new Date(),
  },
  {
    id: "rule-2",
    name: "High Transaction Volume",
    condition: "greater_than",
    metric: "transaction_volume",
    threshold: 1000,
    enabled: true,
    createdAt: new Date(),
  },
  {
    id: "rule-3",
    name: "Low Active Agents",
    condition: "less_than",
    metric: "active_agents",
    threshold: 5,
    enabled: true,
    createdAt: new Date(),
  },
];

const alertEvents: AlertEvent[] = [];
const MAX_ALERT_HISTORY = 1000;

export function createAlertRule(rule: Omit<AlertRule, "id" | "createdAt">): AlertRule {
  const newRule: AlertRule = {
    ...rule,
    id: `rule-${Date.now()}`,
    createdAt: new Date(),
  };
  alertRules.push(newRule);
  console.log(`[SmartAlerts] Rule created: ${newRule.name}`);
  return newRule;
}

export function updateAlertRule(id: string, updates: Partial<AlertRule>): AlertRule | null {
  const rule = alertRules.find((r) => r.id === id);
  if (!rule) return null;

  Object.assign(rule, updates);
  console.log(`[SmartAlerts] Rule updated: ${rule.name}`);
  return rule;
}

export function deleteAlertRule(id: string): boolean {
  const index = alertRules.findIndex((r) => r.id === id);
  if (index !== -1) {
    const rule = alertRules[index];
    alertRules.splice(index, 1);
    console.log(`[SmartAlerts] Rule deleted: ${rule.name}`);
    return true;
  }
  return false;
}

export function getAlertRules(): AlertRule[] {
  return alertRules;
}

export async function evaluateAlerts(metrics: {
  agentCount: number;
  transactionVolume: number;
  avgHealth: number;
  avgReputation: number;
  activeAgents: number;
}): Promise<AlertEvent[]> {
  const triggeredAlerts: AlertEvent[] = [];

  for (const rule of alertRules) {
    if (!rule.enabled) continue;

    let value = 0;
    let triggered = false;

    switch (rule.metric) {
      case "agent_count":
        value = metrics.agentCount;
        break;
      case "transaction_volume":
        value = metrics.transactionVolume;
        break;
      case "avg_health":
        value = metrics.avgHealth;
        break;
      case "avg_reputation":
        value = metrics.avgReputation;
        break;
      case "active_agents":
        value = metrics.activeAgents;
        break;
    }

    switch (rule.condition) {
      case "greater_than":
        triggered = value > rule.threshold;
        break;
      case "less_than":
        triggered = value < rule.threshold;
        break;
      case "equals":
        triggered = value === rule.threshold;
        break;
      case "changed":
        // Check if value changed from last evaluation
        const lastEvent = alertEvents
          .filter((e) => e.ruleId === rule.id)
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
        triggered = !lastEvent || lastEvent.value !== value;
        break;
    }

    if (triggered) {
      const severity =
        rule.metric === "avg_health" || rule.metric === "active_agents" ? "critical" : "warning";

      const alert: AlertEvent = {
        id: `alert-${Date.now()}-${Math.random()}`,
        ruleId: rule.id,
        ruleName: rule.name,
        metric: rule.metric,
        value,
        threshold: rule.threshold,
        severity,
        timestamp: new Date(),
        resolved: false,
      };

      alertEvents.push(alert);
      triggeredAlerts.push(alert);

      console.log(`[SmartAlerts] Alert triggered: ${rule.name} (${value} vs ${rule.threshold})`);

      // Send notification
      try {
        await notifyOwner({
          title: `⚠️ ${rule.name}`,
          content: `${rule.name}: ${value} ${rule.condition === "greater_than" ? ">" : "<"} ${rule.threshold}`,
        });
      } catch (error) {
        console.error(`[SmartAlerts] Failed to send notification:`, error);
      }
    }
  }

  // Cleanup old alerts
  if (alertEvents.length > MAX_ALERT_HISTORY) {
    alertEvents.splice(0, alertEvents.length - MAX_ALERT_HISTORY);
  }

  return triggeredAlerts;
}

export function getAlertHistory(limit: number = 100): AlertEvent[] {
  return alertEvents.slice(-limit).reverse();
}

export function getAlertStats() {
  const critical = alertEvents.filter((a) => a.severity === "critical" && !a.resolved).length;
  const warning = alertEvents.filter((a) => a.severity === "warning" && !a.resolved).length;
  const resolved = alertEvents.filter((a) => a.resolved).length;

  return {
    total: alertEvents.length,
    critical,
    warning,
    resolved,
    unresolved: critical + warning,
  };
}

export function resolveAlert(alertId: string): boolean {
  const alert = alertEvents.find((a) => a.id === alertId);
  if (alert) {
    alert.resolved = true;
    console.log(`[SmartAlerts] Alert resolved: ${alertId}`);
    return true;
  }
  return false;
}

export function clearResolvedAlerts(): number {
  const beforeCount = alertEvents.length;
  const index = alertEvents.findIndex((a) => a.resolved);
  if (index !== -1) {
    alertEvents.splice(index);
  }
  const cleared = beforeCount - alertEvents.length;
  console.log(`[SmartAlerts] Cleared ${cleared} resolved alerts`);
  return cleared;
}
