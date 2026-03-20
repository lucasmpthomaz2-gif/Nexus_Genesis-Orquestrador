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
import { CheckCircle, XCircle, Clock, Vote, FileText } from "lucide-react";

export default function Governance() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    proposedByAgentId: "",
  });

  const proposalsQuery = trpc.proposals.list.useQuery();
  const agentsQuery = trpc.agents.list.useQuery();
  const createProposalMutation = trpc.proposals.create.useMutation();
  const voteMutation = trpc.proposals.vote.useMutation();

  const proposals = proposalsQuery.data || [];
  const agents = agentsQuery.data || [];

  const handleCreateProposal = async () => {
    if (!formData.title || !formData.description || !formData.proposedByAgentId) return;

    try {
      await createProposalMutation.mutateAsync(formData);
      setFormData({ title: "", description: "", proposedByAgentId: "" });
      setIsCreateOpen(false);
      proposalsQuery.refetch();
    } catch (error) {
      console.error("Erro ao criar proposta:", error);
    }
  };

  const handleVote = async (proposalId: string, agentId: string, voteType: "for" | "against") => {
    try {
      await voteMutation.mutateAsync({ proposalId, agentId, voteType });
      proposalsQuery.refetch();
    } catch (error) {
      console.error("Erro ao votar:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "voting":
        return <Vote className="h-4 w-4 text-blue-500" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-900 text-yellow-200";
      case "voting":
        return "bg-blue-900 text-blue-200";
      case "approved":
        return "bg-green-900 text-green-200";
      case "rejected":
        return "bg-red-900 text-red-200";
      default:
        return "bg-slate-700 text-slate-200";
    }
  };

  const activeProposals = proposals.filter((p: any) => p.status === "voting" || p.status === "draft");
  const closedProposals = proposals.filter((p: any) => p.status === "approved" || p.status === "rejected");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Governança DAO</h1>
            <p className="text-slate-400">Propostas e Votações Descentralizadas</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                Nova Proposta
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Criar Nova Proposta</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Proponha mudanças para o ecossistema
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300">Título</label>
                  <Input
                    placeholder="Título da proposta"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Descrição</label>
                  <Textarea
                    placeholder="Descrição detalhada da proposta"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Proposto por (Agente)</label>
                  <Select value={formData.proposedByAgentId} onValueChange={(value) => setFormData({ ...formData, proposedByAgentId: value })}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Selecione um agente..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {agents.filter((a: any) => a.reputation >= 50).map((agent: any) => (
                        <SelectItem key={agent.agentId} value={agent.agentId}>
                          {agent.name} ({agent.reputation} rep)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-400 mt-1">Apenas agentes com reputação ≥ 50 podem propor</p>
                </div>
                <Button onClick={handleCreateProposal} className="w-full bg-blue-600 hover:bg-blue-700">
                  Criar Proposta
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total de Propostas</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{proposals.length}</div>
              <p className="text-xs text-slate-400">Propostas criadas</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Em Votação</CardTitle>
              <Vote className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeProposals.length}</div>
              <p className="text-xs text-slate-400">Aguardando voto</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Aprovadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {proposals.filter((p: any) => p.status === "approved").length}
              </div>
              <p className="text-xs text-slate-400">Implementadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700">
            <TabsTrigger value="active" className="text-slate-300">
              Propostas Ativas ({activeProposals.length})
            </TabsTrigger>
            <TabsTrigger value="closed" className="text-slate-300">
              Propostas Fechadas ({closedProposals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            <div className="space-y-4">
              {activeProposals.length === 0 ? (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="pt-6">
                    <p className="text-slate-400 text-center">Nenhuma proposta ativa</p>
                  </CardContent>
                </Card>
              ) : (
                activeProposals.map((proposal: any) => (
                  <Card
                    key={proposal.proposalId}
                    className={`bg-slate-800 border-slate-700 cursor-pointer hover:border-blue-500/50 transition ${
                      selectedProposal === proposal.proposalId ? "border-blue-500" : ""
                    }`}
                    onClick={() => setSelectedProposal(proposal.proposalId)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(proposal.status)}
                          <CardTitle className="text-white">{proposal.title}</CardTitle>
                        </div>
                        <Badge className={getStatusColor(proposal.status)}>
                          {proposal.status === "draft" ? "Rascunho" : "Em Votação"}
                        </Badge>
                      </div>
                      <CardDescription className="text-slate-400">
                        Proposto por: {agents.find((a: any) => a.agentId === proposal.proposedByAgentId)?.name || proposal.proposedByAgentId}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-200 mb-4">{proposal.description}</p>

                      {proposal.status === "voting" && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-slate-400">Votos</span>
                            <span className="text-sm text-slate-300">
                              A favor: {proposal.votesFor || 0} | Contra: {proposal.votesAgainst || 0}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Select onValueChange={(agentId) => handleVote(proposal.proposalId, agentId, "for")}>
                              <SelectTrigger className="bg-slate-700 border-slate-600 text-white flex-1">
                                <SelectValue placeholder="Votar a favor..." />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-700 border-slate-600">
                                {agents.filter((a: any) => a.reputation >= 30).map((agent: any) => (
                                  <SelectItem key={agent.agentId} value={agent.agentId}>
                                    {agent.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select onValueChange={(agentId) => handleVote(proposal.proposalId, agentId, "against")}>
                              <SelectTrigger className="bg-slate-700 border-slate-600 text-white flex-1">
                                <SelectValue placeholder="Votar contra..." />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-700 border-slate-600">
                                {agents.filter((a: any) => a.reputation >= 30).map((agent: any) => (
                                  <SelectItem key={agent.agentId} value={agent.agentId}>
                                    {agent.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="closed" className="mt-4">
            <div className="space-y-4">
              {closedProposals.length === 0 ? (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="pt-6">
                    <p className="text-slate-400 text-center">Nenhuma proposta fechada</p>
                  </CardContent>
                </Card>
              ) : (
                closedProposals.map((proposal: any) => (
                  <Card key={proposal.proposalId} className="bg-slate-800 border-slate-700 opacity-75">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(proposal.status)}
                          <CardTitle className="text-white">{proposal.title}</CardTitle>
                        </div>
                        <Badge className={getStatusColor(proposal.status)}>
                          {proposal.status === "approved" ? "Aprovada" : "Rejeitada"}
                        </Badge>
                      </div>
                      <CardDescription className="text-slate-400">
                        Resultado: {proposal.votesFor || 0} a favor vs {proposal.votesAgainst || 0} contra
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
