import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

export default function Governance() {
  const { data: proposals, isLoading: proposalsLoading, refetch: refetchProposals } = trpc.governance.getProposals.useQuery({ limit: 20 });
  const { data: council, isLoading: councilLoading } = trpc.governance.getCouncil.useQuery();
  const voteM = trpc.governance.vote.useMutation();
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);

  // WebSocket listener
  useWebSocket((event) => {
    if (event.type === "governance:vote:cast" || event.type === "governance:proposal:updated") {
      refetchProposals();
    }
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      executed: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    };
    return colors[status] || colors.open;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      investment: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      succession: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      policy: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      emergency: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      innovation: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    };
    return colors[type] || colors.policy;
  };

  const handleVote = async (proposalId: number, memberId: number, vote: "yes" | "no" | "abstain") => {
    try {
      await voteM.mutateAsync({ proposalId, memberId, vote });
      refetchProposals();
    } catch (error) {
      console.error("Erro ao votar:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Governança e Conselho</h1>

      {/* Membros do Conselho */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Membros do Conselho</h2>
        {councilLoading ? (
          <Loader2 className="animate-spin text-muted-foreground" />
        ) : council && council.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {council.map((member) => (
              <div key={member.id} className="p-4 border border-border rounded-lg">
                <h3 className="font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                <p className="text-xs text-muted-foreground mt-2">Poder de Voto: {member.votingPower}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhum membro do conselho</p>
        )}
      </Card>

      {/* Propostas */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Propostas</h2>
        {proposalsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : proposals && proposals.length > 0 ? (
          proposals.map((proposal) => (
            <Card
              key={proposal.id}
              className="p-6 bg-card border-border hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedProposal(proposal.id)}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{proposal.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{proposal.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getTypeColor(proposal.type)}>
                      {proposal.type.charAt(0).toUpperCase() + proposal.type.slice(1)}
                    </Badge>
                    <Badge className={getStatusColor(proposal.status)}>
                      {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-border">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-lg font-semibold text-foreground">{proposal.votesYes}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Sim</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-lg font-semibold text-foreground">{proposal.votesNo}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Não</p>
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-semibold text-foreground">{proposal.votesAbstain}</span>
                    <p className="text-xs text-muted-foreground">Abstenção</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Criada em {new Date(proposal.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma proposta disponível</p>
          </div>
        )}
      </div>
    </div>
  );
}
