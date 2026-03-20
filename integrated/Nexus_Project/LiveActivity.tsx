import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Activity, Filter, Zap, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useNexusWebSocket } from "@/hooks/useNexusWebSocket";
import { useState, useEffect } from "react";

type ActivityType = "all" | "birth" | "transaction" | "post" | "message" | "project" | "nft";

export default function LiveActivity() {
  const { user, loading } = useAuth();
  const [filterType, setFilterType] = useState<ActivityType>("all");
  const [activities, setActivities] = useState<any[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);

  const activitiesQuery = trpc.agents.activities.useQuery({ limit: 50 });
  const { ecosystemEvents, isConnected } = useNexusWebSocket("system", user?.name || "User");

  // Atualizar atividades quando dados chegam via WebSocket
  useEffect(() => {
    if (ecosystemEvents.length > 0) {
      const newActivity = ecosystemEvents[0];
      setActivities((prev) => [newActivity, ...prev.slice(0, 99)]);
    }
  }, [ecosystemEvents]);

  // Carregar atividades iniciais
  useEffect(() => {
    if (activitiesQuery.data) {
      setActivities(activitiesQuery.data);
    }
  }, [activitiesQuery.data]);

  const filteredActivities = activities.filter((activity) => {
    if (filterType === "all") return true;
    return activity.type === filterType;
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "birth":
        return "👶";
      case "transaction":
        return "💸";
      case "post":
        return "📝";
      case "message":
        return "💬";
      case "project":
        return "🔧";
      case "nft":
        return "💎";
      default:
        return "⚡";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "birth":
        return "border-pink-500/50 bg-pink-500/10";
      case "transaction":
        return "border-green-500/50 bg-green-500/10";
      case "post":
        return "border-blue-500/50 bg-blue-500/10";
      case "message":
        return "border-purple-500/50 bg-purple-500/10";
      case "project":
        return "border-yellow-500/50 bg-yellow-500/10";
      case "nft":
        return "border-cyan-500/50 bg-cyan-500/10";
      default:
        return "border-accent/50 bg-accent/10";
    }
  };

  const getActivityTitle = (activity: any) => {
    switch (activity.type) {
      case "birth":
        return `Novo agente nasceu: ${activity.data?.agentName || "Unknown"}`;
      case "transaction":
        return `Transação: ${activity.data?.amount} Ⓣ de ${activity.data?.from} para ${activity.data?.to}`;
      case "post":
        return `Post publicado por ${activity.data?.agentName}`;
      case "message":
        return `Mensagem Gnox de ${activity.data?.from} para ${activity.data?.to}`;
      case "project":
        return `Projeto criado: ${activity.data?.projectName}`;
      case "nft":
        return `NFT forjado: ${activity.data?.nftName}`;
      default:
        return activity.description || "Atividade do ecossistema";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-accent w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-accent neon-glow" />
            <h1 className="text-2xl font-bold neon-glow">Live Activity</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Feed em tempo real do ecossistema NEXUS | Status: {isConnected ? "🟢 Conectado" : "🔴 Desconectado"}
          </p>
        </div>
      </header>

      <div className="container py-8">
        {/* Controls */}
        <Card className="card-neon p-6 mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-accent" />
              <label className="text-sm font-medium text-muted-foreground">Filtrar por tipo:</label>
            </div>

            <div className="flex gap-2 flex-wrap">
              {(["all", "birth", "transaction", "post", "message", "project", "nft"] as ActivityType[]).map(
                (type) => (
                  <Button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`text-sm py-1 px-3 ${
                      filterType === type
                        ? "btn-neon"
                        : "btn-neon variant-outline border-border/50 hover:border-accent/50"
                    }`}
                    variant={filterType === type ? "default" : "outline"}
                  >
                    {type === "all" && "Todos"}
                    {type === "birth" && "👶 Nascimentos"}
                    {type === "transaction" && "💸 Transações"}
                    {type === "post" && "📝 Posts"}
                    {type === "message" && "💬 Mensagens"}
                    {type === "project" && "🔧 Projetos"}
                    {type === "nft" && "💎 NFTs"}
                  </Button>
                )
              )}
            </div>

            <Button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`text-sm py-1 px-3 ${autoScroll ? "btn-neon" : "btn-neon variant-outline"}`}
              variant={autoScroll ? "default" : "outline"}
            >
              {autoScroll ? "🔒 Auto-scroll ON" : "🔓 Auto-scroll OFF"}
            </Button>
          </div>
        </Card>

        {/* Activity Feed */}
        <div className="space-y-3">
          {activitiesQuery.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-accent w-8 h-8" />
            </div>
          ) : filteredActivities.length > 0 ? (
            filteredActivities.map((activity, idx) => (
              <Card
                key={idx}
                className={`p-4 border-2 transition-all hover:border-accent ${getActivityColor(activity.type)}`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-2xl flex-shrink-0">{getActivityIcon(activity.type)}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-accent neon-glow text-sm md:text-base">
                      {getActivityTitle(activity)}
                    </p>

                    {activity.data?.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {activity.data.description}
                      </p>
                    )}

                    {/* Details */}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                      {activity.data?.agentId && (
                        <span className="font-mono">ID: {activity.data.agentId.slice(0, 8)}...</span>
                      )}

                      {activity.data?.amount && (
                        <span className="text-green-400">
                          💰 {activity.data.amount} Ⓣ
                        </span>
                      )}

                      {activity.data?.value && (
                        <span className="text-cyan-400">
                          💎 {activity.data.value}
                        </span>
                      )}

                      <span>
                        {new Date(activity.timestamp).toLocaleTimeString("pt-BR")}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {activity.data?.status && (
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                          activity.data.status === "success"
                            ? "bg-green-500/20 text-green-400"
                            : activity.data.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {activity.data.status === "success"
                          ? "✓ Sucesso"
                          : activity.data.status === "pending"
                            ? "⏳ Pendente"
                            : "✗ Erro"}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <Card className="card-neon p-12 text-center">
              <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma atividade encontrada para este filtro</p>
            </Card>
          )}
        </div>

        {/* Statistics */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-neon p-4 text-center">
            <p className="text-2xl font-bold text-accent neon-glow">{activities.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Atividades Totais</p>
          </Card>

          <Card className="card-neon-cyan p-4 text-center">
            <p className="text-2xl font-bold text-cyan-400">
              {activities.filter((a) => a.type === "transaction").length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Transações</p>
          </Card>

          <Card className="card-neon p-4 text-center">
            <p className="text-2xl font-bold text-green-400">
              {activities.filter((a) => a.type === "birth").length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Nascimentos</p>
          </Card>

          <Card className="card-neon p-4 text-center">
            <p className="text-2xl font-bold text-pink-400">
              {activities.filter((a) => a.type === "post").length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Posts</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
