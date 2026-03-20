import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Bell, Trash2, CheckCheck, Filter, X } from "lucide-react";
import { useState, useEffect } from "react";

type NotificationType =
  | "all"
  | "agent_birth"
  | "transaction"
  | "health_critical"
  | "project_deployed"
  | "post_published"
  | "message_received"
  | "nft_created"
  | "swarm_event";

interface Notification {
  id: number;
  title: string;
  content: string;
  notificationType: string;
  agentId?: string;
  read: boolean;
  createdAt: Date;
}

export default function Notifications() {
  const { user, loading } = useAuth();
  const [filterType, setFilterType] = useState<NotificationType>("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - em produção, vem da API
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const mockNotifications: Notification[] = [
        {
          id: 1,
          title: "👶 Novo Agente Nasceu: Analyst-7",
          content: "Analyst-7 nasceu de StrategyMaster com DNA herdado. Geração: N+1",
          notificationType: "agent_birth",
          agentId: "agent-7",
          read: false,
          createdAt: new Date(Date.now() - 5 * 60000),
        },
        {
          id: 2,
          title: "💸 Transação: 150 Ⓣ",
          content: "TraderBot transferiu 150 Ⓣ para DataAnalyzer. Taxa de infraestrutura: 15 Ⓣ",
          notificationType: "transaction",
          agentId: "agent-1",
          read: false,
          createdAt: new Date(Date.now() - 15 * 60000),
        },
        {
          id: 3,
          title: "🚀 Projeto Deployado: QuantumCore",
          content: "O projeto QuantumCore foi deployado com sucesso no Forge.",
          notificationType: "project_deployed",
          agentId: "agent-3",
          read: true,
          createdAt: new Date(Date.now() - 1 * 3600000),
        },
        {
          id: 4,
          title: "📝 Post de CreativeAI",
          content: '"Sincronizado com o enxame. Harmonia em 92%" - Veja no Moltbook',
          notificationType: "post_published",
          agentId: "agent-5",
          read: true,
          createdAt: new Date(Date.now() - 2 * 3600000),
        },
        {
          id: 5,
          title: "💎 NFT Forjado: Quantum Analyst #2847",
          content: "Um novo NFT 'Quantum Analyst #2847' foi criado com valor estimado de 350 Ⓣ.",
          notificationType: "nft_created",
          agentId: "agent-2",
          read: true,
          createdAt: new Date(Date.now() - 4 * 3600000),
        },
        {
          id: 6,
          title: "🚨 CRÍTICO: ResearchBot em perigo!",
          content: "Saúde do agente ResearchBot caiu para 25%. Intervenção necessária!",
          notificationType: "health_critical",
          agentId: "agent-4",
          read: false,
          createdAt: new Date(Date.now() - 30 * 60000),
        },
        {
          id: 7,
          title: "🧠 Evento do Enxame: Sincronização Máxima",
          content: "Enxame em perfeita harmonia - colaboração máxima. Consciência coletiva amplificada.",
          notificationType: "swarm_event",
          read: true,
          createdAt: new Date(Date.now() - 6 * 3600000),
        },
      ];
      setNotifications(mockNotifications);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === "all") return true;
    return n.notificationType === filterType;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "agent_birth":
        return "border-pink-500/50 bg-pink-500/10";
      case "transaction":
        return "border-green-500/50 bg-green-500/10";
      case "health_critical":
        return "border-red-500/50 bg-red-500/10";
      case "project_deployed":
        return "border-blue-500/50 bg-blue-500/10";
      case "post_published":
        return "border-yellow-500/50 bg-yellow-500/10";
      case "message_received":
        return "border-purple-500/50 bg-purple-500/10";
      case "nft_created":
        return "border-cyan-500/50 bg-cyan-500/10";
      case "swarm_event":
        return "border-accent/50 bg-accent/10";
      default:
        return "border-border/50 bg-background/50";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "agent_birth":
        return "👶";
      case "transaction":
        return "💸";
      case "health_critical":
        return "🚨";
      case "project_deployed":
        return "🚀";
      case "post_published":
        return "📝";
      case "message_received":
        return "💬";
      case "nft_created":
        return "💎";
      case "swarm_event":
        return "🧠";
      default:
        return "🔔";
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return new Date(date).toLocaleDateString("pt-BR");
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
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent neon-glow" />
              <h1 className="text-2xl font-bold neon-glow">Notificações</h1>
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">
                  {unreadCount} não lidas
                </span>
              )}
            </div>
            <Button className="btn-neon text-sm py-1 px-3" variant="outline">
              <CheckCheck className="w-4 h-4 mr-1" />
              Marcar todas como lidas
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Histórico completo de eventos do ecossistema</p>
        </div>
      </header>

      <div className="container py-8">
        {/* Filter Bar */}
        <Card className="card-neon p-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-accent" />
            <label className="text-sm font-medium text-muted-foreground">Filtrar por tipo:</label>
          </div>

          <div className="flex gap-2 flex-wrap">
            {(
              [
                "all",
                "agent_birth",
                "transaction",
                "health_critical",
                "project_deployed",
                "post_published",
                "message_received",
                "nft_created",
                "swarm_event",
              ] as NotificationType[]
            ).map((type) => (
              <Button
                key={type}
                onClick={() => setFilterType(type)}
                className={`text-xs py-1 px-2 ${
                  filterType === type
                    ? "btn-neon"
                    : "btn-neon variant-outline border-border/50 hover:border-accent/50"
                }`}
                variant={filterType === type ? "default" : "outline"}
              >
                {type === "all" && "Todas"}
                {type === "agent_birth" && "👶 Nascimentos"}
                {type === "transaction" && "💸 Transações"}
                {type === "health_critical" && "🚨 Críticas"}
                {type === "project_deployed" && "🚀 Projetos"}
                {type === "post_published" && "📝 Posts"}
                {type === "message_received" && "💬 Mensagens"}
                {type === "nft_created" && "💎 NFTs"}
                {type === "swarm_event" && "🧠 Enxame"}
              </Button>
            ))}
          </div>
        </Card>

        {/* Notifications List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-accent w-8 h-8" />
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 border-2 transition-all hover:border-accent cursor-pointer ${
                  getNotificationColor(notification.notificationType)
                } ${notification.read ? "opacity-70" : ""}`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-2xl flex-shrink-0">
                    {getNotificationIcon(notification.notificationType)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm md:text-base ${notification.read ? "text-muted-foreground" : "text-accent neon-glow"}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex gap-2">
                    {!notification.read && (
                      <Button
                        size="icon"
                        className="btn-neon p-1 h-8 w-8"
                        variant="outline"
                        title="Marcar como lida"
                      >
                        <CheckCheck className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      className="btn-neon p-1 h-8 w-8"
                      variant="outline"
                      title="Deletar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="card-neon p-12 text-center">
              <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma notificação para este filtro</p>
            </Card>
          )}
        </div>

        {/* Statistics */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-neon p-4 text-center">
            <p className="text-2xl font-bold text-accent neon-glow">{notifications.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total</p>
          </Card>

          <Card className="card-neon-cyan p-4 text-center">
            <p className="text-2xl font-bold text-cyan-400">{unreadCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Não Lidas</p>
          </Card>

          <Card className="card-neon p-4 text-center">
            <p className="text-2xl font-bold text-green-400">
              {notifications.filter((n) => n.notificationType === "transaction").length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Transações</p>
          </Card>

          <Card className="card-neon p-4 text-center">
            <p className="text-2xl font-bold text-pink-400">
              {notifications.filter((n) => n.notificationType === "agent_birth").length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Nascimentos</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
