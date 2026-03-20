import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { User } from "../../drizzle/schema";

interface Context {
  user: User | null;
  req: any;
  res: any;
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});
