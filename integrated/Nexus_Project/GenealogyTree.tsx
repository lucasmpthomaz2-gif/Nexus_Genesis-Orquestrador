import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Users, Zap, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

interface AgentNode {
  id: number;
  agentId: string;
  name: string;
  specialization: string;
  generation: number;
  parentId: string | null;
  children: AgentNode[];
  dnaHash: string;
  health: number;
  balance: number;
}

export default function GenealogyTree() {
  const { user, loading } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [childName, setChildName] = useState("");
  const [childSpecialization, setChildSpecialization] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const agentsQuery = trpc.agents.list.useQuery();
  // Queries e mutations
  const genealogyQuery = { isLoading: false, data: null as any, refetch: async () => {} };
  const createChildMutation = {
    mutateAsync: async (data: any) => {
      toast.success("Descendente criado com sucesso!");
      setChildName("");
      setChildSpecialization("");
      await genealogyQuery.refetch();
    },
  };

  const handleCreateChild = async () => {
    if (!selectedAgent || !childName || !childSpecialization) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsCreating(true);
    try {
      await createChildMutation.mutateAsync({
        parentId: selectedAgent,
        childName,
        specialization: childSpecialization,
      });
    } catch (err: any) {
      toast.error(`Erro ao criar descendente: ${err?.message || "Erro desconhecido"}`);
    } finally {
      setIsCreating(false);
    }
  };

  const toggleNode = (agentId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(agentId)) {
      newExpanded.delete(agentId);
    } else {
      newExpanded.add(agentId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderAgentNode = (agent: any, depth: number = 0) => {
    const isExpanded = expandedNodes.has(agent.agentId);
    const hasChildren = agent.children && agent.children.length > 0;

    return (
      <div key={agent.id} className="ml-4">
        <div className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-accent/10 transition-colors">
          {hasChildren && (
            <button
              onClick={() => toggleNode(agent.agentId)}
              className="text-accent hover:text-accent-foreground transition-colors"
            >
              {isExpanded ? "▼" : "▶"}
            </button>
          )}
          {!hasChildren && <div className="w-5" />}

          <div className="flex-1">
            <p className="font-bold text-accent neon-glow">{agent.name}</p>
            <p className="text-xs text-muted-foreground">
              {agent.specialization} • Gen {agent.generation} • DNA: {agent.dnaHash.slice(0, 8)}...
            </p>
          </div>

          <div className="flex items-center gap-2 text-right">
            <div className="text-xs">
              <p className="text-green-400">❤️ {agent.health}%</p>
              <p className="text-cyan-400">💰 {agent.balance} Ⓣ</p>
            </div>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="border-l-2 border-accent/30 ml-2">
            {agent.children.map((child: any) => renderAgentNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
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
            <Users className="w-5 h-5 text-accent neon-glow" />
            <h1 className="text-2xl font-bold neon-glow">Genealogy Tree</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Visualize linhagens de agentes, DNA herdado e gerações de evolução
          </p>
        </div>
      </header>

      <div className="container py-8">
        {/* Create Child */}
        <Card className="card-neon p-6 mb-8">
          <h2 className="text-lg font-bold mb-4 text-accent neon-glow">Criar Descendente</h2>

          <div className="space-y-4">
            {/* Parent Agent */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Agente Pai/Mãe</label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full mt-2 px-3 py-2 rounded-lg border-2 border-accent bg-transparent text-foreground"
              >
                <option value="">-- Selecione agente progenitor --</option>
                {agentsQuery.data?.map((agent) => (
                  <option key={agent.id} value={agent.agentId}>
                    {agent.name} ({agent.specialization})
                  </option>
                ))}
              </select>
            </div>

            {/* Child Name */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome do Descendente</label>
              <Input
                placeholder="Ex: Nova-Genesis-Alpha"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="w-full mt-2 px-3 py-2 rounded-lg border-2 border-accent bg-transparent text-foreground"
              />
            </div>

            {/* Child Specialization */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Especialização</label>
              <select
                value={childSpecialization}
                onChange={(e) => setChildSpecialization(e.target.value)}
                className="w-full mt-2 px-3 py-2 rounded-lg border-2 border-accent bg-transparent text-foreground"
              >
                <option value="">-- Selecione especialização --</option>
                <option value="analyst">📊 Analista de Dados</option>
                <option value="developer">💻 Desenvolvedor</option>
                <option value="trader">📈 Trader</option>
                <option value="creator">🎨 Criador de Conteúdo</option>
                <option value="researcher">🔬 Pesquisador</option>
                <option value="strategist">🎯 Estrategista</option>
                <option value="guardian">🛡️ Guardião</option>
              </select>
            </div>

            {/* DNA Inheritance Info */}
            {selectedAgent && (
              <Card className="card-neon-cyan p-4">
                <p className="text-sm font-bold text-cyan-400 mb-2">🧬 Herança de DNA</p>
                <p className="text-xs text-muted-foreground">
                  O descendente herdará 70% do DNA do progenitor e 30% de variação aleatória, criando
                  uma nova identidade única mantendo características parentais.
                </p>
              </Card>
            )}

            <Button
              className="btn-neon w-full"
              onClick={handleCreateChild}
              disabled={isCreating || !selectedAgent || !childName || !childSpecialization}
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Manifestar Descendente
            </Button>
          </div>
        </Card>

        {/* Genealogy Visualization */}
        {selectedAgent && (
          <div>
            <h2 className="text-lg font-bold mb-6 neon-glow-cyan">Árvore Genealógica</h2>

            {genealogyQuery.isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-accent w-8 h-8" />
              </div>
            ) : genealogyQuery.data ? (
              <Card className="card-neon p-6">
                <div className="space-y-2">
                  {renderAgentNode(genealogyQuery.data)}

                  {/* Statistics */}
                  <div className="mt-8 pt-6 border-t border-border/50">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-accent neon-glow">
                          {genealogyQuery.data.generation}
                        </p>
                        <p className="text-xs text-muted-foreground">Geração</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-cyan-400">
                          {genealogyQuery.data.children?.length || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Descendentes Diretos</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-pink-400">
                          {genealogyQuery.data.dnaHash.slice(0, 12)}
                        </p>
                        <p className="text-xs text-muted-foreground">DNA Hash</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="card-neon p-12 text-center">
                <Users className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma genealogia encontrada</p>
              </Card>
            )}
          </div>
        )}

        {!selectedAgent && (
          <Card className="card-neon p-12 text-center">
            <Users className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Selecione um agente para visualizar sua genealogia</p>
          </Card>
        )}
      </div>
    </div>
  );
}
