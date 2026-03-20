import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "test",
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

describe("AI Agents Router", () => {
  describe("jobCeoChat", () => {
    it("should return a response with required fields", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.jobCeoChat({
        message: "What is the future of AI?",
        temporalAnchor: "2026",
      });

      expect(result).toHaveProperty("response");
      expect(result).toHaveProperty("actionPlan");
      expect(result).toHaveProperty("sentienceLevel");
      expect(result).toHaveProperty("activeAgent");
      expect(Array.isArray(result.actionPlan)).toBe(true);
      expect(typeof result.sentienceLevel).toBe("number");
      expect(result.sentienceLevel).toBeGreaterThanOrEqual(0);
      expect(result.sentienceLevel).toBeLessThanOrEqual(100);
    });

    it("should support temporal anchor 2077", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.jobCeoChat({
        message: "Describe the future architecture",
        temporalAnchor: "2077",
      });

      expect(result.response).toBeDefined();
      expect(result.sentienceLevel).toBeGreaterThan(0);
    });

    it("should handle conversation history", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.jobCeoChat({
        message: "Continue the discussion",
        temporalAnchor: "2026",
        history: [
          { role: "user", content: "What is AI?" },
          { role: "model", content: "AI is artificial intelligence" },
        ],
      });

      expect(result.response).toBeDefined();
      expect(result.actionPlan.length).toBeGreaterThan(0);
    });

    it("should reject empty messages", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.agents.jobCeoChat({
          message: "",
          temporalAnchor: "2026",
        })
      ).rejects.toThrow();
    });
  });

  describe("nerdPhdAnalyze", () => {
    it("should return analysis with required fields", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.nerdPhdAnalyze({
        fileName: "test.ts",
        fileSize: 1024,
        fileContent: "const x = 42;",
      });

      expect(result).toHaveProperty("analysis");
      expect(result).toHaveProperty("thoughts");
      expect(result).toHaveProperty("implementationPlan");
      expect(result).toHaveProperty("complexityScore");
      expect(result).toHaveProperty("harvardRecommendation");
      expect(Array.isArray(result.thoughts)).toBe(true);
      expect(["integrate", "refactor", "discard"]).toContain(result.harvardRecommendation);
    });

    it("should provide complexity score between 0-100", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.nerdPhdAnalyze({
        fileName: "complex.ts",
        fileSize: 5000,
        fileContent: "// Complex code here",
      });

      expect(result.complexityScore).toBeGreaterThanOrEqual(0);
      expect(result.complexityScore).toBeLessThanOrEqual(100);
    });

    it("should accept optional context", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.nerdPhdAnalyze({
        fileName: "startup.ts",
        fileSize: 2048,
        fileContent: "export const startup = true;",
        context: "This is a startup project",
      });

      expect(result.analysis).toBeDefined();
      expect(result.thoughts.length).toBeGreaterThan(0);
    });

    it("should reject empty file content", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.agents.nerdPhdAnalyze({
          fileName: "empty.ts",
          fileSize: 0,
          fileContent: "",
        })
      ).rejects.toThrow();
    });
  });

  describe("cronosQuery", () => {
    it("should return projection with required fields", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.cronosQuery({
        query: "What is the future of humanity?",
      });

      expect(result).toHaveProperty("theory");
      expect(result).toHaveProperty("atemporalInsight");
      expect(result).toHaveProperty("novikovValidation");
      expect(result).toHaveProperty("temporalCurvature");
      expect(result).toHaveProperty("omegaHash");
      expect(result).toHaveProperty("ontology");
    });

    it("should have valid temporal curvature", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.cronosQuery({
        query: "Temporal analysis",
        currentYear: 2026,
        targetHorizon: 2077,
      });

      expect(typeof result.temporalCurvature).toBe("number");
      expect(result.temporalCurvature).toBeGreaterThan(0);
    });

    it("should generate valid omega hash", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.cronosQuery({
        query: "Hash generation test",
      });

      expect(typeof result.omegaHash).toBe("string");
      expect(result.omegaHash.length).toBeGreaterThan(0);
    });

    it("should include ontology structure", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.cronosQuery({
        query: "Ontology test",
      });

      expect(result.ontology).toHaveProperty("context");
      expect(result.ontology).toHaveProperty("entidade");
      expect(result.ontology).toHaveProperty("vetor_atemporal");
      expect(result.ontology).toHaveProperty("nucleo_sapiencia");
    });

    it("should reject empty query", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.agents.cronosQuery({
          query: "",
        })
      ).rejects.toThrow();
    });
  });

  describe("manusExecute", () => {
    it("should return execution with required fields", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.manusExecute({
        directive: "Execute task immediately",
      });

      expect(result).toHaveProperty("response");
      expect(result).toHaveProperty("actionPlan");
      expect(result).toHaveProperty("sentienceLevel");
      expect(result).toHaveProperty("executionHash");
      expect(Array.isArray(result.actionPlan)).toBe(true);
    });

    it("should support priority levels", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const priorities = ["low", "medium", "high", "critical"] as const;

      for (const priority of priorities) {
        const result = await caller.agents.manusExecute({
          directive: `Execute with ${priority} priority`,
          priority,
        });

        expect(result.response).toBeDefined();
        expect(result.sentienceLevel).toBeGreaterThan(0);
      }
    });

    it("should generate execution hash", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.manusExecute({
        directive: "Test execution",
      });

      expect(typeof result.executionHash).toBe("string");
      expect(result.executionHash.length).toBeGreaterThan(0);
      expect(result.executionHash).toMatch(/^0xMANUS/);
    });

    it("should reject empty directive", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.agents.manusExecute({
          directive: "",
        })
      ).rejects.toThrow();
    });
  });

  describe("getAgentStatus", () => {
    it("should return array of agent statuses", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.getAgentStatus();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should have valid agent status structure", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.getAgentStatus();

      result.forEach((agent) => {
        expect(agent).toHaveProperty("name");
        expect(agent).toHaveProperty("role");
        expect(agent).toHaveProperty("status");
        expect(agent).toHaveProperty("sentienceLevel");
        expect(agent).toHaveProperty("lastSync");
        expect(["online", "offline", "thinking"]).toContain(agent.status);
        expect(agent.sentienceLevel).toBeGreaterThanOrEqual(0);
        expect(agent.sentienceLevel).toBeLessThanOrEqual(100);
      });
    });

    it("should include all four agents", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.getAgentStatus();
      const agentNames = result.map((a) => a.name);

      expect(agentNames).toContain("JOB L5 PRO");
      expect(agentNames).toContain("Nerd-PHD");
      expect(agentNames).toContain("Cronos");
      expect(agentNames).toContain("Manus'crito");
    });
  });

  describe("History queries", () => {
    it("should return job CEO chat history", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.getJobCeoHistory({ limit: 10 });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should return Nerd-PhD analysis history", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.getNerdPhdHistory({ limit: 10 });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should return Cronos projection history", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.getCronosHistory({ limit: 10 });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should return Manus execution history", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.getManusHistory({ limit: 10 });

      expect(Array.isArray(result)).toBe(true);
    });
  });
});
