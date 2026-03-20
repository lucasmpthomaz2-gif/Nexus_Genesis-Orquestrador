import { Loader2, AlertTriangle, AlertCircle, Info, Bell } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface AlertsPanelProps {
  agentId: string;
}

export function AlertsPanel({ agentId }: AlertsPanelProps) {
  const { data: alerts, isLoading } = trpc.analysis.getUnreadAlerts.useQuery({
    limit: 20,
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle size={18} className="text-red-500" />;
      case "warning":
        return <AlertCircle size={18} className="text-yellow-400" />;
      default:
        return <Info size={18} className="text-neon-cyan" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500/50 bg-red-500/10";
      case "warning":
        return "border-yellow-400/50 bg-yellow-400/10";
      default:
        return "border-neon-cyan/30 bg-neon-cyan/5";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const agentAlerts = alerts?.filter((a) => a.relatedAgentId === agentId) || [];

  if (isLoading) {
    return (
      <div className="card-neon mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell size={24} className="text-neon-cyan animate-pulse" />
          <h2 className="neon-subtitle">ALERTS_PANEL</h2>
        </div>
        <div className="flex items-center justify-center gap-3 p-8">
          <Loader2 size={24} className="text-neon-cyan animate-spin" />
          <span className="text-neon-cyan font-mono">LOADING_ALERTS...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card-neon mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell size={24} className="text-neon-cyan" />
        <h2 className="neon-subtitle">ALERTS_PANEL</h2>
        {agentAlerts.length > 0 && (
          <span className="ml-auto px-2 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-500 text-xs font-bold">
            {agentAlerts.length} UNREAD
          </span>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {agentAlerts.length === 0 ? (
          <div className="p-4 text-center text-neon-cyan/60 text-sm">
            Nenhum alerta para este agente
          </div>
        ) : (
          agentAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 border rounded transition-all hover:border-opacity-100 ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{getSeverityIcon(alert.severity)}</div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-sm text-neon-cyan">{alert.title}</h3>
                    <div className={`flex-shrink-0 px-2 py-1 border rounded text-xs font-bold whitespace-nowrap ${
                      alert.severity === "critical"
                        ? "text-red-500 border-red-500/50"
                        : alert.severity === "warning"
                        ? "text-yellow-400 border-yellow-400/50"
                        : "text-neon-cyan border-neon-cyan/50"
                    }`}>
                      {alert.severity.toUpperCase()}
                    </div>
                  </div>

                  <p className="text-neon-cyan/80 text-sm mb-2">{alert.message}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-current border-opacity-20">
                    <div className="text-neon-cyan/50 text-xs font-mono">
                      {formatDate(alert.createdAt)}
                    </div>
                    <div className="text-neon-cyan/50 text-xs font-mono">
                      Type: {alert.type}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
