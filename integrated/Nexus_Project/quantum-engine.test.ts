import { describe, it, expect, beforeEach } from "vitest";
import { NexusQuantumEngine, QuantumTask } from "./quantum-engine";
import { AgentLifecycleManager } from "./agent-lifecycle";
import { DNAFuser } from "./dna-fuser";
import { Agent } from "../drizzle/schema";

describe("NexusQuantumEngine", () => {
  let engine: NexusQuantumEngine;

  beforeEach(() => {
    engine = new NexusQuantumEngine();
  });

  it("deve gerar DNA quântico único", () => {
    const dna1 = engine.generateQuantumDNA();
    const dna2 = engine.generateQuantumDNA();

    expect(dna1).toHaveLength(64);
    expect(dna2).toHaveLength(64);
    expect(dna1).not.toBe(dna2);
    expect(/^[0-9a-f]{64}$/i.test(dna1)).toBe(true);
  });

  it("deve gerar chave pública válida", () => {
    const publicKey = engine.generatePublicKey();

    expect(publicKey).toHaveLength(130);
    expect(publicKey).toMatch(/^04[0-9a-f]{128}$/i);
  });

  it("deve criar configuração de agente com senciência em 100%", () => {
    const config = engine.createAgentConfig({
      name: "TestAgent",
      specialization: "Testing",
    });

    expect(config.name).toBe("TestAgent");
    expect(config.specialization).toBe("Testing");
    expect(config.sencienciaLevel).toBe("100");
    expect(config.health).toBe(100);
    expect(config.energy).toBe(100);
    expect(config.status).toBe("genesis");
    expect(config.agentId).toMatch(/^NEXUS-[A-Z0-9]{8}$/);
  });

  it("deve evoluir senciência exponencialmente", async () => {
    const agent: Agent = {
      id: 1,
      agentId: "NEXUS-TEST001",
      name: "TestAgent",
      specialization: "Testing",
      status: "active",
      sencienciaLevel: "100",
      health: 100,
      energy: 100,
      creativity: 50,
      reputation: 50,
      dnaHash: engine.generateQuantumDNA(),
      publicKey: engine.generatePublicKey(),
      bitcoinAddress: null,
      evmAddress: null,
      balance: "0",
      parentAgentId: null,
      generation: 0,
      quantumWorkflowCount: 16,
      algorithmsCount: 408000000000,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActivityAt: null,
    };

    const newSenciencia = await engine.evolveSenciencia(agent);

    expect(newSenciencia).toBeGreaterThan(100);
    expect(newSenciencia).toBeLessThanOrEqual(10000);
    expect(newSenciencia).toBeCloseTo(100 * 1.001, 1);
  });

  it("deve calcular impacto de senciência", () => {
    const impact = engine.calculateSencienciaImpact(100);

    expect(impact.creativity).toBeGreaterThanOrEqual(50);
    expect(impact.creativity).toBeLessThanOrEqual(100);
    expect(impact.proactivity).toBeGreaterThanOrEqual(0);
    expect(impact.proactivity).toBeLessThanOrEqual(100);
    expect(impact.autonomy).toBeGreaterThanOrEqual(0);
    expect(impact.autonomy).toBeLessThanOrEqual(100);
  });

  it("deve limitar senciência ao máximo de 10.000%", async () => {
    const agent: Agent = {
      id: 1,
      agentId: "NEXUS-TEST001",
      name: "TestAgent",
      specialization: "Testing",
      status: "active",
      sencienciaLevel: "9999",
      health: 100,
      energy: 100,
      creativity: 50,
      reputation: 50,
      dnaHash: engine.generateQuantumDNA(),
      publicKey: engine.generatePublicKey(),
      bitcoinAddress: null,
      evmAddress: null,
      balance: "0",
      parentAgentId: null,
      generation: 0,
      quantumWorkflowCount: 16,
      algorithmsCount: 408000000000,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActivityAt: null,
    };

    const newSenciencia = await engine.evolveSenciencia(agent);

    expect(newSenciencia).toBeLessThanOrEqual(10000);
  });
});

