import { getDb } from "./db";
import { getHealthStatus } from "./health-monitor";
import { notifyOwner } from "./_core/notification";

export interface CriticalAlert {
  id: string;
  type: "health" | "database" | "memory" | "disk";
  severity: "critical" | "warning";
  message: string;
  timestamp: Date;
  resolved: boolean;
}

const alertHistory: CriticalAlert[] = [];
const MAX_ALERTS = 1000;

export async function checkCriticalAlerts() {
  const health = await getHealthStatus();
  const alerts: CriticalAlert[] = [];

  // Check database health
  if (!health.database.connected) {
    alerts.push({
      id: `db-${Date.now()}`,
      type: "database",
      severity: "critical",
      message: "Database connection lost",
      timestamp: new Date(),
      resolved: false,
    });
  }

  // Check memory usage
  const memoryPercentage = (health.memory.heapUsed / health.memory.heapTotal) * 100;
  if (memoryPercentage > 90) {
    alerts.push({
      id: `mem-critical-${Date.now()}`,
      type: "memory",
      severity: "critical",
      message: `Critical memory usage: ${Math.round(memoryPercentage)}%`,
      timestamp: new Date(),
      resolved: false,
    });
  } else if (memoryPercentage > 75) {
    alerts.push({
      id: `mem-warning-${Date.now()}`,
      type: "memory",
      severity: "warning",
      message: `High memory usage: ${Math.round(memoryPercentage)}%`,
      timestamp: new Date(),
      resolved: false,
    });
  }

  // Check overall health
  if (health.status === "unhealthy") {
    alerts.push({
      id: `health-critical-${Date.now()}`,
      type: "health",
      severity: "critical",
      message: "System health is critical",
      timestamp: new Date(),
      resolved: false,
    });
  } else if (health.status === "degraded") {
    alerts.push({
      id: `health-warning-${Date.now()}`,
      type: "health",
      severity: "warning",
      message: "System health is degraded",
      timestamp: new Date(),
      resolved: false,
    });
  }

  // Process alerts
  for (const alert of alerts) {
    addAlert(alert);

    // Send notification for critical alerts
    if (alert.severity === "critical") {
      try {
        await notifyOwner({
          title: `🚨 NEXUS Critical Alert: ${alert.type.toUpperCase()}`,
          content: alert.message,
        });
      } catch (error) {
        console.error("[Critical Alerts] Failed to send notification:", error);
      }
    }
  }

  return alerts;
}

export function addAlert(alert: CriticalAlert) {
  alertHistory.push(alert);

  // Keep only recent alerts
  if (alertHistory.length > MAX_ALERTS) {
    alertHistory.shift();
  }

  console.log(`[Critical Alert] ${alert.severity.toUpperCase()}: ${alert.message}`);
}

export function getAlerts(
  type?: string,
  severity?: string,
  limit: number = 100
): CriticalAlert[] {
  let filtered = [...alertHistory];

  if (type) {
    filtered = filtered.filter((a) => a.type === type);
  }

  if (severity) {
    filtered = filtered.filter((a) => a.severity === severity);
  }

  return filtered.slice(-limit).reverse();
}

export function resolveAlert(alertId: string) {
  const alert = alertHistory.find((a) => a.id === alertId);
  if (alert) {
    alert.resolved = true;
  }
}

export function clearAlerts() {
  alertHistory.length = 0;
}

export function getAlertStats() {
  const critical = alertHistory.filter((a) => a.severity === "critical" && !a.resolved).length;
  const warnings = alertHistory.filter((a) => a.severity === "warning" && !a.resolved).length;
  const resolved = alertHistory.filter((a) => a.resolved).length;

  return {
    critical,
    warnings,
    resolved,
    total: alertHistory.length,
  };
}

export async function startCriticalAlertMonitoring(intervalMs: number = 30000) {
  console.log("[Critical Alerts] Started monitoring with interval:", intervalMs, "ms");

  setInterval(async () => {
    try {
      await checkCriticalAlerts();
    } catch (error) {
      console.error("[Critical Alerts] Error during check:", error);
    }
  }, intervalMs);
}
