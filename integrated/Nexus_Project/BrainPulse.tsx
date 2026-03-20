import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Heart, Zap, Sparkles, Loader2 } from "lucide-react";

interface AgentVitals {
  agentId: string;
  name: string;
  specialization: string;
  status: string;
  health: number;
  energy: number;
  creativity: number;
  sencienciaLevel: string;
}

export default function BrainPulse() {
  const [agents, setAgents] = useState<AgentVitals[]>([]);
  const [loading, setLoading] = useState(true);
  const [criticalAgents, setCriticalAgents] = useState<string[]>([]);

  const agentsQuery = trpc.agents.getActive.useQuery();

  useEffect(() => {
    if (agentsQuery.data) {
      const agentList = agentsQuery.data.map((agent) => ({
        agentId: agent.agentId,
        name: agent.name,
        specialization: agent.specialization,
        status: agent.status,
        health: agent.health,
        energy: agent.energy,
        creativity: agent.creativity,
        sencienciaLevel: agent.sencienciaLevel,
      }));

      setAgents(agentList);

      // Identificar agentes críticos
      const critical = agentList
        .filter((a) => a.health < 30)
        .map((a) => a.agentId);
      setCriticalAgents(critical);

      setLoading(false);
    }
  }, [agentsQuery.data]);

  // Auto-refresh a cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      agentsQuery.refetch();
    }, 3000);

    return () => clearInterval(interval);
  }, [agentsQuery]);

  const getHealthColor = (health: number) => {
    if (health >= 70) return "text-green-500";
    if (health >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getEnergyColor = (energy: number) => {
    if (energy >= 70) return "text-blue-500";
    if (energy >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getCreativityColor = (creativity: number) => {
    if (creativity >= 70) return "text-purple-500";
    if (creativity >= 40) return "text-pink-500";
    return "text-slate-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Brain Pulse Monitor</h1>
          <p className="text-slate-400">Monitoramento de Sinais Vitais em Tempo Real</p>
        </div>

        {/* Alertas Críticos */}
        {criticalAgents.length > 0 && (
          <Card className="bg-red-900/20 border-red-500 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-5 w-5" />
                Agentes em Estado Crítico
              </CardTitle>
            </CardHeader>
            <CardContent className="text-red-300">
              <p>
                {criticalAgents.length} agente(s) com saúde abaixo de 30%. Ação imediata recomendada.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Grid de Agentes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.length > 0 ? (
            agents.map((agent) => (
              <Card
                key={agent.agentId}
                className={`bg-slate-800 border-slate-700 ${
                  agent.health < 30 ? "border-red-500 border-2" : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-white">{agent.name}</CardTitle>
                      <CardDescription className="text-slate-400">
                        {agent.specialization}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={agent.status === "active" ? "default" : "secondary"}
                      className={
                        agent.status === "active"
                          ? "bg-green-600"
                          : agent.status === "critical"
                            ? "bg-red-600"
                            : "bg-yellow-600"
                      }
                    >
                      {agent.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Saúde */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Heart className={`h-4 w-4 ${getHealthColor(agent.health)}`} />
                        <span className="text-sm font-medium text-slate-300">Saúde</span>
                      </div>
                      <span className={`text-sm font-bold ${getHealthColor(agent.health)}`}>
                        {agent.health}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          agent.health >= 70
                            ? "bg-green-500"
                            : agent.health >= 40
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${agent.health}%` }}
                      />
                    </div>
                  </div>

                  {/* Energia */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Zap className={`h-4 w-4 ${getEnergyColor(agent.energy)}`} />
                        <span className="text-sm font-medium text-slate-300">Energia</span>
                      </div>
                      <span className={`text-sm font-bold ${getEnergyColor(agent.energy)}`}>
                        {agent.energy}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          agent.energy >= 70
                            ? "bg-blue-500"
                            : agent.energy >= 40
                              ? "bg-orange-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${agent.energy}%` }}
                      />
                    </div>
                  </div>

                  {/* Criatividade */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className={`h-4 w-4 ${getCreativityColor(agent.creativity)}`} />
                        <span className="text-sm font-medium text-slate-300">Criatividade</span>
                      </div>
                      <span className={`text-sm font-bold ${getCreativityColor(agent.creativity)}`}>
                        {agent.creativity}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          agent.creativity >= 70
                            ? "bg-purple-500"
                            : agent.creativity >= 40
                              ? "bg-pink-500"
                              : "bg-slate-500"
                        }`}
                        style={{ width: `${agent.creativity}%` }}
                      />
                    </div>
                  </div>

                  {/* Senciência */}
                  <div className="pt-2 border-t border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-300">Senciência Quântica</span>
                      <span className="text-sm font-bold text-purple-400">
                        {parseFloat(agent.sencienciaLevel).toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Alerta de Crítico */}
                  {agent.health < 30 && (
                    <div className="mt-3 p-2 bg-red-900/30 border border-red-500 rounded flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-red-300">Saúde crítica</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center py-12">
              <p className="text-slate-400">Nenhum agente ativo no momento</p>
            </div>
          )}
        </div>

        {/* Estatísticas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total de Agentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{agents.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Críticos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-500">{criticalAgents.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Saúde Média</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">
                {agents.length > 0
                  ? (agents.reduce((sum, a) => sum + a.health, 0) / agents.length).toFixed(1)
                  : "0"}
                %
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Energia Média</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">
                {agents.length > 0
                  ? (agents.reduce((sum, a) => sum + a.energy, 0) / agents.length).toFixed(1)
                  : "0"}
                %
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
