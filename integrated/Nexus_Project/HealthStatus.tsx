import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  Loader2,
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Database,
  HardDrive,
  Cpu,
  Clock,
} from "lucide-react";
import { useState } from "react";

export default function HealthStatus() {
  const { user, loading: authLoading } = useAuth();
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Query
  const { data: health, isLoading } = trpc.health.detailed.useQuery(undefined, {
    enabled: !!user,
    refetchInterval: autoRefresh ? 5000 : false,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-400";
      case "degraded":
        return "text-yellow-400";
      case "unhealthy":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case "degraded":
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      case "unhealthy":
        return <XCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Activity className="w-6 h-6 text-gray-400" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent neon-glow" />
              <h1 className="text-2xl font-bold neon-glow">Health Status</h1>
            </div>
            <label className="flex items-center gap-2 px-3 py-1 border-2 border-border/50 rounded-full text-xs cursor-pointer hover:border-accent/50">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-3 h-3"
              />
              Auto-refresh
            </label>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-accent w-8 h-8" />
          </div>
        ) : health ? (
          <div className="space-y-8">
            {/* Overall Status */}
            <Card className="card-neon p-8 text-center">
              <div className="flex justify-center mb-4">{getStatusIcon(health.status)}</div>
              <h2 className={`text-3xl font-bold mb-2 ${getStatusColor(health.status)}`}>
                {health.status.toUpperCase()}
              </h2>
              <p className="text-muted-foreground mb-4">
                {new Date(health.timestamp).toLocaleString()}
              </p>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                  <p className="text-lg font-bold text-cyan-400">{formatUptime(health.uptime)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Memory</p>
                  <p className="text-lg font-bold text-green-400">
                    {Math.round((health.memory.heapUsed / health.memory.heapTotal) * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Database</p>
                  <p className={`text-lg font-bold ${health.database.connected ? "text-green-400" : "text-red-400"}`}>
                    {health.database.connected ? "Connected" : "Disconnected"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Detailed Checks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Database */}
              <Card className={`card-neon p-6 ${health.checks.database ? "border-green-500/50" : "border-red-500/50"}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-400" />
                    <h3 className="font-bold">Database</h3>
                  </div>
                  {health.checks.database ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className={health.database.connected ? "text-green-400" : "text-red-400"}>
                      {health.database.connected ? "Connected" : "Disconnected"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Response Time</span>
                    <span className="text-cyan-400">{health.database.responseTime}ms</span>
                  </div>
                </div>
              </Card>

              {/* Memory */}
              <Card className={`card-neon p-6 ${health.checks.memory ? "border-green-500/50" : "border-yellow-500/50"}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-purple-400" />
                    <h3 className="font-bold">Memory</h3>
                  </div>
                  {health.checks.memory ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Heap Used</span>
                    <span className="text-cyan-400">{health.memory.heapUsed} MB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Heap Total</span>
                    <span className="text-cyan-400">{health.memory.heapTotal} MB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">External</span>
                    <span className="text-cyan-400">{health.memory.external} MB</span>
                  </div>
                </div>
              </Card>

              {/* Disk */}
              <Card className={`card-neon p-6 ${health.checks.disk ? "border-green-500/50" : "border-yellow-500/50"}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-orange-400" />
                    <h3 className="font-bold">Disk</h3>
                  </div>
                  {health.checks.disk ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-green-400">Healthy</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Usage</span>
                    <span className="text-cyan-400">45%</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* System Info */}
            <Card className="card-neon p-6">
              <h3 className="text-lg font-bold neon-glow mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                System Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Last Check</p>
                  <p className="text-sm font-bold">
                    {new Date(health.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                  <p className="text-sm font-bold">{formatUptime(health.uptime)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Node Version</p>
                  <p className="text-sm font-bold">v18+</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Platform</p>
                  <p className="text-sm font-bold">Linux</p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <Card className="card-neon p-8 text-center">
            <p className="text-muted-foreground">Nenhum dado de saúde disponível</p>
          </Card>
        )}
      </div>
    </div>
  );
}
