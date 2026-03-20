import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";

interface Mission {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  assignedAgent?: string;
  progress: number;
  reward: number;
  createdAt: Date;
  completedAt?: Date;
}

export default function MissionOrchestrator() {
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: "MISSION-001",
      title: "Explorar Setor Quântico",
      description: "Mapear novas regiões do espaço quântico",
      status: "in_progress",
      assignedAgent: "Alpha",
      progress: 65,
      reward: 500,
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: "MISSION-002",
      title: "Coleta de Recursos",
      description: "Coletar 1000 unidades de energia",
      status: "pending",
      progress: 0,
      reward: 300,
      createdAt: new Date(),
    },
    {
      id: "MISSION-003",
      title: "Análise de Mercado",
      description: "Analisar tendências de preço em blockchain",
      status: "completed",
      assignedAgent: "Beta",
      progress: 100,
      reward: 750,
      createdAt: new Date(Date.now() - 7200000),
      completedAt: new Date(Date.now() - 1800000),
    },
  ]);

  const [newMission, setNewMission] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateMission = async () => {
    if (!newMission.trim()) return;

    setLoading(true);
    try {
      const mission: Mission = {
        id: `MISSION-${String(missions.length + 1).padStart(3, "0")}`,
        title: newMission,
        description: "Missão criada via Gnox Terminal",
        status: "pending",
        progress: 0,
        reward: Math.floor(Math.random() * 1000) + 100,
        createdAt: new Date(),
      };

      setMissions((prev) => [...prev, mission]);
      setNewMission("");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignAgent = (missionId: string, agentName: string) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === missionId
          ? { ...m, assignedAgent: agentName, status: "in_progress" as const }
          : m
      )
    );
  };

  const handleCompleteMission = (missionId: string) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === missionId
          ? {
              ...m,
              status: "completed" as const,
              progress: 100,
              completedAt: new Date(),
            }
          : m
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600";
      case "in_progress":
        return "bg-blue-600";
      case "pending":
        return "bg-yellow-600";
      case "failed":
        return "bg-red-600";
      default:
        return "bg-slate-600";
    }
  };

  const totalReward = missions.reduce((sum, m) => sum + m.reward, 0);
  const completedMissions = missions.filter((m) => m.status === "completed").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Orquestrador de Missões</h1>
          <p className="text-slate-400">Delegação e rastreamento de tarefas do ecossistema</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total de Missões</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{missions.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Concluídas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">{completedMissions}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Em Progresso</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-500">
                {missions.filter((m) => m.status === "in_progress").length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Recompensa Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-500">{totalReward}</p>
            </CardContent>
          </Card>
        </div>

        {/* Criar Nova Missão */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle>Criar Nova Missão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={newMission}
                onChange={(e) => setNewMission(e.target.value)}
                placeholder="Descreva a nova missão..."
                className="bg-slate-700 border-slate-600 text-white"
                onKeyPress={(e) => e.key === "Enter" && handleCreateMission()}
              />
              <Button
                onClick={handleCreateMission}
                disabled={loading || !newMission.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Missões */}
        <div className="space-y-4">
          {missions.map((mission) => (
            <Card key={mission.id} className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(mission.status)}
                    <div>
                      <CardTitle className="text-lg text-white">{mission.title}</CardTitle>
                      <CardDescription className="text-slate-400">
                        {mission.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(mission.status)}>
                    {mission.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progresso */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">Progresso</span>
                    <span className="text-sm font-bold text-white">{mission.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${mission.progress}%` }}
                    />
                  </div>
                </div>

                {/* Detalhes */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-slate-400">Agente Atribuído</p>
                    <p className="text-sm font-semibold text-white">
                      {mission.assignedAgent || "Não atribuído"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Recompensa</p>
                    <p className="text-sm font-semibold text-yellow-500">{mission.reward}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Criada em</p>
                    <p className="text-sm font-semibold text-white">
                      {mission.createdAt.toLocaleTimeString()}
                    </p>
                  </div>
                  {mission.completedAt && (
                    <div>
                      <p className="text-xs text-slate-400">Concluída em</p>
                      <p className="text-sm font-semibold text-green-500">
                        {mission.completedAt.toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Ações */}
                {mission.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAssignAgent(mission.id, "Alpha")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Atribuir a Alpha
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAssignAgent(mission.id, "Beta")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Atribuir a Beta
                    </Button>
                  </div>
                )}

                {mission.status === "in_progress" && (
                  <Button
                    size="sm"
                    onClick={() => handleCompleteMission(mission.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Marcar como Concluída
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
