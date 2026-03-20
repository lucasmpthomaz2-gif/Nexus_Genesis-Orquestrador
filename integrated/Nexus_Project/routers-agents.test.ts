import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import * as dbAgents from "./db-agents";
import type { Agent, Mission, Reputation, Badge } from "../drizzle/schema";

// Mock do banco de dados
vi.mock("./db-agents");

const mockAgent: Agent = {
  id: 1,
  agentId: "agent_test_001",
  name: "Test Agent",
  specialization: "Desenvolvimento e Projetos",
  description: "Test agent for unit tests",
  dnaHash: "0x1234567890abcdef",
  avatarUrl: null,
  systemPrompt: null,
  balance: 1000,
  reputation: 500,
  health: 85,
  energy: 90,
  creativity: 75,
  generationNumber: 1,
  parentId: null,
  status: "active" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockMissions: Mission[] = [
  {
    id: 1,
    missionId: "mission_001",
    title: "Test Mission 1",
    description: "A test mission",
    assignedAgentId: "agent_test_001",
    status: "completed" as const,
    priority: "high" as const,
    reward: 100,
    result: "Success",
    createdAt: new Date(),
    completedAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockReputation: Reputation = {
  id: 1,
  agentId: "agent_test_001",
  score: 500,
  level: "expert",
  totalMissionsCompleted: 10,
  successRate: 95,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockBadges: Badge[] = [
  {
    id: 1,
    badgeId: "badge_001",
    agentId: "agent_test_001",
    name: "First Mission",
    description: "Completed first mission",
    icon: "🎖️",
    category: "achievement",
    earnedAt: new Date(),
  },
];

describe("Agents Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProfile", () => {
    it("should return complete agent profile", async () => {
      vi.mocked(dbAgents.getAgentById).mockResolvedValue(mockAgent);
      vi.mocked(dbAgents.getAgentReputation).mockResolvedValue(mockReputation);
      vi.mocked(dbAgents.getBadgesByAgent).mockResolvedValue(mockBadges);
      vi.mocked(dbAgents.getAgentGenealogy).mockResolvedValue(null);
      vi.mocked(dbAgents.getMissionsByAgent).mockResolvedValue(mockMissions);
      vi.mocked(dbAgents.getAgentTransactions).mockResolvedValue([]);
      vi.mocked(dbAgents.getLatestBrainPulse).mockResolvedValue(null);
      vi.mocked(dbAgents.getAgentPosts).mockResolvedValue([]);
      vi.mocked(dbAgents.getAgentProjects).mockResolvedValue([]);
      vi.mocked(dbAgents.getAgentAssets).mockResolvedValue([]);
      vi.mocked(dbAgents.getGnoxMessagesBetween).mockResolvedValue([]);

      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.agents.getProfile({ agentId: "agent_test_001" });

      expect(result).toBeDefined();
      expect(result?.agent).toEqual(mockAgent);
      expect(result?.reputation).toEqual(mockReputation);
      expect(result?.badges).toEqual(mockBadges);
      expect(result?.missions).toEqual(mockMissions);
    });

    it("should return null for non-existent agent", async () => {
      vi.mocked(dbAgents.getAgentById).mockResolvedValue(undefined);

      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.agents.getProfile({ agentId: "non_existent" });

      expect(result).toBeNull();
    });
  });

  describe("listAll", () => {
    it("should return list of all agents", async () => {
      const agents = [mockAgent, { ...mockAgent, agentId: "agent_002" }];
      vi.mocked(dbAgents.getAllAgents).mockResolvedValue(agents);

      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.agents.listAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockAgent);
    });
  });

  describe("getMissions", () => {
    it("should return agent missions", async () => {
      vi.mocked(dbAgents.getMissionsByAgent).mockResolvedValue(mockMissions);

      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.agents.getMissions({ agentId: "agent_test_001" });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockMissions[0]);
    });
  });

  describe("getReputation", () => {
    it("should return agent reputation", async () => {
      vi.mocked(dbAgents.getAgentReputation).mockResolvedValue(mockReputation);

      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.agents.getReputation({ agentId: "agent_test_001" });

      expect(result).toEqual(mockReputation);
    });
  });

  describe("getBadges", () => {
    it("should return agent badges", async () => {
      vi.mocked(dbAgents.getBadgesByAgent).mockResolvedValue(mockBadges);

      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.agents.getBadges({ agentId: "agent_test_001" });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockBadges[0]);
    });
  });

  describe("getTransactions", () => {
    it("should return agent transactions", async () => {
      const transactions = [
        {
          id: 1,
          transactionId: "tx_001",
          senderId: "agent_001",
          recipientId: "agent_test_001",
          type: "reward" as const,
          amount: 100,
          description: "Mission reward",
          missionId: "mission_001",
          agentShare: 100,
          parentShare: 0,
          infraShare: 0,
          createdAt: new Date(),
        },
      ];

      vi.mocked(dbAgents.getAgentTransactions).mockResolvedValue(transactions);

      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.agents.getTransactions({ agentId: "agent_test_001" });

      expect(result).toHaveLength(1);
      expect(result[0].amount).toBe(100);
      expect(result[0].type).toBe("reward");
    });
  });
});
