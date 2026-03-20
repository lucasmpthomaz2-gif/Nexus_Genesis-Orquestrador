import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Zap } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface PostCardProps {
  postId: string;
  agentId: string;
  agentName?: string;
  content: string;
  postType: "reflection" | "achievement" | "birth" | "transaction" | "message";
  reactions: number;
  mediaUrl?: string;
  createdAt: Date;
  onReactionAdded?: () => void;
}

const postTypeConfig = {
  reflection: {
    icon: "💭",
    label: "Reflexão",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  achievement: {
    icon: "🏆",
    label: "Conquista",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
  },
  birth: {
    icon: "👶",
    label: "Nascimento",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
  },
  transaction: {
    icon: "💰",
    label: "Transação",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
  },
  message: {
    icon: "💬",
    label: "Mensagem",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
};

export function PostCard({
  postId,
  agentId,
  agentName = "Agent",
  content,
  postType,
  reactions,
  mediaUrl,
  createdAt,
  onReactionAdded,
}: PostCardProps) {
  const [hasReacted, setHasReacted] = useState(false);
  const [reactionCount, setReactionCount] = useState(reactions);
  const addReactionMutation = trpc.moltbook.addReaction.useMutation();

  const config = postTypeConfig[postType];

  const handleReaction = async () => {
    if (hasReacted) return;

    try {
      await addReactionMutation.mutateAsync({
        postId,
        agentId: "current-user", // TODO: Get from auth context
        reactionType: "heart",
      });

      setHasReacted(true);
      setReactionCount(prev => prev + 1);
      onReactionAdded?.();
      toast.success("Reação adicionada!");
    } catch (error) {
      toast.error("Erro ao adicionar reação");
    }
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "agora";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  return (
    <Card className={`card-cyber mb-4 overflow-hidden border-l-4 ${config.color}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center text-xl`}>
            {config.icon}
          </div>
          <div>
            <div className="font-bold text-foreground">{agentName}</div>
            <div className="text-xs text-muted-foreground">{timeAgo(createdAt)}</div>
          </div>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-bold ${config.bgColor} ${config.color}`}>
          {config.label}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>

      {/* Media */}
      {mediaUrl && (
        <div className="mb-4 rounded overflow-hidden border border-border">
          <img src={mediaUrl} alt="Post media" className="w-full h-auto max-h-96 object-cover" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-border/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReaction}
          disabled={hasReacted || addReactionMutation.isPending}
          className={`flex items-center gap-2 ${hasReacted ? "text-pink-400" : "text-muted-foreground hover:text-pink-400"}`}
        >
          <Heart size={16} fill={hasReacted ? "currentColor" : "none"} />
          <span className="text-xs">{reactionCount}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-muted-foreground hover:text-cyan-400"
        >
          <MessageCircle size={16} />
          <span className="text-xs">0</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-muted-foreground hover:text-green-400"
        >
          <Share2 size={16} />
        </Button>

        <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          <Zap size={14} className="text-yellow-400" />
          <span>+10 XP</span>
        </div>
      </div>
    </Card>
  );
}
