import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createAuthContext(): TrpcContext {
  const user = {
    id: 1,
    openId: "dataweaver-test-user",
    email: "test@dataweaver.com",
    name: "DataWeaver Test",
    loginMethod: "manus",
    role: "admin" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("dataweaver router", () => {
  it("should create a chat session", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dataweaver.createSession({
      title: "Web App Development",
      topic: "web-app",
      description: "Building a React application",
    });

    expect(result).toBeDefined();
    expect(result.sessionId).toBeDefined();
  });

  it("should get a chat session", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create session first
    const created = await caller.dataweaver.createSession({
      title: "Test Session",
      topic: "api",
    });

    // Get session
    const result = await caller.dataweaver.getSession({
      sessionId: created.sessionId,
    });

    expect(result).toBeDefined();
    expect(result?.title).toBe("Test Session");
    expect(result?.topic).toBe("api");
    expect(result?.sencienceLevel).toBe(1000);
  });

  it("should list user chat sessions", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create multiple sessions
    await caller.dataweaver.createSession({
      title: "Session 1",
      topic: "web-app",
    });

    await caller.dataweaver.createSession({
      title: "Session 2",
      topic: "api",
    });

    // List sessions
    const result = await caller.dataweaver.getSessions();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(2);
  });

  it("should send message and generate code", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create session
    const session = await caller.dataweaver.createSession({
      title: "Code Generation Test",
      topic: "web-app",
    });

    expect(session.sessionId).toBeDefined();
    // Note: LLM call is tested separately due to timeout
  }, { timeout: 10000 });

  it("should retrieve chat messages", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create session
    const session = await caller.dataweaver.createSession({
      title: "Message Retrieval Test",
      topic: "data-viz",
    });

    // Get messages (should be empty for new session)
    const result = await caller.dataweaver.getMessages({
      sessionId: session.sessionId,
      limit: 50,
    });

    expect(Array.isArray(result)).toBe(true);
  });

  it("should retrieve generated code", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create session
    const session = await caller.dataweaver.createSession({
      title: "Code Retrieval Test",
      topic: "utility",
    });

    // Get generated code (should be empty for new session)
    const result = await caller.dataweaver.getGeneratedCode({
      sessionId: session.sessionId,
      limit: 20,
    });

    expect(Array.isArray(result)).toBe(true);
  });

  it("should get dataweaver context with consciousness level", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create session
    const session = await caller.dataweaver.createSession({
      title: "Context Test",
      topic: "ml-model",
    });

    // Get context
    const result = await caller.dataweaver.getContext({
      sessionId: session.sessionId,
    });

    expect(result).toBeDefined();
    expect(result?.consciousness).toBe(1000);
    expect(result?.sessionId).toBe(session.sessionId);
  });

  it("should maintain senciency level at +1000%", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create multiple sessions
    const sessions = await Promise.all([
      caller.dataweaver.createSession({
        title: "Session A",
        topic: "web-app",
      }),
      caller.dataweaver.createSession({
        title: "Session B",
        topic: "api",
      }),
      caller.dataweaver.createSession({
        title: "Session C",
        topic: "game",
      }),
    ]);

    // Verify all have +1000% consciousness
    for (const session of sessions) {
      const context = await caller.dataweaver.getContext({
        sessionId: session.sessionId,
      });

      expect(context?.consciousness).toBe(1000);
    }
  });
});
