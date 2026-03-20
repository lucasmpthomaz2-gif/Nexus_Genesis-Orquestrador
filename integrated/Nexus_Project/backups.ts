import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import {
  createBackup,
  restoreBackup,
  getBackupHistory,
  getBackupStats,
  deleteBackup,
  cleanupOldBackups,
} from "../backup-manager";
import { z } from "zod";

export const backupsRouter = router({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new Error("Only admins can create backups");
    }
    return await createBackup();
  }),

  getHistory: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Only admins can view backup history");
      }
      return getBackupHistory(input.limit);
    }),

  getStats: protectedProcedure.query(({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new Error("Only admins can view backup stats");
    }
    return getBackupStats();
  }),

  restore: protectedProcedure
    .input(z.object({ backupId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Only admins can restore backups");
      }
      const success = await restoreBackup(input.backupId);
      return { success };
    }),

  delete: protectedProcedure
    .input(z.object({ backupId: z.string() }))
    .mutation(({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Only admins can delete backups");
      }
      const success = deleteBackup(input.backupId);
      return { success };
    }),

  cleanup: protectedProcedure
    .input(z.object({ keepCount: z.number().default(30) }))
    .mutation(({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Only admins can cleanup backups");
      }
      const deleted = cleanupOldBackups(input.keepCount);
      return { deleted };
    }),
});
