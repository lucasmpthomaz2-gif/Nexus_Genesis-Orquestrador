import { router, publicProcedure } from "../_core/trpc";
import { getHealthStatus } from "../health-monitor";

export const healthRouter = router({
  check: publicProcedure.query(async () => {
    return await getHealthStatus();
  }),

  status: publicProcedure.query(async () => {
    const health = await getHealthStatus();
    return {
      status: health.status,
      timestamp: health.timestamp,
      uptime: health.uptime,
      database: health.database.connected,
      memory: {
        used: health.memory.heapUsed,
        total: health.memory.heapTotal,
        percentage: Math.round((health.memory.heapUsed / health.memory.heapTotal) * 100),
      },
    };
  }),

  detailed: publicProcedure.query(async () => {
    return await getHealthStatus();
  }),
});
