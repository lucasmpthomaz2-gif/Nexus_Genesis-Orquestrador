import { useWebSocketMetrics, useWebSocketConnection } from "@/contexts/WebSocketContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, Activity, Zap, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VitalLoopMonitor() {
  const metrics = useWebSocketMetrics();
  const { isConnected } = useWebSocketConnection();

  const getHealthStatus = (health: number) => {
    if (health >= 80) return { label: "Excelente", color: "text-green-500", bg: "bg-green-500/20" };
    if (health >= 60) return { label: "Bom", color: "text-blue-500", bg: "bg-blue-500/20" };
    if (health >= 40) return { label: "Médio", color: "text-yellow-500", bg: "bg-yellow-500/20" };
    return { label: "Crítico", color: "text-red-500", bg: "bg-red-500/20" };
  };

  const getEnergyStatus = (energy: number) => {
    if (energy >= 70) return { label: "Alto", color: "text-green-500" };
    if (energy >= 40) return { label: "Médio", color: "text-yellow-500" };
    return { label: "Baixo", color: "text-red-500" };
  };

  const VitalCard = ({
    agentName,
    health = 75,
    energy = 60,
    harmonyContribution = 0.8,
  }: {
    agentName: string;
    health?: number;
    energy?: number;
    harmonyContribution?: number;
  }) => {
    const healthStatus = getHealthStatus(health);
    const energyStatus = getEnergyStatus(energy);

    return (
      <Card className="nexus-card border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">{agentName}</CardTitle>
              <CardDescription className="text-xs">Sinais Vitais</CardDescription>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Heart className="h-4 w-4 text-purple-500" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Health */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Saúde</span>
              <span className={cn("text-xs font-semibold", healthStatus.color)}>
                {health}% - {healthStatus.label}
              </span>
            </div>
            <Progress value={health} className="h-2" />
          </div>

          {/* Energy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Energia</span>
              <span className={cn("text-xs font-semibold", energyStatus.color)}>
                {energy}% - {energyStatus.label}
              </span>
            </div>
            <Progress value={energy} className="h-2" />
          </div>

          {/* Harmony Contribution */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Contribuição à Harmonia</span>
              <span className="text-xs font-semibold text-blue-500">
                {(harmonyContribution * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={harmonyContribution * 100} className="h-2" />
          </div>

          {/* Status Indicator */}
          {health < 40 && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-xs text-red-600 dark:text-red-400">
                Saúde crítica - Ação necessária
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Monitor de Sinais Vitais</h1>
          <p className="text-slate-400">
            Acompanhamento em tempo real da saúde e energia dos agentes
          </p>
        </div>

        {/* Overall Status */}
        <Card className="nexus-card border-border/50 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              Status Geral do Ecossistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Saúde Média</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-500">
                    {metrics?.avgHealth ? Math.round(metrics.avgHealth) : "—"}%
                  </span>
                </div>
                <Progress value={metrics?.avgHealth || 0} className="h-2" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Energia Média</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-orange-500">
                    {metrics?.avgEnergy ? Math.round(metrics.avgEnergy) : "—"}%
                  </span>
                </div>
                <Progress value={metrics?.avgEnergy || 0} className="h-2" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Nível de Harmonia</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-purple-500">
                    {metrics?.harmonyLevel || "—"}%
                  </span>
                </div>
                <Progress value={metrics?.harmonyLevel || 0} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agents Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Agentes Monitorados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sample agents - replace with real data from WebSocket */}
            <VitalCard
              agentName="Agent Alpha"
              health={85}
              energy={72}
              harmonyContribution={0.9}
            />
            <VitalCard
              agentName="Agent Beta"
              health={65}
              energy={55}
              harmonyContribution={0.7}
            />
            <VitalCard
              agentName="Agent Gamma"
              health={45}
              energy={38}
              harmonyContribution={0.5}
            />
            <VitalCard
              agentName="Agent Delta"
              health={90}
              energy={80}
              harmonyContribution={0.95}
            />
            <VitalCard
              agentName="Agent Epsilon"
              health={70}
              energy={60}
              harmonyContribution={0.75}
            />
            <VitalCard
              agentName="Agent Zeta"
              health={55}
              energy={45}
              harmonyContribution={0.6}
            />
          </div>
        </div>

        {/* Connection Status */}
        <Card className="nexus-card border-border/50">
          <CardHeader>
            <CardTitle>Informações de Conexão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-3 w-3 rounded-full animate-pulse",
                  isConnected ? "bg-green-500" : "bg-red-500"
                )}
              />
              <span className="text-sm font-medium">
                {isConnected ? "Conectado ao servidor em tempo real" : "Desconectado"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
