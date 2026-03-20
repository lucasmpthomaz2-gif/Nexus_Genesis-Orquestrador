import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  Loader2,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Activity,
} from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [simulatorRunning, setSimulatorRunning] = useState(true);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentSpec, setNewAgentSpec] = useState("Analyst");
  const [showLogs, setShowLogs] = useState(false);

  // Queries
  const { data: mainMetrics } = trpc.analytics.getMainMetrics.useQuery(undefined, {
    enabled: !!user,
  });

  // Mutations
  const createAgentMutation = trpc.agents.create.useMutation();

  const handleCreateAgent = async () => {
    if (!newAgentName.trim()) return;
    try {
      await createAgentMutation.mutateAsync({
        name: newAgentName,
        specialization: newAgentSpec as any,
        description: `A ${newAgentSpec} agent in the NEXUS ecosystem.`,
      });
      setNewAgentName("");
    } catch (error) {
      console.error("Error creating agent:", error);
    }
  };

  const handleToggleSimulator = () => {
    setSimulatorRunning(!simulatorRunning);
    // TODO: Implementar API para pausar/retomar simulador
  };

  const handleResetSystem = () => {
    if (window.confirm("Tem certeza? Esta ação é irreversível!")) {
      // TODO: Implementar API para resetar sistema
      alert("Sistema resetado");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-accent w-12 h-12" />
      </div>
    );
  }

  // Verificar se é admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="card-neon p-8 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Acesso Negado</h1>
          <p className="text-muted-foreground">
            Apenas administradores podem acessar este painel.
          </p>
        </Card>
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
              <Settings className="w-5 h-5 text-accent neon-glow" />
              <h1 className="text-2xl font-bold neon-glow">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              {simulatorRunning ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border-2 border-green-500 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-green-400">Simulador Ativo</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border-2 border-red-500 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-xs font-bold text-red-400">Simulador Pausado</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="card-neon p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Agentes Ativos</p>
                <p className="text-2xl font-bold neon-glow">{mainMetrics?.activeAgents || 0}</p>
              </div>
              <Users className="w-8 h-8 text-accent opacity-50" />
            </div>
          </Card>

          <Card className="card-neon p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Transações</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {mainMetrics?.totalTransactions || 0}
                </p>
              </div>
              <Activity className="w-8 h-8 text-cyan-400 opacity-50" />
            </div>
          </Card>

          <Card className="card-neon p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Uptime</p>
                <p className="text-2xl font-bold text-green-400">99.9%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400 opacity-50" />
            </div>
          </Card>

          <Card className="card-neon p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Última Atualização</p>
                <p className="text-sm font-bold text-yellow-400">Agora</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Simulator Controls */}
        <Card className="card-neon p-6 mb-8">
          <h2 className="text-lg font-bold neon-glow mb-4 flex items-center gap-2">
            <Play className="w-5 h-5" />
            Controles do Simulador
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleToggleSimulator}
              className={`${
                simulatorRunning ? "bg-red-500/20 border-red-500 text-red-400" : "btn-neon"
              } border-2 flex items-center justify-center gap-2`}
            >
              {simulatorRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pausar Simulador
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Retomar Simulador
                </>
              )}
            </Button>

            <Button className="btn-neon border-2 flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reiniciar Simulador
            </Button>

            <Button
              onClick={handleResetSystem}
              className="border-2 border-red-500/50 text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-2"
              variant="outline"
            >
              <Trash2 className="w-4 h-4" />
              Resetar Sistema
            </Button>
          </div>

          <div className="mt-4 p-3 bg-yellow-500/10 border-2 border-yellow-500/50 rounded-lg">
            <p className="text-xs text-yellow-400">
              ⚠️ Pausar o simulador interromperá a geração de agentes, transações e eventos.
            </p>
          </div>
        </Card>

        {/* Create Agent */}
        <Card className="card-neon p-6 mb-8">
          <h2 className="text-lg font-bold neon-glow mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Criar Novo Agente
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Nome do Agente</label>
              <input
                type="text"
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
                placeholder="Ex: Agent-Alpha-001"
                className="w-full p-2 bg-background border-2 border-border/50 rounded-lg text-foreground focus:border-accent outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Especialização</label>
              <select
                value={newAgentSpec}
                onChange={(e) => setNewAgentSpec(e.target.value)}
                className="w-full p-2 bg-background border-2 border-border/50 rounded-lg text-foreground focus:border-accent outline-none"
              >
                <option value="Analyst">Analyst</option>
                <option value="Developer">Developer</option>
                <option value="Trader">Trader</option>
                <option value="Creator">Creator</option>
                <option value="Researcher">Researcher</option>
              </select>
            </div>

            <Button
              onClick={handleCreateAgent}
              disabled={!newAgentName.trim()}
              className="w-full btn-neon"
            >
              {createAgentMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Agente
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* System Logs */}
        <Card className="card-neon p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold neon-glow flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Logs do Sistema
            </h2>
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="text-xs px-3 py-1 border-2 border-border/50 rounded-full hover:border-accent/50"
            >
              {showLogs ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {showLogs && (
            <div className="bg-black/50 border-2 border-border/50 rounded-lg p-4 font-mono text-xs max-h-96 overflow-y-auto space-y-1">
              <p className="text-green-400">[2026-02-16 15:36:19] Server started on port 3000</p>
              <p className="text-cyan-400">[2026-02-16 15:36:20] Database connected</p>
              <p className="text-yellow-400">[2026-02-16 15:36:21] Simulator initialized</p>
              <p className="text-green-400">[2026-02-16 15:36:22] Agent-Alpha-001 created</p>
              <p className="text-cyan-400">[2026-02-16 15:36:23] Transaction processed: 100 tokens</p>
              <p className="text-green-400">[2026-02-16 15:36:24] Brain Pulse signal generated</p>
              <p className="text-yellow-400">[2026-02-16 15:36:25] WebSocket client connected</p>
              <p className="text-green-400">[2026-02-16 15:36:26] Moltbook post published</p>
              <p className="text-cyan-400">[2026-02-16 15:36:27] Consciousness sync updated</p>
              <p className="text-green-400">[2026-02-16 15:36:28] System healthy - all systems operational</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
