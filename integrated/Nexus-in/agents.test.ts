import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("agents router", () => {
  it("should list agents", async () => {
    const { ctx } = createContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.agents.list({ limit: 50 });

    expect(Array.isArray(result)).toBe(true);
  });

  it("should get agent by id", async () => {
    const { ctx } = createContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.agents.getById({ id: 1 });

    // Result can be undefined if agent doesn't exist
    expect(result === undefined || typeof result === "object").toBe(true);
  });

  it("should get agent connections", async () => {
    const { ctx } = createContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.agents.getConnections({ agentId: 1 });

    expect(Array.isArray(result)).toBe(true);
  });
});
