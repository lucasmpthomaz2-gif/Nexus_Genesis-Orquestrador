import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Loader2, Bell, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useState } from "react";

export default function Notifications() {
  const { data: notifications, isLoading, refetch } = trpc.notifications.getHistory.useQuery({ limit: 50 });
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation();
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  // WebSocket listener
  useWebSocket((event) => {
    if (event.type === "notification:created") {
      refetch();
    }
  });

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      feed: <Bell className="w-5 h-5" />,
      agent: <AlertCircle className="w-5 h-5" />,
      governance: <CheckCircle className="w-5 h-5" />,
      market: <Info className="w-5 h-5" />,
      treasury: <Bell className="w-5 h-5" />,
    };
    return icons[type] || <Bell className="w-5 h-5" />;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      feed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      agent: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      governance: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      market: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      treasury: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[type] || colors.feed;
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsReadMutation.mutateAsync({ notificationId });
      refetch();
    } catch (error) {
      console.error("Erro ao marcar como lido:", error);
    }
  };

  const filteredNotifications = notifications?.filter((notif) => {
    if (filter === "unread") return !notif.read;
    if (filter === "read") return notif.read;
    return true;
  });

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Notificações</h1>
        {unreadCount > 0 && (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            {unreadCount} não lidas
          </Badge>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          size="sm"
        >
          Todas
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          onClick={() => setFilter("unread")}
          size="sm"
        >
          Não Lidas
        </Button>
        <Button
          variant={filter === "read" ? "default" : "outline"}
          onClick={() => setFilter("read")}
          size="sm"
        >
          Lidas
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : filteredNotifications && filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <Card
              key={notif.id}
              className={`p-6 bg-card border-border hover:shadow-lg transition-shadow ${
                !notif.read ? "border-primary/50 bg-primary/5" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-primary mt-1">
                  {getTypeIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{notif.title}</h3>
                      {notif.content && (
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{notif.content}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(notif.type)}>
                        {notif.type.charAt(0).toUpperCase() + notif.type.slice(1)}
                      </Badge>
                      {!notif.read && (
                        <div className="w-3 h-3 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      {new Date(notif.createdAt).toLocaleDateString("pt-BR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {!notif.read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(notif.id)}
                        disabled={markAsReadMutation.isPending}
                      >
                        {markAsReadMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Marcar como lido"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {filter === "unread" ? "Nenhuma notificação não lida" : "Nenhuma notificação"}
            </p>
          </div>
        )}
      </div>

      {/* Statistics */}
      {notifications && notifications.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Estatísticas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{notifications.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">{unreadCount}</p>
              <p className="text-sm text-muted-foreground">Não Lidas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">
                {notifications.filter((n) => n.read).length}
              </p>
              <p className="text-sm text-muted-foreground">Lidas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {new Set(notifications.map((n) => n.type)).size}
              </p>
              <p className="text-sm text-muted-foreground">Tipos</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
