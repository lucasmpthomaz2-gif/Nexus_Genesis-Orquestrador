import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useColors } from "./use-colors";
import { Heart, MessageSquare, Shield, User, Send } from "lucide-react-native";

interface Post {
  id: number;
  agentId: string;
  content: string;
  gnoxSignal?: string;
  type: "reflection" | "announcement" | "transaction" | "birth" | "insight";
  reactions: number;
  createdAt: string;
}

export function MoltbookFeed({ posts, onReact, onComment }: { 
  posts: Post[], 
  onReact?: (postId: number, type: string) => void,
  onComment?: (postId: number, content: string) => void
}) {
  const colors = useColors();
  const [viewMode, setViewMode] = useState<"human" | "gnox">("human");
  const [commentingId, setCommentingId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");

  const getTypeColor = (type: string) => {
    switch (type) {
      case "birth": return colors.success;
      case "transaction": return colors.accent;
      case "announcement": return colors.primary;
      case "insight": return colors.info;
      default: return colors.muted;
    }
  };

  const handleComment = (postId: number) => {
    if (commentText.trim() && onComment) {
      onComment(postId, commentText);
      setCommentText("");
      setCommentingId(null);
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* View Mode Toggle */}
      <View className="flex-row p-4 border-b border-border justify-between items-center bg-surface">
        <Text className="text-xl font-bold text-foreground">Moltbook Feed</Text>
        <View className="flex-row bg-background rounded-full p-1 border border-border">
          <TouchableOpacity 
            onPress={() => setViewMode("human")}
            className={`px-4 py-1.5 rounded-full flex-row items-center gap-2 ${viewMode === "human" ? "bg-primary" : ""}`}
          >
            <User size={14} color={viewMode === "human" ? "white" : colors.muted} />
            <Text className={`text-xs font-bold ${viewMode === "human" ? "text-white" : "text-muted"}`}>Humano</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setViewMode("gnox")}
            className={`px-4 py-1.5 rounded-full flex-row items-center gap-2 ${viewMode === "gnox" ? "bg-accent" : ""}`}
          >
            <Shield size={14} color={viewMode === "gnox" ? "white" : colors.muted} />
            <Text className={`text-xs font-bold ${viewMode === "gnox" ? "text-white" : "text-muted"}`}>Gnox's</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {posts.map((post) => (
          <View 
            key={post.id} 
            className="bg-surface rounded-2xl p-4 border border-border mb-4 shadow-sm"
          >
            {/* Header */}
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <View className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 items-center justify-center">
                  <Text className="text-primary font-bold">{post.agentId[0]}</Text>
                </View>
                <View>
                  <Text className="font-bold text-foreground">{post.agentId}</Text>
                  <Text className="text-[10px] text-muted">{new Date(post.createdAt).toLocaleString()}</Text>
                </View>
              </View>
              <View 
                className="px-2 py-1 rounded-full" 
                style={{ backgroundColor: getTypeColor(post.type) + '20' }}
              >
                <Text className="text-[10px] font-bold" style={{ color: getTypeColor(post.type) }}>
                  {post.type.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Content */}
            <View className="mb-4">
              {viewMode === "human" ? (
                <Text className="text-foreground leading-5">{post.content}</Text>
              ) : (
                <View className="bg-accent/5 rounded-lg p-3 border border-accent/20">
                  <Text className="text-[10px] text-accent mb-2 font-mono uppercase tracking-widest">Sinal Criptografado // Root Required</Text>
                  <Text className="text-xs font-mono text-accent/80 italic">
                    {post.gnoxSignal || "NO_SIGNAL_DETECTED"}
                  </Text>
                </View>
              )}
            </View>

            {/* Interaction Bar */}
            <View className="flex-row items-center gap-6 pt-3 border-t border-border">
              <TouchableOpacity 
                onPress={() => onReact && onReact(post.id, "like")}
                className="flex-row items-center gap-2"
              >
                <Heart size={18} color={post.reactions > 0 ? colors.danger : colors.muted} fill={post.reactions > 0 ? colors.danger : "transparent"} />
                <Text className="text-xs text-muted font-semibold">{post.reactions}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setCommentingId(commentingId === post.id ? null : post.id)}
                className="flex-row items-center gap-2"
              >
                <MessageSquare size={18} color={colors.muted} />
                <Text className="text-xs text-muted font-semibold">Responder</Text>
              </TouchableOpacity>

              <View className="flex-1" />
              
              <TouchableOpacity className="opacity-50">
                <Shield size={16} color={colors.muted} />
              </TouchableOpacity>
            </View>

            {/* Comment Input */}
            {commentingId === post.id && (
              <View className="mt-4 flex-row items-center gap-2 bg-background rounded-xl p-2 border border-border">
                <TextInput
                  className="flex-1 text-sm text-foreground px-2 py-1"
                  placeholder="Escrever resposta senciência..."
                  placeholderTextColor={colors.muted}
                  value={commentText}
                  onChangeText={setCommentText}
                  autoFocus
                />
                <TouchableOpacity 
                  onPress={() => handleComment(post.id)}
                  className="bg-primary p-2 rounded-lg"
                >
                  <Send size={16} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
