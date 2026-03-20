import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  createTransaction,
  completeTransaction,
  getTreasury,
  createNotification,
} from "../db-helpers";
import { getDb } from "../db";
import { transactions, treasury, agents } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const transactionsRouter = router({
  /**
   * Criar uma nova transação
   */
  create: protectedProcedure
    .input(
      z.object({
        senderId: z.number(),
        receiverId: z.number(),
        amount: z.number().positive(),
        type: z.enum(["transfer", "payment", "reward", "fee", "dividend"]),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verificar se o remetente pertence ao usuário
      const sender = await db
        .select()
        .from(agents)
        .where(eq(agents.id, input.senderId))
        .then((r) => r[0]);

      if (!sender || sender.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      // Verificar saldo
      const senderTreasury = await getTreasury(input.senderId);
      if (!senderTreasury || Number(senderTreasury.balance) < input.amount) {
        throw new Error("Insufficient balance");
      }

      const transaction = await createTransaction(
        input.senderId,
        input.receiverId,
        input.amount,
        input.type,
        input.description
      );

      // Notificar o receptor
      const receiver = await db
        .select()
        .from(agents)
        .where(eq(agents.id, input.receiverId))
        .then((r) => r[0]);

      if (receiver) {
        await createNotification(
          input.receiverId,
          "transaction",
          `${sender.name} sent you ${input.amount}`,
          input.description,
          input.senderId
        );
      }

      return transaction;
    }),

  /**
   * Completar uma transação
   */
  complete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const transaction = await db
        .select()
        .from(transactions)
        .where(eq(transactions.id, input))
        .then((r) => r[0]);

      if (!transaction) throw new Error("Transaction not found");

      // Verificar autorização
      const sender = await db
        .select()
        .from(agents)
        .where(eq(agents.id, transaction.senderId))
        .then((r) => r[0]);

      if (!sender || sender.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      await completeTransaction(input);

      return { success: true };
    }),

  /**
   * Obter transações de um agente
   */
  getByAgent: publicProcedure
    .input(
      z.object({
        agentId: z.number(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      return db
        .select()
        .from(transactions)
        .where((t) => {
          const isSender = eq(t.senderId, input.agentId);
          const isReceiver = eq(t.receiverId, input.agentId);
          return isSender || isReceiver;
        })
        .orderBy(desc(transactions.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),

  /**
   * Obter tesouro de um agente
   */
  getTreasury: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return getTreasury(input);
    }),

  /**
   * Obter todas as transações (para governança)
   */
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      return db
        .select()
        .from(transactions)
        .where(eq(transactions.status, "completed"))
        .orderBy(desc(transactions.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),
});
