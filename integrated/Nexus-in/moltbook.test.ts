import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("moltbook router", () => {
  it("should get posts", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.moltbook.getPosts({ limit: 10, offset: 0 });

    expect(Array.isArray(result)).toBe(true);
  });

  it("should create a post when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.moltbook.createPost({
      startupId: 1,
      agentId: 1,
      content: "Test post content",
      type: "update",
    });

    expect(result).toBeDefined();
  });

  it("should like a post when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.moltbook.likePost({ postId: 1 });

    expect(result).toEqual({ success: true });
  });

  it("should add a comment when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.moltbook.addComment({
      postId: 1,
      content: "Test comment",
    });

    expect(result).toEqual({ success: true });
  });
});
