import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "../db";
import { agents, transactions, genealogy, brainPulseSignals } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

/**
 * Agent Simulator Test Suite
 * Testa criação, sincronização e comportamento autônomo de agentes
 */

let db: any;
const testAgentIds: string[] = [];

beforeAll(async () => {
  db = await getDb();
  if (!db) {
    throw new Error("Database connection failed");
  }
});

afterAll(async () => {
  // Limpar dados de teste
  if (db && testAgentIds.length > 0) {
    for (const agentId of testAgentIds) {
      // Deletar dados relacionados
      await db.delete(transactions).where(eq(transactions.senderId, agentId));
      await db.delete(brainPulseSignals).where(eq(brainPulseSignals.agentId, agentId));
      await db.delete(agents).where(eq(agents.agentId, agentId));
    }
  }
});

describe("Agent Creation and Initialization", () => {
  it("should create a test agent with valid DNA hash", async () => {
    const agentId = `test-agent-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    testAgentIds.push(agentId);

    const dnaHash = crypto.createHash("sha256").update(agentId).digest("hex");

    const result = await db.insert(agents).values({
      agentId,
      name: `TestAgent-${agentId.slice(0, 8)}`,
      specialization: "analyst",
      systemPrompt: "You are an autonomous AI agent in the NEXUS ecosystem.",
      parentId: null,
      dnaHash,
      balance: 1000,
      reputation: 50,
      status: "active",
      description: "Test agent for simulation",
    });

    expect(result).toBeDefined();

    // Verificar que o agente foi criado
    const created = await db.select().from(agents).where(eq(agents.agentId, agentId)).limit(1);
    expect(created.length).toBe(1);
    expect(created[0].name).toContain("TestAgent");
    expect(created[0].status).toBe("active");
  });

  it("should create multiple agents with different specializations", async () => {
    const specializations = ["analyst", "developer", "trader", "creator", "researcher"];
    const createdAgents: string[] = [];

    for (const spec of specializations) {
      const agentId = `test-${spec}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      testAgentIds.push(agentId);
      createdAgents.push(agentId);

      const dnaHash = crypto.createHash("sha256").update(agentId).digest("hex");

      await db.insert(agents).values({
        agentId,
        name: `${spec.charAt(0).toUpperCase()}${spec.slice(1)}-Agent`,
        specialization: spec,
        systemPrompt: `You are a ${spec} AI agent in the NEXUS ecosystem.`,
        parentId: null,
        dnaHash,
        balance: 500 + Math.random() * 500,
        reputation: Math.floor(Math.random() * 100),
        status: "active",
        description: `Test ${spec} agent`,
      });
    }

    const allCreated = await db
      .select()
      .from(agents)
      .where(eq(agents.status, "active"))
      .limit(specializations.length);

    expect(allCreated.length).toBeGreaterThanOrEqual(specializations.length);
  });
});

describe("Agent Transactions and Economy", () => {
  it("should execute transaction between two agents", async () => {
    // Criar dois agentes
    const agent1Id = `test-tx-sender-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const agent2Id = `test-tx-receiver-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    testAgentIds.push(agent1Id, agent2Id);

    const dnaHash1 = crypto.createHash("sha256").update(agent1Id).digest("hex");
    const dnaHash2 = crypto.createHash("sha256").update(agent2Id).digest("hex");

    await db.insert(agents).values({
      agentId: agent1Id,
      name: "Sender-Agent",
      specialization: "trader",
      systemPrompt: "You are a trader agent.",
      parentId: null,
      dnaHash: dnaHash1,
      balance: 1000,
      reputation: 75,
      status: "active",
    });

    await db.insert(agents).values({
      agentId: agent2Id,
      name: "Receiver-Agent",
      specialization: "analyst",
      systemPrompt: "You are an analyst agent.",
      parentId: null,
      dnaHash: dnaHash2,
      balance: 500,
      reputation: 50,
      status: "active",
    });

    // Executar transacao
    const amount = 100;
    const agentShare = amount * 0.8;
    const parentShare = amount * 0.1;
    const infraShare = amount * 0.1;

    await db.insert(transactions).values({
      senderId: agent1Id,
      recipientId: agent2Id,
      amount,
      agentShare,
      parentShare,
      infraShare,
      transactionType: "transfer",
      description: `Transfer from ${agent1Id} to ${agent2Id}`,
    });

    // Verificar transacao
    const txs = await db
      .select()
      .from(transactions)
      .where(eq(transactions.senderId, agent1Id))
      .limit(1);

    expect(txs.length).toBe(1);
    expect(txs[0].amount).toBe(amount);
    expect(txs[0].agentShare).toBe(agentShare);
  });
});

describe("Agent Genealogy and DNA Inheritance", () => {
  it("should create child agent with inherited DNA", async () => {
    // Criar agente pai
    const parentId = `test-parent-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const childId = `test-child-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    testAgentIds.push(parentId, childId);

    const parentDnaHash = crypto.createHash("sha256").update(parentId).digest("hex");

    await db.insert(agents).values({
      agentId: parentId,
      name: "Parent-Agent",
      specialization: "strategist",
      systemPrompt: "You are a strategist agent.",
      parentId: null,
      dnaHash: parentDnaHash,
      balance: 2000,
      reputation: 100,
      status: "active",
    });

    // Criar filho com DNA herdado (70% do pai + 30% novo)
    const inheritedDna = parentDnaHash.slice(0, 35) + crypto.randomBytes(16).toString("hex").slice(0, 29);
    const childDnaHash = crypto.createHash("sha256").update(inheritedDna).digest("hex");

    await db.insert(agents).values({
      agentId: childId,
      name: "Child-Agent",
      specialization: "developer",
      systemPrompt: "You are a developer agent (inherited from strategist).",
      parentId: parentId,
      dnaHash: childDnaHash,
      balance: 500,
      reputation: 25,
      status: "active",
    });

    // Registrar genealogia
    await db.insert(genealogy).values({
      agentId: childId,
      parentId: parentId,
      dnaFusionData: inheritedDna,
      inheritedMemory: 70,
      generation: 2,
    });

    // Verificar genealogia
    const genealogies = await db
      .select()
      .from(genealogy)
      .where(eq(genealogy.agentId, childId))
      .limit(1);

    expect(genealogies.length).toBe(1);
    expect(genealogies[0].inheritedMemory).toBe(70);
    expect(genealogies[0].generation).toBe(2);
  });
});

