import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitBranch, Users, Zap, Heart } from "lucide-react";

export default function Genealogy() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [filterGeneration, setFilterGeneration] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const agentsQuery = trpc.agents.list.useQuery();
  const agents = agentsQuery.data || [];

  const getGenerationColor = (generation: number) => {
    const colors = ["bg-blue-900", "bg-purple-900", "bg-pink-900", "bg-indigo-900", "bg-violet-900"];
    return colors[Math.min(generation - 1, colors.length - 1)];
  };

  const getGenerationLabel = (generation: number) => {
    const labels = ["Gênese", "Geração 2", "Geração 3", "Geração 4", "Geração 5+"];
    return labels[Math.min(generation - 1, labels.length - 1)];
  };

  const filteredAgents = agents.filter((agent: any) => {
    const matchesGeneration = filterGeneration === "all" || agent.generationNumber === parseInt(filterGeneration);
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGeneration && matchesSearch;
  });

  const generationGroups = agents.reduce((acc: any, agent: any) => {
    const gen = agent.generationNumber || 1;
    if (!acc[gen]) acc[gen] = [];
    acc[gen].push(agent);
    return acc;
  }, {});

  const sortedGenerations = Object.keys(generationGroups).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Genealogia de Agentes</h1>
          <p className="text-slate-400">Árvore genealógica, linhagens e herança de DNA</p>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">Buscar</label>
                <Input
                  placeholder="Nome ou especialização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">Filtrar por Geração</label>
                <Select value={filterGeneration} onValueChange={setFilterGeneration}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all">Todas as Gerações</SelectItem>
                    {sortedGenerations.map((gen) => (
                      <SelectItem key={gen} value={gen}>
                        {getGenerationLabel(parseInt(gen))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <div className="text-sm text-slate-400">
                  Total: <span className="text-white font-semibold">{filteredAgents.length}</span> agentes
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="tree" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700">
            <TabsTrigger value="tree" className="text-slate-300">
              <GitBranch className="h-4 w-4 mr-2" />
              Árvore Genealógica
            </TabsTrigger>
            <TabsTrigger value="list" className="text-slate-300">
              <Users className="h-4 w-4 mr-2" />
              Lista de Agentes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tree" className="mt-4">
            <div className="space-y-6">
              {sortedGenerations.map((generation) => (
                <Card key={generation} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <GitBranch className="h-5 w-5 text-blue-400" />
                      {getGenerationLabel(parseInt(generation))}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      {generationGroups[generation].length} agentes nesta geração
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {generationGroups[generation].map((agent: any) => (
                        <div
                          key={agent.agentId}
                          className={`p-4 rounded border border-slate-600 cursor-pointer hover:border-blue-500 transition ${
                            selectedAgent === agent.agentId ? "bg-slate-700 border-blue-500" : "bg-slate-700/50"
                          }`}
                          onClick={() => setSelectedAgent(agent.agentId)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold text-white">{agent.name}</p>
                              <p className="text-xs text-slate-400">{agent.specialization}</p>
                            </div>
                            <Badge className={`${getGenerationColor(agent.generationNumber)} text-white`}>
                              Gen {agent.generationNumber}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Saúde:</span>
                              <span className="text-white">{agent.health}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Energia:</span>
                              <span className="text-white">{agent.energy}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Reputação:</span>
                              <span className="text-white">{agent.reputation}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Capital:</span>
                              <span className="text-green-400">{agent.balance}Ⓣ</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-300 font-semibold">Nome</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-semibold">Especialização</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-semibold">Geração</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-semibold">Saúde</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-semibold">Energia</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-semibold">Reputação</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-semibold">Capital</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAgents.map((agent: any) => (
                        <tr
                          key={agent.agentId}
                          className="border-b border-slate-700 hover:bg-slate-700/50 transition cursor-pointer"
                          onClick={() => setSelectedAgent(agent.agentId)}
                        >
                          <td className="py-3 px-4 text-slate-200 font-medium">{agent.name}</td>
                          <td className="py-3 px-4 text-slate-300">{agent.specialization}</td>
                          <td className="py-3 px-4">
                            <Badge className={`${getGenerationColor(agent.generationNumber)} text-white`}>
                              Gen {agent.generationNumber}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              agent.status === "active" ? "bg-green-900 text-green-200" :
                              agent.status === "sleeping" ? "bg-yellow-900 text-yellow-200" :
                              "bg-red-900 text-red-200"
                            }`}>
                              {agent.status === "active" ? "Ativo" : agent.status === "sleeping" ? "Hibernando" : "Inativo"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Heart className="h-3 w-3 text-red-400" />
                              <span className="text-slate-300">{agent.health}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Zap className="h-3 w-3 text-yellow-400" />
                              <span className="text-slate-300">{agent.energy}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-300">{agent.reputation}</td>
                          <td className="py-3 px-4 text-green-400 font-semibold">{agent.balance}Ⓣ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Selected Agent Details */}
        {selectedAgent && (
          <Card className="mt-8 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Detalhes do Agente</CardTitle>
            </CardHeader>
            <CardContent>
              {agents
                .filter((a: any) => a.agentId === selectedAgent)
                .map((agent: any) => (
                  <div key={agent.agentId} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-400">Nome</p>
                        <p className="text-white font-semibold">{agent.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">ID</p>
                        <p className="text-white font-mono text-sm">{agent.agentId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Especialização</p>
                        <p className="text-white font-semibold">{agent.specialization}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Geração</p>
                        <p className="text-white font-semibold">{agent.generationNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">DNA Hash</p>
                        <p className="text-white font-mono text-xs break-all">{agent.dnaHash?.slice(0, 32)}...</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Status</p>
                        <Badge className={
                          agent.status === "active" ? "bg-green-900 text-green-200" :
                          agent.status === "sleeping" ? "bg-yellow-900 text-yellow-200" :
                          "bg-red-900 text-red-200"
                        }>
                          {agent.status === "active" ? "Ativo" : agent.status === "sleeping" ? "Hibernando" : "Inativo"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
