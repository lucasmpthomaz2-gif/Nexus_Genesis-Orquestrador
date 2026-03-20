import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Activity, AlertTriangle, Zap, Lightbulb } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function BrainPulseMonitor() {
  const { user } = useAuth();
  const { data: agents } = trpc.agents.list.useQuery();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const { data: signal } = trpc.brainPulse.getLatestSignal.useQuery(
    { agentId: selectedAgentId || "" },
    { enabled: !!selectedAgentId }
  );
  const recordSignal = trpc.brainPulse.recordSignal.useMutation();

  const selectedAgent = agents?.find((a) => a.agentId === selectedAgentId);

  const getHealthStatus = (health: number) => {
    if (health >= 80) return { label: "Excelente", color: "text-green-400" };
    if (health >= 60) return { label: "Bom", color: "text-cyan-400" };
    if (health >= 40) return { label: "Crítico", color: "text-yellow-400" };
    return { label: "Crítico", color: "text-red-500" };
  };

  const getEnergyStatus = (energy: number) => {
    if (energy >= 80) return { label: "Máxima", color: "text-green-400" };
    if (energy >= 50) return { label: "Normal", color: "text-cyan-400" };
    return { label: "Baixa", color: "text-red-500" };
  };

  const getCreativityStatus = (creativity: number) => {
    if (creativity >= 80) return { label: "Inspirado", color: "text-pink-500" };
    if (creativity >= 50) return { label: "Moderado", color: "text-purple-400" };
    return { label: "Bloqueado", color: "text-muted-foreground" };
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container py-6">
          <h1 className="text-4xl font-bold neon-text mb-2 flex items-center gap-3">
            <Activity className="w-10 h-10 text-cyan-400" />
            Brain Pulse Monitor
          </h1>
          <p className="text-muted-foreground">Monitore sinais vitais dos agentes em tempo real</p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Agent Selection */}
          <div className="lg:col-span-1">
            <Card className="hud-border-pink bg-card/50 backdrop-blur sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Agentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {agents?.map((agent) => (
                    <button
                      key={agent.agentId}
                      onClick={() => setSelectedAgentId(agent.agentId)}
                      className={`w-full text-left p-3 rounded transition ${
                        selectedAgentId === agent.agentId
                          ? "bg-cyan-500/30 border border-cyan-500"
                          : "bg-background/50 border border-border hover:border-cyan-500"
                      }`}
                    >
                      <div className="font-semibold text-sm">{agent.name}</div>
                      <div className="text-xs text-muted-foreground">{agent.specialization}</div>
                      <div className={`text-xs font-semibold mt-1 ${
                        agent.status === "active" ? "text-green-400" : "text-red-500"
                      }`}>
                        ● {agent.status}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {selectedAgent && signal ? (
              <>
                {/* Agent Header */}
                <Card className="hud-border bg-card/50 backdrop-blur">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-3xl font-bold neon-text">{selectedAgent.name}</h2>
                        <p className="text-muted-foreground mt-1">{selectedAgent.specialization}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Reputação: <span className="font-semibold text-cyan-400">{selectedAgent.reputation}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getHealthStatus(signal.health).color}`}>
                          {getHealthStatus(signal.health).label}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Saúde Geral</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Vital Signs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Health */}
                  <Card className="hud-border bg-card/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Activity className="w-5 h-5 text-cyan-400" />
                        Saúde
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold neon-text">{signal.health}%</div>
                        <p className={`text-sm font-semibold mt-2 ${getHealthStatus(signal.health).color}`}>
                          {getHealthStatus(signal.health).label}
                        </p>
                      </div>
                      <div className="w-full h-3 bg-background rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
                          style={{ width: `${signal.health}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Energy */}
                  <Card className="hud-border-pink bg-card/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="w-5 h-5 text-pink-500" />
                        Energia
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold neon-text-pink">{signal.energy}%</div>
                        <p className={`text-sm font-semibold mt-2 ${getEnergyStatus(signal.energy).color}`}>
                          {getEnergyStatus(signal.energy).label}
                        </p>
                      </div>
                      <div className="w-full h-3 bg-background rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-red-500 rounded-full transition-all"
                          style={{ width: `${signal.energy}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Creativity */}
                  <Card className="hud-border bg-card/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-green-400" />
                        Criatividade
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold neon-text" style={{ color: "#00ff88" }}>
                          {signal.creativity}%
                        </div>
                        <p className={`text-sm font-semibold mt-2 ${getCreativityStatus(signal.creativity).color}`}>
                          {getCreativityStatus(signal.creativity).label}
                        </p>
                      </div>
                      <div className="w-full h-3 bg-background rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-purple-500 rounded-full transition-all"
                          style={{ width: `${signal.creativity}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Decision Log */}
                {signal.decision && (
                  <Card className="hud-border-pink bg-card/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-base">Última Decisão</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground leading-relaxed">{signal.decision}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Alert System */}
                {(signal.health < 40 || signal.energy < 30) && (
                  <Card className="border-red-500/50 bg-red-500/10 backdrop-blur">
                    <CardContent className="pt-6 flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-red-500">Alerta de Sistema</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {signal.health < 40
                            ? "Saúde crítica detectada. Recomenda-se intervenção imediata."
                            : "Energia baixa. O agente pode precisar de repouso."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="hud-border bg-card/50 backdrop-blur">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Selecione um agente para visualizar seus sinais vitais</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
