import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  Loader2,
  Bell,
  Zap,
  AlertTriangle,
  Rocket,
  MessageSquare,
  Gem,
  Brain,
  Trash2,
  CheckCircle,
  X,
} from "lucide-react";
import { useState } from "react";

type NotificationType =
  | "agent-birth"
  | "transaction"
  | "health-critical"
  | "project-deployed"
  | "post-published"
  | "message-received"
  | "nft-created"
  | "swarm-event"
  | "all";

const notificationTypeConfig: Record<
  string,
  { icon: React.ReactNode; color: string; label: string }
> = {
  "agent-birth": {
    icon: <Zap className="w-4 h-4" />,
    color: "text-pink-400",
    label: "Nascimento de Agente",
  },
  transaction: {
    icon: <Zap className="w-4 h-4" />,
    color: "text-cyan-400",
    label: "Transação",
  },
  "health-critical": {
    icon: <AlertTriangle className="w-4 h-4" />,
    color: "text-red-400",
    label: "Alerta Crítico",
  },
  "project-deployed": {
    icon: <Rocket className="w-4 h-4" />,
    color: "text-green-400",
    label: "Projeto Deployado",
  },
  "post-published": {
    icon: <MessageSquare className="w-4 h-4" />,
    color: "text-yellow-400",
    label: "Post Publicado",
  },
  "message-received": {
    icon: <MessageSquare className="w-4 h-4" />,
    color: "text-purple-400",
    label: "Mensagem Recebida",
  },
  "nft-created": {
    icon: <Gem className="w-4 h-4" />,
    color: "text-orange-400",
    label: "NFT Criado",
  },
  "swarm-event": {
    icon: <Brain className="w-4 h-4" />,
    color: "text-pink-300",
    label: "Evento do Enxame",
  },
};

export default function NotificationsIntegrated() {
  const { user, loading: authLoading } = useAuth();
  const [selectedType, setSelectedType] = useState<NotificationType>("all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(0);

  // Queries
  const { data: notificationsData, isLoading: notificationsLoading } = trpc.notifications.getNotifications.useQuery(
    {
      limit: 20,
      offset: page * 20,
      type: selectedType === "all" ? undefined : selectedType,
      unreadOnly,
    },
    { enabled: !!user }
  );

  const { data: statsData } = trpc.notifications.getStats.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: unreadCount } = trpc.notifications.getUnreadCount.useQuery(undefined, {
    enabled: !!user,
  });

  // Mutations
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation();
  const markAllAsReadMutation = trpc.notifications.markAllAsRead.useMutation();
  const deleteNotificationMutation = trpc.notifications.deleteNotification.useMutation();

  const handleMarkAsRead = async (notificationId: number) => {
    await markAsReadMutation.mutateAsync({ notificationId });
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsReadMutation.mutateAsync();
  };

  const handleDelete = async (notificationId: number) => {
    await deleteNotificationMutation.mutateAsync({ notificationId });
  };

  if (authLoading) {
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
            </div>
            {unreadCount && unreadCount.count > 0 && (
              <div className="bg-red-500/20 border-2 border-red-500 px-3 py-1 rounded-full text-sm font-bold text-red-400">
                {unreadCount.count} não lidas
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Acompanhe todos os eventos do ecossistema NEXUS
          </p>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Cards */}
        {statsData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="card-neon p-4">
              <p className="text-xs text-muted-foreground mb-1">Total</p>
              <p className="text-2xl font-bold neon-glow">{statsData.total}</p>
            </Card>
            <Card className="card-neon p-4">
              <p className="text-xs text-muted-foreground mb-1">Não Lidas</p>
              <p className="text-2xl font-bold text-cyan-400">{unreadCount?.count || 0}</p>
            </Card>
            <Card className="card-neon p-4">
              <p className="text-xs text-muted-foreground mb-1">Transações</p>
              <p className="text-2xl font-bold text-green-400">
                {statsData.byType["transaction"] || 0}
              </p>
            </Card>
            <Card className="card-neon p-4">
              <p className="text-xs text-muted-foreground mb-1">Nascimentos</p>
              <p className="text-2xl font-bold text-pink-400">
                {statsData.byType["agent-birth"] || 0}
              </p>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            {(["all", "agent-birth", "transaction", "health-critical", "project-deployed", "post-published", "message-received", "nft-created", "swarm-event"] as NotificationType[]).map(
              (type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                    setPage(0);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all border-2 ${
                    selectedType === type
                      ? "border-accent bg-accent/20 neon-glow"
                      : "border-border/50 hover:border-accent/50"
                  }`}
                >
                  {type === "all" ? "Todas" : notificationTypeConfig[type]?.label || type}
                </button>
              )
            )}
          </div>

          <div className="flex gap-2 ml-auto">
            <label className="flex items-center gap-2 px-3 py-1 border-2 border-border/50 rounded-full text-xs cursor-pointer hover:border-accent/50">
              <input
                type="checkbox"
                checked={unreadOnly}
                onChange={(e) => {
                  setUnreadOnly(e.target.checked);
                  setPage(0);
                }}
                className="w-3 h-3"
              />
              Não lidas
            </label>

            {unreadCount && unreadCount.count > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                size="sm"
                className="btn-neon text-xs"
              >
                Marcar tudo como lido
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notificationsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-accent w-8 h-8" />
            </div>
          ) : notificationsData && notificationsData.items.length > 0 ? (
            notificationsData.items.map((notification: any) => {
              const config = notificationTypeConfig[notification.notificationType] || {};
              return (
                <Card
                  key={notification.id}
                  className={`card-neon p-4 flex items-start gap-4 ${
                    !notification.read ? "border-accent/50 bg-accent/5" : ""
                  }`}
                >
                  <div className={`mt-1 ${config.color}`}>{config.icon}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-sm">{config.label}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.content}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-accent rounded-full mt-1 flex-shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-1 hover:bg-accent/20 rounded-lg transition-colors"
                        title="Marcar como lida"
                      >
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Deletar"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="card-neon p-8 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Nenhuma notificação encontrada</p>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {notificationsData && notificationsData.hasMore && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setPage(page + 1)}
              className="btn-neon"
            >
              Carregar Mais
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
