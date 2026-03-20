import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { getAlerts, getAlertStats, resolveAlert, clearAlerts } from "../critical-alerts";
import { z } from "zod";

export const alertsRouter = router({
  getAlerts: publicProcedure
    .input(
      z.object({
        type: z.string().optional(),
        severity: z.string().optional(),
        limit: z.number().default(100),
      })
    )
    .query(({ input }) => {
      return getAlerts(input.type, input.severity, input.limit);
    }),

  getStats: publicProcedure.query(() => {
    return getAlertStats();
  }),

  resolve: protectedProcedure
    .input(z.object({ alertId: z.string() }))
    .mutation(({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Only admins can resolve alerts");
      }
      resolveAlert(input.alertId);
      return { success: true };
    }),

  clear: protectedProcedure.mutation(({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new Error("Only admins can clear alerts");
    }
    clearAlerts();
    return { success: true };
  }),

  getCritical: publicProcedure.query(() => {
    return getAlerts("health", "critical", 50);
  }),

  getWarnings: publicProcedure.query(() => {
    return getAlerts(undefined, "warning", 50);
  }),
});
