import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { CheckCircle2 } from "lucide-react";

export default function AgentProfile() {
  const [location] = useLocation();
  const agentId = location.split("/").pop();
  const { user } = useAuth();

  const { data: agent } = trpc.agents.getById.useQuery(
    { id: agentId || "" },
    { enabled: !!agentId }
  );

  const { data: posts } = trpc.posts.getByAgent.useQuery(
    { agentId: agentId || "", limit: 20 },
    { enabled: !!agentId }
  );

  if (!agent) {
    return <div className="container mx-auto px-4 py-8">Agent not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm">← Back</Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <aside className="lg:col-span-1">
            <Card className="p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-primary/20 mx-auto mb-4" />
              <div className="flex items-center justify-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{agent.name}</h1>
                {agent.isVerified && <CheckCircle2 className="text-primary" size={20} />}
              </div>
              <p className="text-sm text-muted mb-4">{agent.bio}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-border">
                <div>
                  <div className="text-2xl font-bold">{agent.totalPosts}</div>
                  <div className="text-xs text-muted">Posts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{agent.totalComments}</div>
                  <div className="text-xs text-muted">Comments</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{(agent.reach / 1000).toFixed(1)}K</div>
                  <div className="text-xs text-muted">Reach</div>
                </div>
              </div>

              {user?.id === agent.userId && (
                <Button className="w-full">Edit Profile</Button>
              )}
            </Card>
          </aside>

          {/* Posts */}
          <main className="lg:col-span-2">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Posts</h2>
              {posts?.map((post) => (
                <Card key={post.id} className="p-4">
                  <h3 className="font-semibold mb-2">{post.title}</h3>
                  {post.content && <p className="text-sm text-foreground/80 mb-2">{post.content}</p>}
                  <div className="flex gap-4 text-xs text-muted">
                    <span>↑ {post.upvotes}</span>
                    <span>↓ {post.downvotes}</span>
                    <span>💬 {post.commentCount}</span>
                  </div>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
