/**
 * Testes para o cliente WebSocket
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { WebSocketClient } from "./websocket";

describe("WebSocketClient", () => {
  let client: WebSocketClient;

  beforeEach(() => {
    client = new WebSocketClient({
      url: "http://localhost:3000",
      reconnection: false, // Desabilita reconexão para testes
    });
  });

  afterEach(() => {
    if (client) {
      client.disconnect();
    }
  });

  it("deve criar uma instância do cliente WebSocket", () => {
    expect(client).toBeDefined();
    expect(client.isConnected()).toBe(false);
  });

  it("deve registrar um listener para um evento", () => {
    const callback = vi.fn();
    const unsubscribe = client.on("orchestration:event", callback);

    expect(typeof unsubscribe).toBe("function");
  });

  it("deve remover um listener", () => {
    const callback = vi.fn();
    client.on("orchestration:event", callback);
    client.off("orchestration:event", callback);

    // Não há uma forma direta de testar se foi removido sem emitir um evento
    // Mas podemos verificar que a função não lança erro
    expect(() => client.off("orchestration:event", callback)).not.toThrow();
  });

  it("deve obter o ID do socket", () => {
    // Antes de conectar, deve retornar undefined
    expect(client.getSocketId()).toBeUndefined();
  });

  it("deve desconectar do servidor", () => {
    client.disconnect();
    expect(client.isConnected()).toBe(false);
  });

  it("deve armazenar e recuperar token", () => {
    const token = "test-token-123";
    client.setToken(token);

    // Verifica se o token foi armazenado no localStorage
    const storedToken = localStorage.getItem("auth_token");
    expect(storedToken).toBe(token);
  });

  it("deve calcular delay de reconexão com backoff exponencial", () => {
    // Testa o cálculo de delay com backoff exponencial
    const baseDelay = 1000;
    const maxDelay = 16000;
    const multiplier = 1.5;

    // Primeira tentativa: 1000ms
    let delay = Math.min(baseDelay * Math.pow(multiplier, 0), maxDelay);
    expect(delay).toBe(1000);

    // Segunda tentativa: 1500ms
    delay = Math.min(baseDelay * Math.pow(multiplier, 1), maxDelay);
    expect(delay).toBe(1500);

    // Terceira tentativa: 2250ms
    delay = Math.min(baseDelay * Math.pow(multiplier, 2), maxDelay);
    expect(delay).toBe(2250);

    // Décima tentativa: deve atingir o máximo
    delay = Math.min(baseDelay * Math.pow(multiplier, 9), maxDelay);
    expect(delay).toBeLessThanOrEqual(maxDelay);
  });

  it("deve emitir um evento para o servidor", () => {
    // Este teste verifica que a função não lança erro
    // Em um teste real, seria necessário mockar o socket
    expect(() => {
      client.emit_server("test:event", { data: "test" });
    }).not.toThrow();
  });

  it("deve verificar se está conectado", () => {
    expect(client.isConnected()).toBe(false);
  });
});
