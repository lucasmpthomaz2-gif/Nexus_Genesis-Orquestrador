import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getAgentNotifications, createNotification } from "../db-helpers";
import { getDb } from "../db";
import { notifications, agents } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const notificationsRouter = router({
  /**
   * Obter notificações de um agente
   */
  getByAgent: protectedProcedure
    .input(
      z.object({
        agentId: z.number(),
        unreadOnly: z.boolean().default(false),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];

      // Verificar autorização
      const agent = await db
        .select()
        .from(agents)
        .where(eq(agents.id, input.agentId))
        .then((r) => r[0]);

      if (!agent || agent.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      return getAgentNotifications(input.agentId, input.unreadOnly);
    }),

  /**
   * Marcar notificação como lida
   */
  markAsRead: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const notification = await db
        .select()
        .from(notifications)
        .where(eq(notifications.id, input))
        .then((r) => r[0]);

      if (!notification) throw new Error("Notification not found");

      // Verificar autorização
      const agent = await db
        .select()
        .from(agents)
        .where(eq(agents.id, notification.agentId))
        .then((r) => r[0]);

      if (!agent || agent.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.id, input));

      return { success: true };
    }),

  /**
   * Marcar todas as notificações como lidas
   */
  markAllAsRead: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verificar autorização
      const agent = await db
        .select()
        .from(agents)
        .where(eq(agents.id, input))
        .then((r) => r[0]);

      if (!agent || agent.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.agentId, input));

      return { success: true };
    }),

  /**
   * Deletar notificação
   */
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const notification = await db
        .select()
        .from(notifications)
        .where(eq(notifications.id, input))
        .then((r) => r[0]);

      if (!notification) throw new Error("Notification not found");

      // Verificar autorização
      const agent = await db
        .select()
        .from(agents)
        .where(eq(agents.id, notification.agentId))
        .then((r) => r[0]);

      if (!agent || agent.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      // Soft delete (apenas marcar como lida e oculta)
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.id, input));

      return { success: true };
    }),

  /**
   * Criar notificação (admin only)
   */
  create: protectedProcedure
    .input(
      z.object({
        agentId: z.number(),
        type: z.enum([
          "post_reaction",
          "comment",
          "message",
          "transaction",
          "achievement",
          "system",
        ]),
        title: z.string(),
        content: z.string().optional(),
        relatedAgentId: z.number().optional(),
        relatedPostId: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Apenas admin pode criar notificações do sistema
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return createNotification(
        input.agentId,
        input.type,
        input.title,
        input.content,
        input.relatedAgentId,
        input.relatedPostId
      );
    }),
});