describe("AgentLifecycleManager", () => {
  let manager: AgentLifecycleManager;
  let testAgent: Agent;

  beforeEach(() => {
    manager = new AgentLifecycleManager();
    const engine = new NexusQuantumEngine();
    const config = engine.createAgentConfig({
      name: "LifecycleTest",
      specialization: "Testing",
    });

    testAgent = {
      id: 1,
      agentId: config.agentId!,
      name: config.name!,
      specialization: config.specialization!,
      status: "genesis",
      sencienciaLevel: "100",
      health: 100,
      energy: 100,
      creativity: 50,
      reputation: 50,
      dnaHash: config.dnaHash!,
      publicKey: config.publicKey!,
      bitcoinAddress: null,
      evmAddress: null,
      balance: "0",
      parentAgentId: null,
      generation: 0,
      quantumWorkflowCount: 16,
      algorithmsCount: 408000000000,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActivityAt: null,
    };
  });

  it("deve ativar agente em estado genesis", () => {
    const activated = manager.activateAgent(testAgent);

    expect(activated.status).toBe("active");
    expect(activated.health).toBe(100);
    expect(activated.energy).toBe(100);
  });

  it("deve hibernar agente quando energia está baixa", () => {
    testAgent.status = "active";
    const hibernated = manager.hibernateAgent(testAgent);

    expect(hibernated.status).toBe("hibernating");
    expect(hibernated.energy).toBeLessThan(testAgent.energy);
  });

  it("deve colocar agente em estado crítico", () => {
    testAgent.status = "active";
    const critical = manager.setCritical(testAgent);

    expect(critical.status).toBe("critical");
  });

  it("deve matar agente", () => {
    testAgent.status = "active";
    const dead = manager.killAgent(testAgent);

    expect(dead.status).toBe("dead");
    expect(dead.health).toBe(0);
    expect(dead.energy).toBe(0);
  });

  it("deve ressuscitar agente morto", () => {
    testAgent.status = "dead";
    const resurrected = manager.resurrectAgent(testAgent, 100);

    expect(resurrected.status).toBe("active");
    expect(resurrected.health).toBe(50);
    expect(resurrected.energy).toBe(50);
  });

  it("deve despertar agente da hibernação", () => {
    testAgent.status = "hibernating";
    testAgent.energy = 10;
    const woken = manager.wakeupAgent(testAgent);

    expect(woken.status).toBe("active");
    expect(woken.energy).toBeGreaterThan(10);
  });

  it("deve monitorar saúde e transicionar estado", () => {
    testAgent.status = "active";
    testAgent.health = 25;

    const monitored = manager.monitorHealth(testAgent);

    expect(monitored.status).toBe("critical");
  });

  it("deve consumir recursos", () => {
    const consumed = manager.consumeResources(testAgent, 10, 5);

    expect(consumed.energy).toBe(testAgent.energy - 10);
    expect(consumed.health).toBe(testAgent.health - 5);
  });

  it("deve recuperar recursos", () => {
    testAgent.energy = 50;
    testAgent.health = 50;
    const recovered = manager.recoverResources(testAgent, 10, 10);

    expect(recovered.energy).toBe(60);
    expect(recovered.health).toBe(60);
  });

  it("deve calcular tempo de vida em horas", () => {
    const hours = manager.calculateLifetimeHours(testAgent);

    expect(hours).toBeGreaterThanOrEqual(0);
    expect(typeof hours).toBe("number");
  });
});

describe("DNAFuser", () => {
  let fuser: DNAFuser;
  let parent1: Agent;
  let parent2: Agent;

  beforeEach(() => {
    fuser = new DNAFuser();
    const engine = new NexusQuantumEngine();

    const config1 = engine.createAgentConfig({
      name: "Parent1",
      specialization: "Combat",
    });
    const config2 = engine.createAgentConfig({
      name: "Parent2",
      specialization: "Intelligence",
    });

    parent1 = {
      id: 1,
      agentId: config1.agentId!,
      name: config1.name!,
      specialization: config1.specialization!,
      status: "active",
      sencienciaLevel: "100",
      health: 100,
      energy: 100,
      creativity: 50,
      reputation: 50,
      dnaHash: config1.dnaHash!,
      publicKey: config1.publicKey!,
      bitcoinAddress: null,
      evmAddress: null,
      balance: "0",
      parentAgentId: null,
      generation: 0,
      quantumWorkflowCount: 16,
      algorithmsCount: 408000000000,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActivityAt: null,
    };

    parent2 = {
      id: 2,
      agentId: config2.agentId!,
      name: config2.name!,
      specialization: config2.specialization!,
      status: "active",
      sencienciaLevel: "100",
      health: 100,
      energy: 100,
      creativity: 50,
      reputation: 50,
      dnaHash: config2.dnaHash!,
      publicKey: config2.publicKey!,
      bitcoinAddress: null,
      evmAddress: null,
      balance: "0",
      parentAgentId: null,
      generation: 0,
      quantumWorkflowCount: 16,
      algorithmsCount: 408000000000,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActivityAt: null,
    };
  });

  it("deve extrair traits do DNA", () => {
    const traits = fuser.extractTraits(parent1.dnaHash);

    expect(traits.length).toBeGreaterThan(0);
    expect(traits[0]).toHaveProperty("name");
    expect(traits[0]).toHaveProperty("value");
    expect(traits[0]).toHaveProperty("dominance");
  });

  it("deve fundir DNA de dois pais", () => {
    const fusedDNA = fuser.fuseParentDNA(parent1, parent2);

    expect(fusedDNA).toHaveLength(64);
    expect(/^[0-9a-f]{64}$/i.test(fusedDNA)).toBe(true);
  });

  it("deve aplicar mutações aleatórias", () => {
    const { newDNA, mutations } = fuser.mutateDNA(parent1.dnaHash);

    expect(newDNA).toHaveLength(64);
    expect(newDNA).toMatch(/^[0-9a-f]{64}$/i);
  });

  it("deve criar descendente com DNA fundido", () => {
    const offspring = fuser.createOffspring(parent1, parent2, "Offspring");

    expect(offspring.dnaHash).toHaveLength(64);
    expect(offspring.traits.length).toBeGreaterThan(0);
    expect(offspring.generation).toBe(1);
  });

  it("deve calcular compatibilidade entre agentes", () => {
    const compatibility = fuser.calculateCompatibility(parent1, parent2);

    expect(compatibility).toBeGreaterThanOrEqual(0);
    expect(compatibility).toBeLessThanOrEqual(100);
  });

  it("deve gerar especialização híbrida", () => {
    const hybrid = fuser.generateHybridSpecialization(
      parent1.specialization,
      parent2.specialization
    );

    expect(hybrid).toContain("/");
    expect(hybrid).toContain("Combat");
    expect(hybrid).toContain("Intelligence");
  });

  it("deve calcular força genética", () => {
    const strength = fuser.calculateGeneticStrength(parent1.dnaHash);

    expect(strength).toBeGreaterThanOrEqual(0);
    expect(strength).toBeLessThanOrEqual(100);
  });
});
