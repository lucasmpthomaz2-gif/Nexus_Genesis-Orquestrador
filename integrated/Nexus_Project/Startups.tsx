import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import HubLayout from "@/components/HubLayout";
import MetricsEditor from "@/components/MetricsEditor";
import RankingBoard from "@/components/RankingBoard";
import { useRanking, getRankingMetrics, getSuccessorCandidate } from "@/hooks/useRanking";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, TrendingUp, Edit2, Crown } from "lucide-react";

interface Startup {
  id: number;
  name: string;
  description: string | null;
  revenue: number;
  traction: number;
  reputation: number;
  status: string;
  isCore: boolean;
  generation: number;
}

export default function Startups() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMetrics, setEditingMetrics] = useState<Startup | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", isCore: false });

  const startupsQuery = trpc.hub.startups.list.useQuery();
  const createMutation = trpc.hub.startups.create.useMutation();
  const updateMutation = trpc.hub.startups.update.useMutation();

  // Calculate ranking
  const ranking = useRanking(startups);
  const rankingMetrics = getRankingMetrics(ranking);
  const successorCandidate = getSuccessorCandidate(ranking);

  useEffect(() => {
    if (startupsQuery.data) {
      setStartups(startupsQuery.data);
    }
  }, [startupsQuery.data]);

  useEffect(() => {
    setLoading(startupsQuery.isLoading);
  }, [startupsQuery.isLoading]);

  const handleCreateStartup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
        isCore: formData.isCore,
      });
      setFormData({ name: "", description: "", isCore: false });
      setShowForm(false);
      await startupsQuery.refetch();
    } catch (error) {
      console.error("Erro ao criar startup:", error);
    }
  };

  const handleUpdateMetrics = async (
    startupId: number,
    metrics: {
      revenue: number;
      traction: number;
      reputation: number;
      productQuality?: number;
      marketFit?: number;
    }
  ) => {
    try {
      await updateMutation.mutateAsync({
        id: startupId,
        revenue: metrics.revenue,
        traction: metrics.traction,
        reputation: metrics.reputation,
      });
      await startupsQuery.refetch();
    } catch (error) {
      console.error("Erro ao atualizar métricas:", error);
    }
  };

  if (loading) {
    return (
      <HubLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="animate-spin text-cyan-400" size={40} />
        </div>
      </HubLayout>
    );
  }

  const coreStartup = startups.find((s) => s.isCore);
  const challengerStartups = startups.filter((s) => !s.isCore);

  const statusColors: Record<string, string> = {
    planning: "bg-slate-600",
    development: "bg-blue-600",
    launched: "bg-cyan-600",
    scaling: "bg-green-600",
    mature: "bg-purple-600",
    archived: "bg-slate-700",
  };

  return (
    <HubLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
              Gestão de Startups
            </h1>
            <p className="text-slate-400">
              Crie, edite e monitore o desempenho das startups do ecossistema
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
          >
            <Plus size={18} className="mr-2" />
            Nova Startup
          </Button>
        </div>

        {/* Metrics Editor Modal */}
        {editingMetrics && (
          <MetricsEditor
            startup={editingMetrics}
            onSave={(metrics) => handleUpdateMetrics(editingMetrics.id, metrics)}
            onClose={() => setEditingMetrics(null)}
          />
        )}

        {/* Create Form */}
        {showForm && (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Criar Nova Startup</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateStartup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nome da Startup
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: NEXUS RWA Protocol"
                    className="bg-slate-800 border-slate-700 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Descrição
                  </label>
                  <Input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição breve da startup"
                    className="bg-slate-800 border-slate-700 text-slate-200"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isCore"
                    checked={formData.isCore}
                    onChange={(e) => setFormData({ ...formData, isCore: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="isCore" className="text-sm text-slate-300">
                    Esta é a startup Core do ecossistema?
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                  >
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        Criando...
                      </>
                    ) : (
                      "Criar Startup"
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowForm(false)}
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Ranking Metrics */}
        {startups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400">Score Médio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-cyan-400">{rankingMetrics.avgScore}</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400">Receita Média</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-cyan-400">
                  ${(rankingMetrics.avgRevenue / 1000000).toFixed(2)}M
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400">Tração Média</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400">{rankingMetrics.avgTraction}</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400">Reputação Média</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-400">
                  {rankingMetrics.avgReputation}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400">Receita Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">
                  ${(rankingMetrics.totalRevenue / 1000000).toFixed(2)}M
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Ranking Board */}
        {startups.length > 0 && (
          <RankingBoard
            rankings={ranking}
            onSelectStartup={(id) => {
              const startup = startups.find((s) => s.id === id);
              if (startup) setEditingMetrics(startup);
            }}
          />
        )}

        {/* Succession Alert */}
        {successorCandidate && coreStartup && (ranking.find(r => r.id === successorCandidate.id)?.score || 0) > (ranking.find(r => r.id === coreStartup.id)?.score || 0) && (
          <Card className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-amber-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-400">
                <Crown size={20} />
                Alerta de Sucessão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-amber-100">
              <p>
                <strong>{successorCandidate.name}</strong> tem um score de performance superior a{" "}
                <strong>{coreStartup.name}</strong> (Core).
              </p>
              <p className="text-sm text-amber-200">
                Score: {ranking.find(r => r.id === successorCandidate.id)?.score || 0} vs{" "}
                {ranking.find(r => r.id === coreStartup.id)?.score || 0}
              </p>
              <p className="text-sm">
                Recomendação: Considere promover {successorCandidate.name} como nova startup Core.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Core Startup */}
        {coreStartup && (
          <div>
            <h2 className="text-2xl font-bold text-slate-200 mb-4">Startup Core</h2>
            <Card className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-cyan-400 text-2xl">{coreStartup.name}</CardTitle>
                    <CardDescription>{coreStartup.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold">
                      CORE
                    </Badge>
                    <Button
                      onClick={() => setEditingMetrics(coreStartup)}
                      size="sm"
                      variant="outline"
                      className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      <Edit2 size={16} className="mr-1" />
                      Editar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Receita</p>
                    <p className="text-2xl font-bold text-cyan-400">
                      ${(coreStartup.revenue / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Tração</p>
                    <p className="text-2xl font-bold text-blue-400">{coreStartup.traction}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Reputação</p>
                    <p className="text-2xl font-bold text-purple-400">{coreStartup.reputation}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Status</p>
                    <Badge className={`${statusColors[coreStartup.status] || "bg-slate-600"} text-white`}>
                      {coreStartup.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Challenger Startups */}
        {challengerStartups.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-200 mb-4">Startups Desafiantes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {challengerStartups.map((startup) => {
                const startupRanking = ranking.find((r) => r.id === startup.id);
                return (
                  <Card
                    key={startup.id}
                    className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <CardTitle className="text-slate-200">{startup.name}</CardTitle>
                          {startupRanking && (
                            <Badge className="mt-1 bg-yellow-600 text-white">
                              Rank #{startupRanking.rank}
                            </Badge>
                          )}
                        </div>
                        <Button
                          onClick={() => setEditingMetrics(startup)}
                          size="sm"
                          variant="ghost"
                          className="text-slate-400 hover:text-slate-200"
                        >
                          <Edit2 size={16} />
                        </Button>
                      </div>
                      <CardDescription className="text-xs line-clamp-2">
                        {startup.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-800/50 rounded p-2">
                          <p className="text-xs text-slate-500">Receita</p>
                          <p className="text-sm font-bold text-cyan-400">
                            ${(startup.revenue / 1000000).toFixed(2)}M
                          </p>
                        </div>
                        <div className="bg-slate-800/50 rounded p-2">
                          <p className="text-xs text-slate-500">Tração</p>
                          <p className="text-sm font-bold text-blue-400">{startup.traction}</p>
                        </div>
                        <div className="bg-slate-800/50 rounded p-2">
                          <p className="text-xs text-slate-500">Reputação</p>
                          <p className="text-sm font-bold text-purple-400">{startup.reputation}</p>
                        </div>
                        <div className="bg-slate-800/50 rounded p-2">
                          <p className="text-xs text-slate-500">Score</p>
                          <p className="text-sm font-bold text-yellow-400">
                            {startupRanking?.score || 0}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${statusColors[startup.status] || "bg-slate-600"} text-white`}>
                        {startup.status}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {startups.length === 0 && (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="py-12 text-center">
              <TrendingUp className="mx-auto mb-4 text-slate-600" size={48} />
              <p className="text-slate-400 font-medium">Nenhuma startup criada ainda.</p>
              <p className="text-sm text-slate-500 mt-2">
                Clique no botão "Nova Startup" para começar a criar o seu ecossistema.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </HubLayout>
  );
}
