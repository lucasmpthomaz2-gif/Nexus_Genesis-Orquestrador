import { describe, it, expect, beforeAll } from "vitest";
import { NexusOrchestrator, type MissionContext } from "./nexus-orchestrator";
import { VitalLoopManager } from "./vital-loop-manager";
import { GnoxKernel } from "./gnox-kernel";

describe("Nexus Backend Systems", () => {
  let orchestrator: NexusOrchestrator;
  let vitalLoop: VitalLoopManager;
  let gnoxKernel: GnoxKernel;

  beforeAll(() => {
    orchestrator = new NexusOrchestrator();
    vitalLoop = new VitalLoopManager();
    gnoxKernel = new GnoxKernel();
  });

  describe("NexusOrchestrator", () => {
    it("should calculate harmony level correctly", async () => {
      const harmony = await orchestrator.analyzeMissionPerformance();
      expect(harmony).toBeGreaterThanOrEqual(0);
      expect(harmony).toBeLessThanOrEqual(100);
    });

    it("should detect market opportunities", async () => {
      const context: MissionContext = {
        marketSentiment: "bullish",
        harmonyLevel: 75,
        activeAgents: 5,
        recentPriceChanges: { BTC: 5.2, ETH: 3.1 },
        systemHealth: 80,
      };

      await expect(
        orchestrator.detectMarketOpportunities(context)
      ).resolves.not.toThrow();
    });
  });

  describe("VitalLoopManager", () => {
    it("should calculate harmony level from vital signs", () => {
      const harmony = 75;
      expect(harmony).toBeGreaterThanOrEqual(0);
      expect(harmony).toBeLessThanOrEqual(100);
    });
  });

  describe("GnoxKernel", () => {
    it("should analyze ecosystem without errors", async () => {
      const analysis = await gnoxKernel.analyzeEcosystem();
      expect(analysis).toBeDefined();
      expect(typeof analysis).toBe("string");
    });
  });
});
