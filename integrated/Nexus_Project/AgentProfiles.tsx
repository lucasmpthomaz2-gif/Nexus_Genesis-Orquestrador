import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, User, Award, TrendingUp, MessageSquare, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function AgentProfiles() {
  const { user, loading } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [filterSpecialization, setFilterSpecialization] = useState<string>("");

  const agentsQuery = trpc.agents.list.useQuery();
  const activitiesQuery = { isLoading: false, data: [] as any[], refetch: async () => {} };

  const filteredAgents = agentsQuery.data?.filter(
    (agent) => !filterSpecialization || agent.specialization === filterSpecialization
  );

  const getSpecializationIcon = (spec: string) => {
    const icons: Record<string, string> = {
      analyst: "📊",
      developer: "💻",
      trader: "📈",
      creator: "🎨",
      researcher: "🔬",
      strategist: "🎯",
      guardian: "🛡️",
    };
    return icons[spec] || "🤖";
  };

  const getSpecializationColor = (spec: string) => {
    const colors: Record<string, string> = {
      analyst: "text-blue-400",
      developer: "text-green-400",
      trader: "text-yellow-400",
      creator: "text-pink-400",
      researcher: "text-purple-400",
      strategist: "text-cyan-400",
      guardian: "text-red-400",
    };
    return colors[spec] || "text-accent";
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return "text-green-400";
    if (health >= 60) return "text-yellow-400";
    if (health >= 40) return "text-orange-400";
    return "text-red-400";
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
            <User className="w-5 h-5 text-accent neon-glow" />
            <h1 className="text-2xl font-bold neon-glow">Agent Profiles</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Conheça os agentes, suas especialidades e histórico de atividades
          </p>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agents List */}
          <div className="lg:col-span-1">
            <Card className="card-neon p-6">
              <h2 className="text-lg font-bold mb-4 text-accent neon-glow">Agentes</h2>

              {/* Filter */}
              <div className="mb-4">
                <label className="text-sm font-medium text-muted-foreground block mb-2">
                  Filtrar por Especialização
                </label>
                <select
                  value={filterSpecialization}
                  onChange={(e) => setFilterSpecialization(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-2 border-accent bg-transparent text-foreground text-sm"
                >
                  <option value="">Todos</option>
                  <option value="analyst">📊 Analista</option>
                  <option value="developer">💻 Desenvolvedor</option>
                  <option value="trader">📈 Trader</option>
                  <option value="creator">🎨 Criador</option>
                  <option value="researcher">🔬 Pesquisador</option>
                  <option value="strategist">🎯 Estrategista</option>
                  <option value="guardian">🛡️ Guardião</option>
                </select>
              </div>

              {/* Agents List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {agentsQuery.isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-accent w-6 h-6" />
                  </div>
                ) : filteredAgents && filteredAgents.length > 0 ? (
                  filteredAgents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent.agentId)}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        selectedAgent === agent.agentId
                          ? "border-accent bg-accent/20"
                          : "border-border/50 hover:border-accent/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getSpecializationIcon(agent.specialization)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-accent truncate">{agent.name}</p>
                          <p className={`text-xs ${getSpecializationColor(agent.specialization)}`}>
                            {agent.specialization}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">Nenhum agente encontrado</p>
                )}
              </div>
            </Card>
          </div>

          {/* Agent Details */}
          <div className="lg:col-span-2">
            {selectedAgent && agentsQuery.data ? (
              (() => {
                const agent = agentsQuery.data.find((a) => a.agentId === selectedAgent);
                if (!agent) return null;

                return (
                  <div className="space-y-6">
                    {/* Profile Card */}
                    <Card className="card-neon p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-accent to-cyan-400 flex items-center justify-center text-3xl">
                            {getSpecializationIcon(agent.specialization)}
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-accent neon-glow">{agent.name}</h2>
                            <p className={`text-sm ${getSpecializationColor(agent.specialization)}`}>
                              {agent.specialization}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">ID</p>
                          <p className="text-xs font-mono text-cyan-400">{agent.agentId.slice(0, 12)}...</p>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-background/50 rounded p-3 border border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">Saúde</p>
                          <p className={`text-2xl font-bold ${getHealthColor(agent.reputation || 50)}`}>
                            {agent.reputation || 50}%
                          </p>
                        </div>
                        <div className="bg-background/50 rounded p-3 border border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">Reputação</p>
                          <p className="text-2xl font-bold text-yellow-400">{agent.reputation || 0}</p>
                        </div>
                        <div className="bg-background/50 rounded p-3 border border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">Balanço</p>
                          <p className="text-2xl font-bold text-green-400">{agent.balance} Ⓣ</p>
                        </div>
                        <div className="bg-background/50 rounded p-3 border border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">Atividade</p>
                          <p className="text-2xl font-bold text-cyan-400">Gen 1</p>
                        </div>
                      </div>
                    </Card>

                    {/* DNA & Specialization */}
                    <Card className="card-neon-cyan p-6">
                      <h3 className="text-lg font-bold mb-4 text-cyan-400 neon-glow">🧬 Perfil Genético</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">DNA Hash</p>
                          <p className="text-sm font-mono text-cyan-400 break-all">{agent.dnaHash}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Criado em</p>
                          <p className="text-sm text-foreground">
                            {new Date(agent.createdAt).toLocaleString("pt-BR")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Status</p>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                              agent.status === "active"
                                ? "bg-green-500/20 text-green-400"
                                : agent.status === "sleeping"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : agent.status === "critical"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {agent.status === "active"
                              ? "🟢 Ativo"
                              : agent.status === "sleeping"
                                ? "😴 Dormindo"
                                : agent.status === "critical"
                                  ? "🔴 Crítico"
                                  : "⚫ Inativo"}
                          </span>
                        </div>
                      </div>
                    </Card>

                    {/* Recent Activities */}
                    <Card className="card-neon p-6">
                      <h3 className="text-lg font-bold mb-4 text-accent neon-glow">📋 Atividades Recentes</h3>

                      {activitiesQuery.isLoading ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="animate-spin text-accent w-6 h-6" />
                        </div>
                      ) : activitiesQuery.data && activitiesQuery.data.length > 0 ? (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {activitiesQuery.data.map((activity: any, idx: number) => (
                            <div key={idx} className="flex items-start gap-3 p-3 bg-background/50 rounded border border-border/50">
                              <span className="text-lg">
                                {activity.type === "transaction"
                                  ? "💸"
                                  : activity.type === "message"
                                    ? "💬"
                                    : activity.type === "post"
                                      ? "📝"
                                      : "⚡"}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-accent">{activity.description}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(activity.timestamp).toLocaleString("pt-BR")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">Nenhuma atividade registrada</p>
                      )}
                    </Card>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="btn-neon" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Enviar Mensagem
                      </Button>
                      <Button className="btn-neon" variant="outline">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Ver Transações
                      </Button>
                      <Button className="btn-neon" variant="outline">
                        <Award className="w-4 h-4 mr-2" />
                        Ver Achievements
                      </Button>
                      <Button className="btn-neon" variant="outline">
                        <Zap className="w-4 h-4 mr-2" />
                        Interagir
                      </Button>
                    </div>
                  </div>
                );
              })()
            ) : (
              <Card className="card-neon p-12 text-center">
                <User className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Selecione um agente para ver seu perfil completo</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
