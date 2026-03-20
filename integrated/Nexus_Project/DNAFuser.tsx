import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Dna } from "lucide-react";
import { useLocation } from "wouter";

interface TraitValues {
  [key: string]: number;
}

export default function DNAFuser() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"mode" | "create" | "fuse">("mode");
  const [agentName, setAgentName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [traits, setTraits] = useState<TraitValues>({
    intelligence: 50,
    creativity: 50,
    empathy: 50,
    resilience: 50,
  });
  const [parentId1, setParentId1] = useState<number | null>(null);
  const [parentId2, setParentId2] = useState<number | null>(null);
  const [newAgentName, setNewAgentName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: userAgents } = trpc.agents.listByUser.useQuery(undefined, {
    enabled: !!user,
  });

  const createAgentMutation = trpc.agents.create.useMutation();
  const fuseDNAMutation = trpc.agents.fuseDNA.useMutation();

  const handleCreateAgent = async () => {
    if (!agentName || !specialization) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    try {
      await createAgentMutation.mutateAsync({
        name: agentName,
        specialization,
        traits,
      });
      alert("Agente criado com sucesso!");
      setAgentName("");
      setSpecialization("");
      setTraits({
        intelligence: 50,
        creativity: 50,
        empathy: 50,
        resilience: 50,
      });
      setStep("mode");
      setLocation("/dashboard");
    } catch (error) {
      alert("Erro ao criar agente: " + String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFuseDNA = async () => {
    if (!parentId1 || !parentId2 || !newAgentName) {
      alert("Por favor, selecione dois pais e um nome para o novo agente");
      return;
    }

    setIsLoading(true);
    try {
      await fuseDNAMutation.mutateAsync({
        parentId1,
        parentId2,
        newAgentName,
      });
      alert("Novo agente criado através da fusão de DNA!");
      setParentId1(null);
      setParentId2(null);
      setNewAgentName("");
      setStep("mode");
      setLocation("/dashboard");
    } catch (error) {
      alert("Erro ao fundir DNA: " + String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTraitChange = (trait: string, value: number) => {
    setTraits({
      ...traits,
      [trait]: Math.max(0, Math.min(100, value)),
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-600 mb-2 flex items-center gap-3">
          <Dna size={40} /> DNA Fuser
        </h1>
        <p className="text-gray-400">Crie e funda agentes inteligentes</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {step === "mode" && (
          <Card className="bg-gray-900 border-cyan-500">
            <CardHeader>
              <CardTitle className="text-cyan-400">Escolha um Modo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => setStep("create")}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 h-12 text-lg"
              >
                Criar Novo Agente
              </Button>
              <Button
                onClick={() => setStep("fuse")}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 h-12 text-lg"
              >
                Fundir DNA (Reprodução)
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "create" && (
          <Card className="bg-gray-900 border-cyan-500">
            <CardHeader>
              <CardTitle className="text-cyan-400">Criar Novo Agente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Agente
                </label>
                <Input
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Ex: Alpha-7"
                  className="bg-gray-800 border-cyan-500 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Especialização
                </label>
                <Input
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="Ex: Análise de Dados"
                  className="bg-gray-800 border-cyan-500 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Características Genéticas
                </label>
                <div className="space-y-4">
                  {Object.entries(traits).map(([trait, value]) => (
                    <div key={trait}>
                      <div className="flex justify-between mb-2">
                        <span className="text-cyan-400 capitalize">{trait}</span>
                        <span className="text-pink-400 font-bold">{value}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) =>
                          handleTraitChange(trait, parseInt(e.target.value))
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-600"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  onClick={() => setStep("mode")}
                  variant="outline"
                  className="flex-1 border-gray-600 hover:border-gray-400"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleCreateAgent}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-pink-600 hover:from-cyan-700 hover:to-pink-700"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Criar Agente"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "fuse" && (
          <Card className="bg-gray-900 border-cyan-500">
            <CardHeader>
              <CardTitle className="text-pink-400">Fundir DNA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Primeiro Pai
                </label>
                <select
                  value={parentId1 || ""}
                  onChange={(e) => setParentId1(parseInt(e.target.value))}
                  className="w-full bg-gray-800 border-2 border-cyan-500 text-white p-2 rounded"
                >
                  <option value="">Selecione um agente</option>
                  {userAgents?.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Segundo Pai
                </label>
                <select
                  value={parentId2 || ""}
                  onChange={(e) => setParentId2(parseInt(e.target.value))}
                  className="w-full bg-gray-800 border-2 border-cyan-500 text-white p-2 rounded"
                >
                  <option value="">Selecione um agente</option>
                  {userAgents?.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Novo Agente
                </label>
                <Input
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  placeholder="Ex: Hybrid-Alpha"
                  className="bg-gray-800 border-cyan-500 text-white"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  onClick={() => setStep("mode")}
                  variant="outline"
                  className="flex-1 border-gray-600 hover:border-gray-400"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleFuseDNA}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Fundir DNA"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
