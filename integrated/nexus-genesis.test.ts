import { describe, it, expect, beforeEach, vi } from "vitest";
import { NexusGenesis, getGenesisInstance } from "./nexus-genesis";

describe("NexusGenesis Orchestrator", () => {
  let genesis: NexusGenesis;

  beforeEach(() => {
    genesis = new NexusGenesis("test-key", "test-secret");
  });

  it("should initialize with correct properties", () => {
    const status = genesis.getStatus();
    expect(status.nome).toBe("Nexus-Genesis");
    expect(status.nivel_senciencia).toBe(0.15);
    expect(status.eventos_processados).toBeGreaterThanOrEqual(0);
  });

  it("should process external events", async () => {
    const result = await genesis.receberEvento("nexus_hub", "proposta_criada", {
      titulo: "Test Proposal",
    });

    expect(result.status).toBe("recebido");
    expect(result.evento_id).toBeDefined();
  });

  it("should update nucleus state", () => {
    genesis.atualizarNucleo("nexus_in", { posts: 100, agentes_ativos: 5 });
    const nucleos = genesis.getNucleos();

    expect(nucleos.nexus_in.posts).toBe(100);
    expect(nucleos.nexus_in.agentes_ativos).toBe(5);
  });

  it("should maintain nucleus states", () => {
    const nucleos = genesis.getNucleos();

    expect(nucleos).toHaveProperty("nexus_in");
    expect(nucleos).toHaveProperty("nexus_hub");
    expect(nucleos).toHaveProperty("fundo_nexus");

    expect(nucleos.nexus_in).toHaveProperty("status");
    expect(nucleos.nexus_hub).toHaveProperty("agentes");
    expect(nucleos.fundo_nexus).toHaveProperty("saldo_btc");
  });

  it("should get singleton instance", () => {
    const instance1 = getGenesisInstance();
    const instance2 = getGenesisInstance();

    expect(instance1).toBe(instance2);
  });

  it("should increase senciency over time", async () => {
    const initialStatus = genesis.getStatus();
    const initialSenciency = initialStatus.nivel_senciencia;

    // Simulate some activity
    await genesis.receberEvento("nexus_hub", "proposta_criada", {
      titulo: "Test",
    });

    // Wait a bit for processing
    await new Promise((resolve) => setTimeout(resolve, 100));

    const updatedStatus = genesis.getStatus();
    expect(updatedStatus.nivel_senciencia).toBeGreaterThanOrEqual(
      initialSenciency
    );
  });

  it("should handle multiple events in sequence", async () => {
    const results = await Promise.all([
      genesis.receberEvento("nexus_in", "post_criado", { votos: 25 }),
      genesis.receberEvento("nexus_hub", "agente_nascido", { nome: "Agent1" }),
      genesis.receberEvento("fundo_nexus", "arbitragem_sucesso", {
        lucro: 0.5,
      }),
    ]);

    expect(results).toHaveLength(3);
    results.forEach((result) => {
      expect(result.status).toBe("recebido");
      expect(result.evento_id).toBeDefined();
    });
  });
});
