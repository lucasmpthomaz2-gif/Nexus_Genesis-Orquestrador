import { describe, it, expect, beforeEach } from "vitest";
import { agentsRouter } from "./agents";
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

describe("agentsRouter", () => {
  let ctx: TrpcContext;
  let caller: ReturnType<typeof agentsRouter.createCaller>;

  beforeEach(() => {
    ctx = createAuthContext();
    caller = agentsRouter.createCaller(ctx);
  });

  describe("create", () => {
    it("should create a new agent with valid input", async () => {
      const result = await caller.create({
        name: "TestAgent",
        specialization: "Testing",
        traits: {
          intelligence: 75,
          creativity: 80,
          empathy: 60,
          resilience: 70,
        },
      });

      expect(result).toBeDefined();
      expect(result?.name).toBe("TestAgent");
    });

    it("should create an agent with optional description", async () => {
      const result = await caller.create({
        name: "TestAgent2",
        description: "A test agent for validation",
        specialization: "Testing",
        traits: {
          intelligence: 50,
          creativity: 50,
          empathy: 50,
          resilience: 50,
        },
      });

      expect(result?.description).toBe("A test agent for validation");
    });
  });

  describe("getById", () => {
    it("should retrieve an agent by ID", async () => {
      const created = await caller.create({
        name: "RetrieveTest",
        specialization: "Testing",
        traits: {
          intelligence: 60,
          creativity: 60,
          empathy: 60,
          resilience: 60,
        },
      });

      if (created?.id) {
        const retrieved = await caller.getById(created.id);
        expect(retrieved?.name).toBe("RetrieveTest");
      }
    });
  });

  describe("listByUser", () => {
    it("should list all agents for the authenticated user", async () => {
      await caller.create({
        name: "Agent1",
        specialization: "Testing",
        traits: {
          intelligence: 50,
          creativity: 50,
          empathy: 50,
          resilience: 50,
        },
      });

      const agents = await caller.listByUser();
      expect(Array.isArray(agents)).toBe(true);
    });
  });

  describe("updateVitals", () => {
    it("should update agent vitals", async () => {
      const created = await caller.create({
        name: "VitalsTest",
        specialization: "Testing",
        traits: {
          intelligence: 50,
          creativity: 50,
          empathy: 50,
          resilience: 50,
        },
      });

      if (created?.id) {
        const result = await caller.updateVitals({
          agentId: created.id,
          activityLevel: 0.8,
        });

        expect(result).toBeDefined();
        expect(result.health).toBeDefined();
        expect(result.energy).toBeDefined();
      }
    });
  });

  describe("fuseDNA", () => {
    it("should fuse DNA from two agents to create a child", async () => {
      const parent1 = await caller.create({
        name: "Parent1",
        specialization: "Testing",
        traits: {
          intelligence: 80,
          creativity: 70,
          empathy: 60,
          resilience: 75,
        },
      });

      const parent2 = await caller.create({
        name: "Parent2",
        specialization: "Testing",
        traits: {
          intelligence: 70,
          creativity: 80,
          empathy: 75,
          resilience: 65,
        },
      });

      if (parent1?.id && parent2?.id) {
        const child = await caller.fuseDNA({
          parentId1: parent1.id,
          parentId2: parent2.id,
          newAgentName: "Child",
        });

        expect(child).toBeDefined();
        expect(child?.name).toBe("Child");
        expect(child?.generation).toBe(1);
      }
    });
  });
});
