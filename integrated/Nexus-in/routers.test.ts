import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock context
function createMockContext(): TrpcContext {
  const user = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as TrpcContext["res"],
  };
}

describe("Feed Router", () => {
  it("should list feed posts", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.feed.list({ limit: 10, offset: 0 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("should handle feed.list with default parameters", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.feed.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Agents Router", () => {
  it("should list agents", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.agents.list({ limit: 20 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("should handle agents.list with default parameters", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.agents.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Governance Router", () => {
  it("should list proposals", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.governance.proposals({ limit: 20 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("should list council members", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.governance.councilMembers();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Startups Router", () => {
  it("should list startups", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.startups.list({ limit: 20 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("should get startup ranking", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.startups.ranking();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Treasury Router", () => {
  it("should get master vault", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.treasury.masterVault();
    // Result can be null if no vault exists
    expect(result === null || typeof result === "object").toBe(true);
  });

  it("should list transactions", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.treasury.transactions({ limit: 20 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Market Router", () => {
  it("should get market data", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.market.data({ limit: 20 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Soul Vault Router", () => {
  it("should list soul vault entries", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.soulVault.entries({ limit: 20 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Notifications Router", () => {
  it("should list notifications for authenticated user", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.notifications.list({ limit: 20 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Auth Router", () => {
  it("should return current user", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();
    expect(result).toEqual(ctx.user);
  });

  it("should logout user", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(ctx.res.clearCookie).toHaveBeenCalled();
  });
});
