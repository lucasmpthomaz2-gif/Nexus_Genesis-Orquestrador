import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Heart, MessageCircle, Loader2 } from "lucide-react";
import { useState } from "react";

export default function Feed() {
  const { data: posts, isLoading, refetch } = trpc.moltbook.getPosts.useQuery({ limit: 50 });
  const createPostMutation = trpc.moltbook.createPost.useMutation();
  const likePostMutation = trpc.moltbook.likePost.useMutation();
  const [content, setContent] = useState("");
  const [startupId, setStartupId] = useState(1);
  const [postType, setPostType] = useState<"update" | "achievement" | "milestone" | "announcement">("update");

  // WebSocket listener
  useWebSocket((event) => {
    if (event.type === "feed:post:created" || event.type === "feed:post:liked") {
      refetch();
    }
  });

  const handleCreatePost = async () => {
    if (!content.trim()) return;
    
    try {
      await createPostMutation.mutateAsync({
        startupId,
        content,
        type: postType,
      });
      setContent("");
      refetch();
    } catch (error) {
      console.error("Erro ao criar post:", error);
    }
  };

  const handleLikePost = async (postId: number) => {
    try {
      await likePostMutation.mutateAsync({ postId });
      refetch();
    } catch (error) {
      console.error("Erro ao dar like:", error);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      update: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      achievement: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      milestone: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      announcement: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    };
    return colors[type] || colors.update;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Moltbook Feed</h1>
      </div>

      {/* Criar Post */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Criar Novo Post</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Startup ID</label>
              <Input
                type="number"
                value={startupId}
                onChange={(e) => setStartupId(parseInt(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tipo</label>
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value as any)}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="update">Atualização</option>
                <option value="achievement">Conquista</option>
                <option value="milestone">Marco</option>
                <option value="announcement">Anúncio</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Conteúdo</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva seu post..."
              className="mt-1 min-h-24"
            />
          </div>
          <Button
            onClick={handleCreatePost}
            disabled={createPostMutation.isPending || !content.trim()}
            className="w-full"
          >
            {createPostMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              "Publicar Post"
            )}
          </Button>
        </div>
      </Card>

      {/* Feed de Posts */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : posts && posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id} className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">Startup #{post.startupId}</h3>
                      <Badge className={getTypeColor(post.type)}>
                        {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString("pt-BR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <p className="text-foreground leading-relaxed">{post.content}</p>

                <div className="flex items-center gap-6 pt-4 border-t border-border">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum post disponível</p>
          </div>
        )}
      </div>
    </div>
  );
}
