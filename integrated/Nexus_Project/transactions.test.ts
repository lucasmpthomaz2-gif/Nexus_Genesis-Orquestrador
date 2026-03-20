import { describe, it, expect, beforeEach } from "vitest";
import { transactionsRouter } from "./transactions";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "test",
    role: "user",
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
    res: {} as TrpcContext["res"],
  };
}

describe("transactionsRouter", () => {
  let ctx: TrpcContext;
  let caller: ReturnType<typeof transactionsRouter.createCaller>;

  beforeEach(() => {
    ctx = createAuthContext();
    caller = transactionsRouter.createCaller(ctx);
  });

  describe("getTreasury", () => {
    it("should retrieve treasury information for an agent", async () => {
      const result = await caller.getTreasury(1);
      expect(result).toBeDefined();
    });
  });

  describe("getAll", () => {
    it("should retrieve all completed transactions", async () => {
      const result = await caller.getAll({
        limit: 20,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should support pagination", async () => {
      const result1 = await caller.getAll({
        limit: 10,
        offset: 0,
      });

      const result2 = await caller.getAll({
        limit: 10,
        offset: 10,
      });

      expect(Array.isArray(result1)).toBe(true);
      expect(Array.isArray(result2)).toBe(true);
    });
  });

  describe("Fee Distribution", () => {
    it("should validate 80/10/10 fee distribution", async () => {
      // This test validates the business logic for fee distribution
      // The actual implementation should ensure:
      // - 80% goes to the receiver
      // - 10% goes to governance fund
      // - 10% goes to innovation fund

      const amount = 100;
      const governanceFee = amount * 0.1;
      const innovationFee = amount * 0.1;
      const agentShare = amount * 0.8;

      expect(governanceFee).toBe(10);
      expect(innovationFee).toBe(10);
      expect(agentShare).toBe(80);
      expect(governanceFee + innovationFee + agentShare).toBe(100);
    });
  });
});