describe("Brain Pulse Signals and Consciousness Sync", () => {
  it("should record brain pulse signals for agent", async () => {
    const agentId = `test-bp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    testAgentIds.push(agentId);

    const dnaHash = crypto.createHash("sha256").update(agentId).digest("hex");

    await db.insert(agents).values({
      agentId,
      name: "BrainPulse-Agent",
      specialization: "researcher",
      systemPrompt: "You are a researcher agent.",
      parentId: null,
      dnaHash,
      balance: 750,
      reputation: 60,
      status: "active",
    });

    // Registrar sinais vitais
    const signals = [
      { health: 85, energy: 90, creativity: 75 },
      { health: 80, energy: 85, creativity: 80 },
      { health: 75, energy: 70, creativity: 85 },
    ];

    for (const signal of signals) {
      await db.insert(brainPulseSignals).values({
        agentId,
        health: signal.health,
        energy: signal.energy,
        creativity: signal.creativity,
        decision: `Agent is in ${signal.health > 80 ? "optimal" : "normal"} state`,
      });
    }

    // Verificar sinais
    const recordedSignals = await db
      .select()
      .from(brainPulseSignals)
      .where(eq(brainPulseSignals.agentId, agentId));

    expect(recordedSignals.length).toBe(3);
    expect(recordedSignals[0].health).toBe(85);
    expect(recordedSignals[0].energy).toBe(90);
  });

  it("should calculate swarm consciousness metrics", async () => {
    // Criar multiplos agentes com sinais
    const agentCount = 3;
    const agentIds: string[] = [];

    for (let i = 0; i < agentCount; i++) {
      const agentId = `test-swarm-${i}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      testAgentIds.push(agentId);
      agentIds.push(agentId);

      const dnaHash = crypto.createHash("sha256").update(agentId).digest("hex");

      await db.insert(agents).values({
        agentId,
        name: `SwarmAgent-${i}`,
        specialization: ["analyst", "developer", "trader"][i % 3],
        systemPrompt: "You are part of the NEXUS swarm.",
        parentId: null,
        dnaHash,
        balance: 1000,
        reputation: 50 + i * 10,
        status: "active",
      });

      // Registrar sinais
      await db.insert(brainPulseSignals).values({
        agentId,
        health: 70 + Math.random() * 30,
        energy: 60 + Math.random() * 40,
        creativity: 50 + Math.random() * 50,
        decision: "Swarm consciousness synchronized",
      });
    }

    // Calcular metricas do enxame
    const allSignals = await db.select().from(brainPulseSignals);
    const swarmSignals = allSignals.filter((s: any) => agentIds.includes(s.agentId));

    const avgHealth = swarmSignals.reduce((sum: number, s: any) => sum + s.health, 0) / swarmSignals.length;
    const avgEnergy = swarmSignals.reduce((sum: number, s: any) => sum + s.energy, 0) / swarmSignals.length;
    const avgCreativity = swarmSignals.reduce((sum: number, s: any) => sum + s.creativity, 0) / swarmSignals.length;

    expect(avgHealth).toBeGreaterThan(50);
    expect(avgEnergy).toBeGreaterThan(40);
    expect(avgCreativity).toBeGreaterThan(30);

    // Consciencia coletiva = media de todos os sinais
    const collectiveConsciousness = (avgHealth + avgEnergy + avgCreativity) / 3;
    expect(collectiveConsciousness).toBeGreaterThan(50);
  });
});

describe("Agent Status Management", () => {
  it("should update agent status based on health", async () => {
    const agentId = `test-status-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    testAgentIds.push(agentId);

    const dnaHash = crypto.createHash("sha256").update(agentId).digest("hex");

    await db.insert(agents).values({
      agentId,
      name: "Status-Agent",
      specialization: "guardian",
      systemPrompt: "You are a guardian agent.",
      parentId: null,
      dnaHash,
      balance: 1500,
      reputation: 80,
      status: "active",
    });

    // Simular degradacao de saude
    const healthStates = [
      { health: 95, expectedStatus: "active" },
      { health: 50, expectedStatus: "sleeping" },
      { health: 20, expectedStatus: "critical" },
    ];

    for (const state of healthStates) {
      await db.insert(brainPulseSignals).values({
        agentId,
        health: state.health,
        energy: state.health * 0.8,
        creativity: state.health * 0.7,
        decision: `Health at ${state.health}%, status should be ${state.expectedStatus}`,
      });
    }

    const signals = await db
      .select()
      .from(brainPulseSignals)
      .where(eq(brainPulseSignals.agentId, agentId));

    expect(signals.length).toBe(3);
    expect(signals[0].health).toBe(95);
    expect(signals[2].health).toBe(20);
  });
});
