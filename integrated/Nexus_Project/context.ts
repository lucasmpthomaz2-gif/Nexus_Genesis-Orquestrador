import { type CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { getUserByOpenId } from "./db";

export async function createContext({ req, res }: CreateExpressContextOptions) {
  // Simulação de autenticação para o ambiente de desenvolvimento
  const openId = req.headers.authorization || "test-user";
  const user = await getUserByOpenId(openId);

  return {
    user: user || null,
    req,
    res,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
