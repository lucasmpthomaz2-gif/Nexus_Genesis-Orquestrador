import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Zap, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function OrchestratorView() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    context: "",
    targetSpecialization: "strategy",
    priority: "medium" as const,
    reward: 100,
  });

  const missionsQuery = trpc.missions.list.useQuery();
  const agentsQuery = trpc.agents.list.useQuery();
  const createMissionMutation = trpc.missions.create.useMutation();
  const assignMissionMutation = trpc.missions.assign.useMutation();
  const completeMissionMutation = trpc.missions.complete.useMutation();

  const handleCreateMission = async () => {
    try {
      await createMissionMutation.mutateAsync(formData);
      setFormData({
        title: "",
        description: "",
        context: "",
        targetSpecialization: "strategy",
        priority: "medium",
        reward: 100,
      });
      setIsCreateOpen(false);
      missionsQuery.refetch();
    } catch (error) {
      console.error("Erro ao criar missão:", error);
    }
  };

  const handleAssignMission = async (missionId: string, agentId: string) => {
    try {
      await assignMissionMutation.mutateAsync({ missionId, agentId });
      missionsQuery.refetch();
    } catch (error) {
      console.error("Erro ao atribuir missão:", error);
    }
  };

  const handleCompleteMission = async (missionId: string, agentId: string) => {
    try {
      await completeMissionMutation.mutateAsync({ missionId, agentId });
      missionsQuery.refetch();
    } catch (error) {
      console.error("Erro ao completar missão:", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-900 text-red-200";
      case "high":
        return "bg-orange-900 text-orange-200";
      case "medium":
        return "bg-yellow-900 text-yellow-200";
      case "low":
        return "bg-green-900 text-green-200";
      default:
        return "bg-slate-700 text-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "in_progress":
        return <Zap className="h-4 w-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const missions = missionsQuery.data || [];
  const agents = agentsQuery.data || [];

  const pendingMissions = missions.filter((m: any) => m.status === "pending");
  const inProgressMissions = missions.filter((m: any) => m.status === "in_progress");
  const completedMissions = missions.filter((m: any) => m.status === "completed");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Nexus Orchestrator</h1>
            <p className="text-slate-400">Cérebro Coletivo - Geração e Distribuição de Missões</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Target className="h-4 w-4 mr-2" />
                Nova Missão
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Criar Nova Missão</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Defina os parâmetros da missão para o ecossistema
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300">Título</label>
                  <Input
                    placeholder="Título da missão"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Descrição</label>
                  <Textarea
                    placeholder="Descrição detalhada"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Contexto</label>
                  <Textarea
                    placeholder="Contexto e análise do ecossistema"
                    value={formData.context}
                    onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300">Especialização Alvo</label>
                    <Select value={formData.targetSpecialization} onValueChange={(value) => setFormData({ ...formData, targetSpecialization: value })}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="strategy">Estratégia</SelectItem>
                        <SelectItem value="finance">Finanças</SelectItem>
                        <SelectItem value="research">Pesquisa</SelectItem>
                        <SelectItem value="development">Desenvolvimento</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300">Prioridade</label>
                    <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="critical">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Recompensa (Ⓣ)</label>
                  <Input
                    type="number"
                    placeholder="Recompensa em tokens"
                    value={formData.reward}
                    onChange={(e) => setFormData({ ...formData, reward: parseInt(e.target.value) })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Button onClick={handleCreateMission} className="w-full bg-blue-600 hover:bg-blue-700">
                  Criar Missão
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
            <TabsTrigger value="pending" className="text-slate-300">
              Pendentes ({pendingMissions.length})
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-slate-300">
              Em Progresso ({inProgressMissions.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-slate-300">
              Completadas ({completedMissions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            <div className="space-y-4">
              {pendingMissions.length === 0 ? (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="pt-6">
                    <p className="text-slate-400 text-center">Nenhuma missão pendente</p>
                  </CardContent>
                </Card>
              ) : (
                pendingMissions.map((mission: any) => (
                  <Card key={mission.missionId} className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-white">{mission.title}</CardTitle>
                            <Badge className={getPriorityColor(mission.priority)}>
                              {mission.priority}
                            </Badge>
                          </div>
                          <CardDescription className="text-slate-400">{mission.description}</CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-green-400">{mission.reward}Ⓣ</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <p className="text-sm text-slate-300 mb-2">
                          <strong>Contexto:</strong> {mission.context}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Select onValueChange={(agentId) => handleAssignMission(mission.missionId, agentId)}>
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-64">
                            <SelectValue placeholder="Atribuir a um agente..." />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            {agents
                              .filter((a: any) => a.status === "active" && a.specialization === mission.targetSpecialization)
                              .map((agent: any) => (
                                <SelectItem key={agent.agentId} value={agent.agentId}>
                                  {agent.name} ({agent.reputation} rep)
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-4">
            <div className="space-y-4">
              {inProgressMissions.length === 0 ? (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="pt-6">
                    <p className="text-slate-400 text-center">Nenhuma missão em progresso</p>
                  </CardContent>
                </Card>
              ) : (
                inProgressMissions.map((mission: any) => (
                  <Card key={mission.missionId} className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(mission.status)}
                            <CardTitle className="text-white">{mission.title}</CardTitle>
                            <Badge className={getPriorityColor(mission.priority)}>
                              {mission.priority}
                            </Badge>
                          </div>
                          <CardDescription className="text-slate-400">
                            Atribuído a: {mission.assignedAgentId}
                          </CardDescription>
                        </div>
                        <Button
                          onClick={() => handleCompleteMission(mission.missionId, mission.assignedAgentId)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Completar
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <div className="space-y-4">
              {completedMissions.length === 0 ? (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="pt-6">
                    <p className="text-slate-400 text-center">Nenhuma missão completada</p>
                  </CardContent>
                </Card>
              ) : (
                completedMissions.map((mission: any) => (
                  <Card key={mission.missionId} className="bg-slate-800 border-slate-700 opacity-75">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(mission.status)}
                        <CardTitle className="text-white">{mission.title}</CardTitle>
                        <Badge className="bg-green-900 text-green-200">Completada</Badge>
                      </div>
                      <CardDescription className="text-slate-400">
                        Completada por: {mission.assignedAgentId}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
