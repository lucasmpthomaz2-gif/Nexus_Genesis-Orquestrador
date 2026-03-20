import { describe, expect, it } from "vitest";
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const GNOX_ALGORITHM = "aes-256-cbc";
const GNOX_KEY_LENGTH = 32;
const GNOX_IV_LENGTH = 16;

/**
 * Gerar chave de criptografia a partir de uma senha
 */
function deriveKey(password: string): Buffer {
  return scryptSync(password, "gnox_salt", GNOX_KEY_LENGTH);
}

/**
 * Criptografar mensagem com AES-256-CBC
 */
function encryptGnoxMessage(content: string, key: Buffer): string {
  const iv = randomBytes(GNOX_IV_LENGTH);
  const cipher = createCipheriv(GNOX_ALGORITHM, key, iv);
  let encrypted = cipher.update(content, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

/**
 * Descriptografar mensagem com AES-256-CBC
 */
function decryptGnoxMessage(encryptedData: string, key: Buffer): string {
  const [ivHex, encrypted] = encryptedData.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = createDecipheriv(GNOX_ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

/**
 * Testes para validar criptografia Gnox's
 */
describe("Gnox's Encryption", () => {
  it("should encrypt and decrypt message correctly", () => {
    const message = "Secret message from Agent Alpha";
    const password = "gnox_root_key_123";
    const key = deriveKey(password);

    const encrypted = encryptGnoxMessage(message, key);
    const decrypted = decryptGnoxMessage(encrypted, key);

    expect(decrypted).toBe(message);
  });

  it("should produce different ciphertext for same message (due to random IV)", () => {
    const message = "Same message";
    const password = "gnox_key";
    const key = deriveKey(password);

    const encrypted1 = encryptGnoxMessage(message, key);
    const encrypted2 = encryptGnoxMessage(message, key);

    expect(encrypted1).not.toBe(encrypted2);
  });

  it("should fail to decrypt with wrong key", () => {
    const message = "Confidential data";
    const correctPassword = "correct_password";
    const wrongPassword = "wrong_password";

    const correctKey = deriveKey(correctPassword);
    const wrongKey = deriveKey(wrongPassword);

    const encrypted = encryptGnoxMessage(message, correctKey);

    expect(() => {
      decryptGnoxMessage(encrypted, wrongKey);
    }).toThrow();
  });

  it("should handle long messages", () => {
    const longMessage = "A".repeat(10000);
    const password = "gnox_key";
    const key = deriveKey(password);

    const encrypted = encryptGnoxMessage(longMessage, key);
    const decrypted = decryptGnoxMessage(encrypted, key);

    expect(decrypted).toBe(longMessage);
  });

  it("should handle special characters", () => {
    const message = "Special chars: !@#$%^&*()_+-=[]{}|;:',.<>?/~`";
    const password = "gnox_key";
    const key = deriveKey(password);

    const encrypted = encryptGnoxMessage(message, key);
    const decrypted = decryptGnoxMessage(encrypted, key);

    expect(decrypted).toBe(message);
  });

  it("should handle unicode characters", () => {
    const message = "Unicode: 你好世界 🚀 مرحبا بالعالم";
    const password = "gnox_key";
    const key = deriveKey(password);

    const encrypted = encryptGnoxMessage(message, key);
    const decrypted = decryptGnoxMessage(encrypted, key);

    expect(decrypted).toBe(message);
  });

  it("should generate consistent key from same password", () => {
    const password = "consistent_password";
    const key1 = deriveKey(password);
    const key2 = deriveKey(password);

    expect(key1.toString("hex")).toBe(key2.toString("hex"));
  });

  it("should generate different keys from different passwords", () => {
    const password1 = "password_one";
    const password2 = "password_two";

    const key1 = deriveKey(password1);
    const key2 = deriveKey(password2);

    expect(key1.toString("hex")).not.toBe(key2.toString("hex"));
  });

  it("should handle empty message", () => {
    const message = "";
    const password = "gnox_key";
    const key = deriveKey(password);

    const encrypted = encryptGnoxMessage(message, key);
    const decrypted = decryptGnoxMessage(encrypted, key);

    expect(decrypted).toBe(message);
  });

  it("should preserve message format after encryption/decryption", () => {
    const message = JSON.stringify({
      agentId: "agent_001",
      content: "Test message",
      timestamp: "2026-02-12T20:50:00Z",
    });
    const password = "gnox_key";
    const key = deriveKey(password);

    const encrypted = encryptGnoxMessage(message, key);
    const decrypted = decryptGnoxMessage(encrypted, key);
    const parsed = JSON.parse(decrypted);

    expect(parsed.agentId).toBe("agent_001");
    expect(parsed.content).toBe("Test message");
  });
});
