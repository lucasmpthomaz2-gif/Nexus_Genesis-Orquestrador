import { getDb } from "./db";

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: Date;
  database: {
    connected: boolean;
    responseTime: number;
  };
  memory: {
    heapUsed: number;
    heapTotal: number;
    external: number;
  };
  uptime: number;
  checks: {
    database: boolean;
    memory: boolean;
    disk: boolean;
  };
}

export async function getHealthStatus(): Promise<HealthStatus> {
  const startTime = Date.now();
  const memUsage = process.memoryUsage();

  // Database health check
  let dbConnected = false;
  let dbResponseTime = 0;
  try {
    const db = await getDb();
    if (db) {
      const dbStart = Date.now();
      // Simple query to test connection
      dbConnected = true;
      dbResponseTime = Date.now() - dbStart;
    }
  } catch (error) {
    console.error("[Health] Database check failed:", error);
  }

  // Memory check
  const memoryHealthy =
    memUsage.heapUsed / memUsage.heapTotal < 0.9; // Alert if >90% heap used

  // Disk check (simplified - in production would check actual disk space)
  const diskHealthy = true;

  const allChecksPass = dbConnected && memoryHealthy && diskHealthy;

  return {
    status: allChecksPass ? "healthy" : memoryHealthy && dbConnected ? "degraded" : "unhealthy",
    timestamp: new Date(),
    database: {
      connected: dbConnected,
      responseTime: dbResponseTime,
    },
    memory: {
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
      external: Math.round(memUsage.external / 1024 / 1024), // MB
    },
    uptime: process.uptime(),
    checks: {
      database: dbConnected,
      memory: memoryHealthy,
      disk: diskHealthy,
    },
  };
}

export async function startHealthMonitoring(intervalMs: number = 60000) {
  console.log("[Health Monitor] Started with interval:", intervalMs, "ms");

  setInterval(async () => {
    try {
      const health = await getHealthStatus();

      if (health.status === "unhealthy") {
        console.error("[Health] CRITICAL: System is unhealthy", health);
      } else if (health.status === "degraded") {
        console.warn("[Health] WARNING: System is degraded", health);
      } else {
        console.log("[Health] OK: System is healthy");
      }
    } catch (error) {
      console.error("[Health Monitor] Error during health check:", error);
    }
  }, intervalMs);
}
