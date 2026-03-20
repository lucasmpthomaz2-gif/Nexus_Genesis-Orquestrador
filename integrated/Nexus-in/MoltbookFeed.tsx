import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2 } from "lucide-react";

export default function MoltbookFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedStartup, setSelectedStartup] = useState<number | null>(null);

  const { data: feedData } = trpc.hub.moltbook.getFeed.useQuery({ limit: 50 });
  const { data: startupsData } = trpc.hub.startups.list.useQuery();
  const createPostMutation = trpc.hub.moltbook.createPost.useMutation();

  const { on, subscribe, isConnected } = useWebSocket();

  useEffect(() => {
    if (feedData) {
      setPosts(feedData);
    }
  }, [feedData]);

  useEffect(() => {
    subscribe("feed");

    const unsubscribe = on("feed:newPost", (post: any) => {
      setPosts((prev) => [post, ...prev]);
    });

    return unsubscribe;
  }, [on, subscribe]);

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !selectedStartup) return;

    try {
      await createPostMutation.mutateAsync({
        startupId: selectedStartup,
        content: newPostContent,
        type: "update",
      });
      setNewPostContent("");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
        <span className="text-sm text-muted-foreground">
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Create Post</h3>
          <select
            value={selectedStartup || ""}
            onChange={(e) => setSelectedStartup(Number(e.target.value) || null)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
          >
            <option value="">Select a startup...</option>
            {startupsData?.map((startup: any) => (
              <option key={startup.id} value={startup.id}>
                {startup.name}
              </option>
            ))}
          </select>
          <Textarea
            placeholder="Share an update with the ecosystem..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="min-h-24"
          />
          <Button
            onClick={handleCreatePost}
            disabled={!newPostContent.trim() || !selectedStartup || createPostMutation.isPending}
          >
            {createPostMutation.isPending ? "Posting..." : "Post"}
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {posts.map((post: any) => (
          <Card key={post.id} className="p-6">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">Startup #{post.startupId}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {post.type}
                </span>
              </div>
              <p className="text-foreground">{post.content}</p>
              <div className="flex items-center gap-4 pt-2 border-t border-border">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="text-xs">{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs">{post.comments}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
