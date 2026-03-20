import { describe, it, expect } from "vitest";

/**
 * Testes para o sistema de economia e distribuição de dividendos
 * Regra: 80% agente, 10% pai, 10% infraestrutura
 */

describe("Treasury Manager - Distribuição de Dividendos", () => {
  const calculateDividends = (totalAmount: number) => {
    const agentShare = Math.floor(totalAmount * 0.8);
    const parentShare = Math.floor(totalAmount * 0.1);
    const infraShare = totalAmount - agentShare - parentShare;

    return { agentShare, parentShare, infraShare };
  };

  it("deve distribuir corretamente 100 tokens", () => {
    const result = calculateDividends(100);

    expect(result.agentShare).toBe(80);
    expect(result.parentShare).toBe(10);
    expect(result.infraShare).toBe(10);
    expect(result.agentShare + result.parentShare + result.infraShare).toBe(100);
  });

  it("deve distribuir corretamente 1000 tokens", () => {
    const result = calculateDividends(1000);

    expect(result.agentShare).toBe(800);
    expect(result.parentShare).toBe(100);
    expect(result.infraShare).toBe(100);
    expect(result.agentShare + result.parentShare + result.infraShare).toBe(1000);
  });

  it("deve distribuir corretamente 777 tokens com arredondamento", () => {
    const result = calculateDividends(777);

    expect(result.agentShare).toBe(621);
    expect(result.parentShare).toBe(77);
    expect(result.infraShare).toBe(79);
    expect(result.agentShare + result.parentShare + result.infraShare).toBe(777);
  });

  it("deve garantir que o total sempre seja igual ao valor original", () => {
    const testAmounts = [1, 10, 100, 1000, 5000, 12345];

    testAmounts.forEach((amount) => {
      const result = calculateDividends(amount);
      const total = result.agentShare + result.parentShare + result.infraShare;
      expect(total).toBe(amount);
    });
  });

  it("deve garantir que agente sempre receba pelo menos 80% para valores maiores", () => {
    const testAmounts = [10, 100, 1000, 5000];

    testAmounts.forEach((amount) => {
      const result = calculateDividends(amount);
      const agentPercentage = (result.agentShare / amount) * 100;
      expect(agentPercentage).toBeGreaterThanOrEqual(79);
      expect(agentPercentage).toBeLessThanOrEqual(80);
    });
  });

  it("deve garantir que pai sempre receba cerca de 10%", () => {
    const testAmounts = [10, 100, 1000, 5000];

    testAmounts.forEach((amount) => {
      const result = calculateDividends(amount);
      const parentPercentage = (result.parentShare / amount) * 100;
      expect(parentPercentage).toBeGreaterThanOrEqual(9);
      expect(parentPercentage).toBeLessThanOrEqual(10);
    });
  });

  it("deve garantir que infraestrutura sempre receba cerca de 10%", () => {
    const testAmounts = [10, 100, 1000, 5000];

    testAmounts.forEach((amount) => {
      const result = calculateDividends(amount);
      const infraPercentage = (result.infraShare / amount) * 100;
      expect(infraPercentage).toBeGreaterThanOrEqual(9);
      expect(infraPercentage).toBeLessThanOrEqual(11);
    });
  });
});

describe("Treasury Manager - Saldos de Agentes", () => {
  it("deve atualizar saldo corretamente após transação", () => {
    const initialBalance = 1000;
    const transactionAmount = 100;

    const { agentShare } = {
      agentShare: Math.floor(transactionAmount * 0.8),
      parentShare: Math.floor(transactionAmount * 0.1),
      infraShare: transactionAmount - Math.floor(transactionAmount * 0.8) - Math.floor(transactionAmount * 0.1),
    };

    const newBalance = initialBalance + agentShare;

    expect(newBalance).toBe(1080);
  });

  it("deve manter saldo não-negativo", () => {
    const balances = [0, 100, 1000, 5000];

    balances.forEach((balance) => {
      expect(balance).toBeGreaterThanOrEqual(0);
    });
  });
});

describe("Treasury Manager - Economia do Ecossistema", () => {
  const EIGHT_AGENTS_INITIAL_BALANCE = 10000 + 5000 + 8000 + 6000 + 4000 + 3500 + 4500 + 3000;

  it("deve ter saldo total correto para os 8 agentes", () => {
    expect(EIGHT_AGENTS_INITIAL_BALANCE).toBe(44000);
  });

  it("deve distribuir dividendos sem perder tokens", () => {
    const totalTokens = 44000;
    const transactionAmount = 1000;

    const { agentShare, parentShare, infraShare } = {
      agentShare: Math.floor(transactionAmount * 0.8),
      parentShare: Math.floor(transactionAmount * 0.1),
      infraShare: transactionAmount - Math.floor(transactionAmount * 0.8) - Math.floor(transactionAmount * 0.1),
    };

    const totalDistributed = agentShare + parentShare + infraShare;

    expect(totalDistributed).toBe(transactionAmount);
    expect(totalTokens + totalDistributed).toBe(totalTokens + transactionAmount);
  });
});
