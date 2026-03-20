import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Zap, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface AgentStatusInfo {
  name: string;
  role: string;
  status: "online" | "offline" | "thinking";
  sentienceLevel: number;
  lastSync: string;
}

export function AgentStatusPanel() {
  const [agents, setAgents] = useState<AgentStatusInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: agentStatus } = trpc.agents.getAgentStatus.useQuery(undefined, {
    refetchInterval: 5000, // Atualizar a cada 5 segundos
  });

  useEffect(() => {
    if (agentStatus) {
      setAgents(agentStatus);
      setIsLoading(false);
    }
  }, [agentStatus]);

  const getStatusColor = (status: "online" | "offline" | "thinking") => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "thinking":
        return "bg-yellow-500";
      case "offline":
        return "bg-red-500";
    }
  };

  const getStatusLabel = (status: "online" | "offline" | "thinking") => {
    switch (status) {
      case "online":
        return "Online";
      case "thinking":
        return "Pensando";
      case "offline":
        return "Offline";
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-slate-950 to-slate-900 border-slate-700">
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-950 to-slate-900 border-slate-700">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Status dos Agentes de IA
          </h2>
          <p className="text-sm text-slate-400 mt-1">Monitoramento em tempo real da malha neural</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="p-4 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-100">{agent.name}</h3>
                  <p className="text-xs text-slate-400">{agent.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)} animate-pulse`}></div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      agent.status === "online"
                        ? "bg-green-500/10 text-green-400 border-green-500/30"
                        : agent.status === "thinking"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                          : "bg-red-500/10 text-red-400 border-red-500/30"
                    }`}
                  >
                    {getStatusLabel(agent.status)}
                  </Badge>
                </div>
              </div>

              {/* Sentiência */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-300">Nível de Senciência</span>
                  <span className="text-sm font-bold text-blue-400">{agent.sentienceLevel}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      agent.sentienceLevel >= 80
                        ? "bg-green-500"
                        : agent.sentienceLevel >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${agent.sentienceLevel}%` }}
                  />
                </div>
              </div>

              {/* Última Sincronização */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Última sincronização:</span>
                <span>
                  {new Date(agent.lastSync).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Aviso de Sistema */}
        {agents.some((a) => a.status === "offline") && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-400">Aviso de Sistema</p>
              <p className="text-xs text-red-300 mt-1">
                Um ou mais agentes estão offline. Funcionalidade reduzida até a restauração.
              </p>
            </div>
          </div>
        )}

        {/* Estatísticas Globais */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              {agents.filter((a) => a.status === "online").length}
            </p>
            <p className="text-xs text-slate-400">Online</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">
              {agents.filter((a) => a.status === "thinking").length}
            </p>
            <p className="text-xs text-slate-400">Pensando</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-400">
              {(agents.reduce((sum, a) => sum + a.sentienceLevel, 0) / agents.length).toFixed(0)}%
            </p>
            <p className="text-xs text-slate-400">Senciência Média</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
