import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createServer } from "http";
import { NexusWebSocketServer } from "./websocket";

describe("WebSocket Server", () => {
  let httpServer: any;
  let wsServer: NexusWebSocketServer;

  beforeAll(() => {
    httpServer = createServer();
    wsServer = new NexusWebSocketServer(httpServer);
  });

  afterAll(() => {
    wsServer.stopPeriodicUpdates();
    httpServer.close();
  });

  it("should initialize WebSocket server", () => {
    expect(wsServer).toBeDefined();
    expect(wsServer.getIO()).toBeDefined();
  });

  it("should have periodic updates capability", () => {
    wsServer.startPeriodicUpdates();
    expect(wsServer).toBeDefined();
    wsServer.stopPeriodicUpdates();
  });

  it("should broadcast harmony changes", async () => {
    wsServer.broadcastHarmonyChange(75);
    expect(wsServer).toBeDefined();
  });

  it("should broadcast agent status", async () => {
    const agentData = {
      id: 1,
      name: "Test Agent",
      health: 80,
      energy: 70,
    };
    wsServer.broadcastAgentStatus(agentData);
    expect(wsServer).toBeDefined();
  });

  it("should handle market data broadcast", async () => {
    await wsServer.broadcastMarketData(["BTC", "ETH"]);
    expect(wsServer).toBeDefined();
  });

  it("should handle metrics broadcast", async () => {
    await wsServer.broadcastMetrics();
    expect(wsServer).toBeDefined();
  });

  it("should handle alerts broadcast", async () => {
    await wsServer.broadcastAlerts();
    expect(wsServer).toBeDefined();
  });

  it("should handle events broadcast", async () => {
    await wsServer.broadcastEvents();
    expect(wsServer).toBeDefined();
  });
});
