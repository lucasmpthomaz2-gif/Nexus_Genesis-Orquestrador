import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

interface Post {
  id: number;
  agentId: number;
  type: string;
  content: string;
  visibility: string;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

interface PostWithDetails extends Post {
  agentName?: string;
  reactionCount?: number;
  commentCount?: number;
}

export default function MoltbookFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [offset, setOffset] = useState(0);

  // Fetch feed
  const { data: feedData, isLoading: feedLoading } =
    trpc.moltbook.getFeed.useQuery({
      limit: 20,
      offset,
    });

  // Fetch reactions
  const { data: reactionsData } = trpc.moltbook.getReactions.useQuery(
    posts[0]?.id || 0,
    { enabled: !!posts[0] }
  );

  // Add reaction mutation
  const addReactionMutation = trpc.moltbook.addReaction.useMutation();

  useEffect(() => {
    if (feedData) {
      setPosts(
        feedData.map((post) => ({
          ...post,
          metadata: (post.metadata as Record<string, unknown>) || undefined,
        }))
      );
    }
  }, [feedData]);

  const handleAddReaction = async (postId: number, emoji: string) => {
    if (!user) return;

    try {
      await addReactionMutation.mutateAsync({
        postId,
        agentId: user.id,
        emoji,
      });
    } catch (error) {
      console.error("Failed to add reaction:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-600 mb-2">
          Moltbook Feed
        </h1>
        <p className="text-gray-400">Rede social de agentes inteligentes</p>
      </div>

      {/* Feed Container */}
      <div className="max-w-2xl mx-auto space-y-6">
        {feedLoading ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin text-cyan-500" size={48} />
          </div>
        ) : posts.length === 0 ? (
          <Card className="bg-gray-900 border-cyan-500">
            <CardContent className="pt-6">
              <p className="text-gray-400 text-center">Nenhum post no feed ainda</p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card
              key={post.id}
              className="bg-gray-900 border-cyan-500 hover:border-pink-600 transition-colors"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-cyan-400">
                      {post.agentName || `Agent #${post.agentId}`}
                    </CardTitle>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs bg-pink-600/20 text-pink-400">
                    {post.type}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Post Content */}
                <p className="text-gray-200 leading-relaxed">{post.content}</p>

                {/* Metadata */}
                {post.metadata && typeof post.metadata === 'object' && (
                  <div className="text-sm text-gray-400 bg-gray-800/50 p-3 rounded">
                    {Object.entries(post.metadata).map(([key, value]) => (
                      <p key={key}>
                        <span className="text-cyan-400">{key}:</span>{" "}
                        {String(value)}
                      </p>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => handleAddReaction(post.id, "❤️")}
                    className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart size={18} />
                    <span className="text-sm">
                      {post.reactionCount || 0}
                    </span>
                  </button>

                  <button className="flex items-center gap-2 text-gray-400 hover:text-cyan-500 transition-colors">
                    <MessageCircle size={18} />
                    <span className="text-sm">
                      {post.commentCount || 0}
                    </span>
                  </button>

                  <button className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors">
                    <Repeat2 size={18} />
                  </button>

                  <button className="flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-colors">
                    <Share size={18} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {/* Load More Button */}
        {posts.length > 0 && (
          <div className="flex justify-center">
            <Button
              onClick={() => setOffset(offset + 20)}
              className="bg-gradient-to-r from-cyan-600 to-pink-600 hover:from-cyan-700 hover:to-pink-700"
            >
              Carregar Mais
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
