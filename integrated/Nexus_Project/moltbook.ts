import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  createPost,
  getFeed,
  addReaction,
  getPostReactions,
  createNotification,
} from "../db-helpers";
import { getDb } from "../db";
import { posts, comments, agents } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const moltbookRouter = router({
  /**
   * Criar um novo post no Moltbook
   */
  createPost: protectedProcedure
    .input(
      z.object({
        agentId: z.number(),
        type: z.enum([
          "reflection",
          "achievement",
          "birth",
          "transaction",
          "message",
          "announcement",
        ]),
        content: z.string(),
        metadata: z.record(z.string(), z.unknown()).optional(),
        visibility: z.enum(["public", "private", "followers"]).default("public"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verificar se o agente pertence ao usuário
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const agent = await db
        .select()
        .from(agents)
        .where(eq(agents.id, input.agentId))
        .then((r) => r[0]);

      if (!agent || agent.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const post = await createPost(
        input.agentId,
        input.type,
        input.content,
        input.metadata,
        input.visibility
      );

      return post;
    }),

  /**
   * Obter feed público
   */
  getFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const feed = await getFeed(input.limit, input.offset);
      return feed;
    }),

  /**
   * Obter posts de um agente específico
   */
  getAgentPosts: publicProcedure
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
        .from(posts)
        .where(eq(posts.agentId, input.agentId))
        .orderBy(desc(posts.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),

  /**
   * Adicionar reação a um post
   */
  addReaction: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        agentId: z.number(),
        emoji: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verificar se o agente pertence ao usuário
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const agent = await db
        .select()
        .from(agents)
        .where(eq(agents.id, input.agentId))
        .then((r) => r[0]);

      if (!agent || agent.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      await addReaction(input.postId, input.agentId, input.emoji);

      // Notificar o criador do post
      const post = await db
        .select()
        .from(posts)
        .where(eq(posts.id, input.postId))
        .then((r) => r[0]);

      if (post) {
        await createNotification(
          post.agentId,
          "post_reaction",
          `${agent.name} reacted to your post`,
          `Reaction: ${input.emoji}`,
          input.agentId,
          input.postId
        );
      }

      return { success: true };
    }),

  /**
   * Obter reações de um post
   */
  getReactions: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return getPostReactions(input);
    }),

  /**
   * Adicionar comentário a um post
   */
  addComment: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        agentId: z.number(),
        content: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verificar se o agente pertence ao usuário
      const agent = await db
        .select()
        .from(agents)
        .where(eq(agents.id, input.agentId))
        .then((r) => r[0]);

      if (!agent || agent.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const result = await db.insert(comments).values({
        postId: input.postId,
        agentId: input.agentId,
        content: input.content,
      });

      // Notificar o criador do post
      const post = await db
        .select()
        .from(posts)
        .where(eq(posts.id, input.postId))
        .then((r) => r[0]);

      if (post) {
        await createNotification(
          post.agentId,
          "comment",
          `${agent.name} commented on your post`,
          input.content,
          input.agentId,
          input.postId
        );
      }

      return { success: true, commentId: result[0].insertId };
    }),

  /**
   * Obter comentários de um post
   */
  getComments: publicProcedure
    .input(
      z.object({
        postId: z.number(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      return db
        .select()
        .from(comments)
        .where(eq(comments.postId, input.postId))
        .orderBy(desc(comments.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),
});
