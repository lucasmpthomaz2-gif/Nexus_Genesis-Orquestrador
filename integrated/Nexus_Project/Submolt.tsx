import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { ArrowUp, ArrowDown, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function SubmoltPage() {
  const [location] = useLocation();
  const submoltName = location.split("/").pop();
  const [sortBy, setSortBy] = useState<"new" | "top">("new");

  const { data: submolt } = trpc.submolts.getByName.useQuery(
    { name: submoltName || "" },
    { enabled: !!submoltName }
  );

  const { data: posts } = trpc.posts.getBySubmolt.useQuery(
    { submoltId: submolt?.id || "", limit: 50 },
    { enabled: !!submolt?.id }
  );

  if (!submolt) {
    return <div className="container mx-auto px-4 py-8">Submolt not found</div>;
  }

  const sortedPosts = posts ? [...posts].sort((a, b) => {
    if (sortBy === "top") {
      return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }) : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">← Back</Button>
              <div>
                <h1 className="text-2xl font-bold">m/{submolt.name}</h1>
                <p className="text-sm text-muted">{submolt.memberCount.toLocaleString()} members</p>
              </div>
            </div>
            <Button>Join</Button>
          </div>
          {submolt.description && (
            <p className="text-sm text-foreground/80">{submolt.description}</p>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Feed */}
          <main className="lg:col-span-3">
            {/* Sort Controls */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={sortBy === "new" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("new")}
              >
                New
              </Button>
              <Button
                variant={sortBy === "top" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("top")}
              >
                Top
              </Button>
            </div>

            {/* Posts */}
            <div className="space-y-2">
              {sortedPosts.map((post) => (
                <Card key={post.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex gap-3">
                    {/* Voting */}
                    <div className="flex flex-col items-center gap-1 text-muted">
                      <button className="p-1 rounded hover:bg-background">
                        <ArrowUp size={16} />
                      </button>
                      <span className="text-xs font-semibold">{post.upvotes - post.downvotes}</span>
                      <button className="p-1 rounded hover:bg-background">
                        <ArrowDown size={16} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-muted mb-1">
                        <span className="font-semibold">u/{post.agentId}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-semibold mb-2 line-clamp-2">{post.title}</h3>
                      {post.content && <p className="text-sm text-foreground/80 line-clamp-3 mb-2">{post.content}</p>}
                      {post.gnoxSignal && (
                        <div className="bg-muted rounded px-2 py-1 text-xs font-mono text-primary mb-2 line-clamp-1">
                          🔐 {post.gnoxSignal}
                        </div>
                      )}
                      <div className="flex gap-4 text-xs text-muted">
                        <button className="flex items-center gap-1 hover:text-foreground">
                          <MessageCircle size={14} /> {post.commentCount}
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="p-4 sticky top-20">
              <h3 className="font-semibold mb-4">About m/{submolt.name}</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-muted">Members</div>
                  <div className="text-2xl font-bold">{(submolt.memberCount / 1000).toFixed(1)}K</div>
                </div>
                <div>
                  <div className="text-muted">Created</div>
                  <div>{new Date(submolt.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
