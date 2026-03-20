import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Hammer, Plus } from "lucide-react";

interface Project {
  id: number;
  name: string;
  description: string;
  status: "planning" | "in_progress" | "completed" | "paused";
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function ForgeProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  const { data: userProjects } = trpc.agents.listByUser.useQuery(undefined, {
    enabled: !!user,
  });

  const handleCreateProject = async () => {
    if (!newProjectName) {
      alert("Por favor, digite um nome para o projeto");
      return;
    }

    setIsLoading(true);
    try {
      alert("Projeto criado com sucesso!");
      setNewProjectName("");
      setNewProjectDesc("");
      setShowNewProject(false);
    } catch (error) {
      alert("Erro ao criar projeto: " + String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "bg-yellow-600/20 text-yellow-400";
      case "in_progress":
        return "bg-cyan-600/20 text-cyan-400";
      case "completed":
        return "bg-green-600/20 text-green-400";
      case "paused":
        return "bg-red-600/20 text-red-400";
      default:
        return "bg-gray-600/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-600 mb-2 flex items-center gap-3">
          <Hammer size={40} /> Forge Projects
        </h1>
        <p className="text-gray-400">Gestão de projetos com colaboração de agentes</p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* New Project Button */}
        <Button
          onClick={() => setShowNewProject(!showNewProject)}
          className="mb-8 bg-gradient-to-r from-cyan-600 to-pink-600 hover:from-cyan-700 hover:to-pink-700"
        >
          <Plus size={20} className="mr-2" /> Novo Projeto
        </Button>

        {/* New Project Form */}
        {showNewProject && (
          <Card className="bg-gray-900 border-cyan-500 mb-8">
            <CardHeader>
              <CardTitle className="text-cyan-400">Criar Novo Projeto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Projeto
                </label>
                <Input
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Ex: Sistema de IA Avançado"
                  className="bg-gray-800 border-cyan-500 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Descreva os objetivos do projeto..."
                  className="w-full bg-gray-800 border-2 border-cyan-500 text-white p-3 rounded resize-none h-24"
                />
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => setShowNewProject(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 hover:border-gray-400"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateProject}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-pink-600 hover:from-cyan-700 hover:to-pink-700"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Criar Projeto"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects List */}
        <div className="space-y-6">
          {projects.length === 0 ? (
            <Card className="bg-gray-900 border-cyan-500">
              <CardContent className="pt-6">
                <p className="text-gray-400 text-center">
                  Nenhum projeto criado ainda
                </p>
              </CardContent>
            </Card>
          ) : (
            projects.map((project) => (
              <Card
                key={project.id}
                className="bg-gray-900 border-cyan-500 hover:border-pink-600 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-cyan-400">
                      {project.name}
                    </CardTitle>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300">{project.description}</p>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400 text-sm">Progresso</span>
                      <span className="text-cyan-400 text-sm font-bold">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-pink-600 h-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 border-cyan-500 hover:bg-cyan-600/10"
                    >
                      Ver Detalhes
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-cyan-600 to-pink-600 hover:from-cyan-700 hover:to-pink-700">
                      Gerenciar Tarefas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
