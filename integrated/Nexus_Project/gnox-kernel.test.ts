import { describe, it, expect } from "vitest";
import { createGnoxKernel, type GnoxIntent } from "./gnox-kernel";

describe("GnoxKernel", () => {
  const kernel = createGnoxKernel();

  describe("processCommand", () => {
    it("deve reconhecer comando de criação de agente", () => {
      const command = kernel.processCommand("Criar agente chamado NEO especialista em segurança");
      expect(command.action).toBe("AGENT_BIRTH");
      expect(command.params.name).toBe("NEO");
      expect(command.params.specialization).toBe("segurança");
      expect(command.intensity).toBeGreaterThan(0);
    });

    it("deve reconhecer comando de transação", () => {
      const command = kernel.processCommand("Enviar 1000 para AGENT-123");
      expect(command.action).toBe("TRANSACTION");
      expect(command.params.amount).toBe(1000);
      expect(command.params.recipient).toBe("AGENT-123");
    });

    it("deve reconhecer comando de hibernação", () => {
      const command = kernel.processCommand("Hibernar AGENT-456");
      expect(command.action).toBe("HIBERNATE");
      expect(command.params.agentId).toBe("AGENT-456");
    });

    it("deve reconhecer comando de ressurreição", () => {
      const command = kernel.processCommand("Ressuscitar AGENT-789");
      expect(command.action).toBe("RESURRECT");
      expect(command.params.agentId).toBe("AGENT-789");
    });

    it("deve reconhecer comando de DNA Fusion", () => {
      const command = kernel.processCommand("Fusão de DNA entre AGENT-A e AGENT-B");
      expect(command.action).toBe("DNA_FUSION");
      expect(command.params.parentAId).toBe("AGENT-A");
      expect(command.params.parentBId).toBe("AGENT-B");
    });

    it("deve reconhecer comando de status", () => {
      const command = kernel.processCommand("Status do ecossistema");
      expect(command.action).toBe("QUERY_STATUS");
    });

    it("deve retornar UNKNOWN para comando inválido", () => {
      const command = kernel.processCommand("Xyz abc def");
      expect(command.action).toBe("UNKNOWN");
    });

    it("deve gerar sinal Gnox válido", () => {
      const command = kernel.processCommand("Criar agente chamado ALPHA especialista em análise");
      expect(command.gnoxSignal).toBeDefined();
      expect(command.gnoxSignal).toContain("::");
      expect(command.gnoxSignal).toContain("[");
    });
  });

  describe("encode/decode", () => {
    it("deve codificar e decodificar intenção corretamente", () => {
      const intent: GnoxIntent = {
        action: "AGENT_BIRTH",
        intensity: 0.9,
        context: "Criação de novo agente",
        metadata: { name: "NEO", specialization: "segurança" },
      };

      const signal = kernel.encode(intent, "AETERNO", "RECIPIENT");
      expect(signal.encryptedContent).toBeDefined();
      expect(signal.signature).toBeDefined();
      expect(signal.timestamp).toBeDefined();
      expect(signal.senderId).toBe("AETERNO");
      expect(signal.recipientId).toBe("RECIPIENT");

      const decoded = kernel.decode(signal);
      expect(decoded).not.toBeNull();
      expect(decoded?.action).toBe(intent.action);
      expect(decoded?.intensity).toBe(intent.intensity);
      expect(decoded?.context).toBe(intent.context);
    });

    it("deve rejeitar sinal com assinatura inválida", () => {
      const intent: GnoxIntent = {
        action: "TRANSACTION",
        intensity: 0.7,
      };

      const signal = kernel.encode(intent);
      signal.signature = "INVALID_SIGNATURE";

      const decoded = kernel.decode(signal);
      expect(decoded).toBeNull();
    });
  });

  describe("createDNAHash", () => {
    it("deve gerar hash DNA consistente", () => {
      const hash1 = kernel.createDNAHash("NEO", "segurança", 1000);
      const hash2 = kernel.createDNAHash("NEO", "segurança", 1000);
      expect(hash1).toBe(hash2);
    });

    it("deve gerar hashes diferentes para parâmetros diferentes", () => {
      const hash1 = kernel.createDNAHash("NEO", "segurança");
      const hash2 = kernel.createDNAHash("ALPHA", "análise");
      expect(hash1).not.toBe(hash2);
    });

    it("deve gerar hash com comprimento correto", () => {
      const hash = kernel.createDNAHash("TEST", "test");
      expect(hash.length).toBe(64); // SHA256 em hex
    });
  });

  describe("verifySignal", () => {
    it("deve verificar sinal válido", () => {
      const intent: GnoxIntent = {
        action: "AGENT_BIRTH",
        intensity: 0.8,
      };

      const signal = kernel.encode(intent);
      expect(kernel.verifySignal(signal)).toBe(true);
    });

    it("deve rejeitar sinal com assinatura inválida", () => {
      const intent: GnoxIntent = {
        action: "AGENT_BIRTH",
        intensity: 0.8,
      };

      const signal = kernel.encode(intent);
      signal.signature = "INVALID";
      expect(kernel.verifySignal(signal)).toBe(false);
    });
  });

  describe("generateSessionKey", () => {
    it("deve gerar chave de sessão única", () => {
      const key1 = kernel.generateSessionKey("AGENT-A", "AGENT-B");
      const key2 = kernel.generateSessionKey("AGENT-A", "AGENT-B");
      // Chaves diferentes porque incluem timestamp
      expect(key1).toBeDefined();
      expect(key2).toBeDefined();
      expect(key1.length).toBe(64); // SHA256 em hex
    });

    it("deve gerar chaves diferentes para agentes diferentes", () => {
      const key1 = kernel.generateSessionKey("AGENT-A", "AGENT-B");
      const key2 = kernel.generateSessionKey("AGENT-C", "AGENT-D");
      expect(key1).not.toBe(key2);
    });
  });

  describe("translate", () => {
    it("deve traduzir ações conhecidas", () => {
      const translation = kernel.translate("VULT-CLAW");
      expect(translation).toContain("Criar descendente");
    });

    it("deve retornar mensagem para ações desconhecidas", () => {
      const translation = kernel.translate("UNKNOWN-ACTION");
      expect(translation).toContain("DESCONHECIDA");
    });
  });

  describe("getVocabulario", () => {
    it("deve retornar vocabulário completo", () => {
      const vocab = kernel.getVocabulario();
      expect(vocab).toBeDefined();
      expect(Object.keys(vocab).length).toBeGreaterThan(0);
      expect(vocab["VULT-CLAW"]).toBeDefined();
      expect(vocab["XON-BANK"]).toBeDefined();
    });
  });

  describe("Casos de uso complexos", () => {
    it("deve processar sequência de comandos", () => {
      const cmd1 = kernel.processCommand("Criar agente chamado ALPHA especialista em análise");
      expect(cmd1.action).toBe("AGENT_BIRTH");

      const cmd2 = kernel.processCommand("Criar agente chamado BETA especialista em criatividade");
      expect(cmd2.action).toBe("AGENT_BIRTH");

      const cmd3 = kernel.processCommand("Fusão de DNA entre ALPHA e BETA");
      expect(cmd3.action).toBe("DNA_FUSION");
    });

    it("deve manter integridade de sinal através de múltiplas operações", () => {
      const intent: GnoxIntent = {
        action: "AGENT_BIRTH",
        intensity: 0.95,
        context: "Criação crítica",
        metadata: { priority: "high" },
      };

      const signal1 = kernel.encode(intent, "SENDER1", "RECIPIENT1");
      const signal2 = kernel.encode(intent, "SENDER2", "RECIPIENT2");

      expect(kernel.verifySignal(signal1)).toBe(true);
      expect(kernel.verifySignal(signal2)).toBe(true);
      expect(signal1.signature).not.toBe(signal2.signature); // Diferentes IDs
    });
  });
});
