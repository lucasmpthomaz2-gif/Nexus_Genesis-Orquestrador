import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import HubLayout from "@/components/HubLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Crown, Zap } from "lucide-react";

interface CouncilMember {
  id: number;
  name: string;
  role: string;
  description: string | null;
  votingPower: number;
  specialization: string | null;
}

export default function Council() {
  const [members, setMembers] = useState<CouncilMember[]>([]);
  const [loading, setLoading] = useState(true);

  const membersQuery = trpc.hub.council.getMembers.useQuery();
  const initMutation = trpc.hub.council.initialize.useMutation();

  useEffect(() => {
    if (membersQuery.data) {
      setMembers(membersQuery.data);
    }
  }, [membersQuery.data]);

  useEffect(() => {
    setLoading(membersQuery.isLoading);
  }, [membersQuery.isLoading]);

  const handleInitialize = async () => {
    try {
      await initMutation.mutateAsync();
      await membersQuery.refetch();
    } catch (error) {
      console.error("Erro ao inicializar conselho:", error);
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

  const totalVotingPower = members.reduce((sum, m) => sum + m.votingPower, 0);

  const councilRoles = [
    { name: "AETERNO", role: "Patriarca", icon: "👑", color: "from-yellow-400 to-orange-500" },
    { name: "EVA-ALPHA", role: "Matriarca", icon: "✨", color: "from-pink-400 to-rose-500" },
    { name: "IMPERADOR-CORE", role: "Guardião do Cofre", icon: "🏛️", color: "from-purple-400 to-indigo-500" },
    { name: "AETHELGARD", role: "Juíza", icon: "⚖️", color: "from-blue-400 to-cyan-500" },
    { name: "NEXUS-ORACLE", role: "Vidente", icon: "🔮", color: "from-green-400 to-emerald-500" },
    { name: "INNOVATOR-X", role: "Inovador", icon: "⚡", color: "from-red-400 to-pink-500" },
    { name: "RISK-SENTINEL", role: "Sentinela", icon: "🛡️", color: "from-slate-400 to-slate-600" },
  ];

  return (
    <HubLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Conselho dos Arquitetos
          </h1>
          <p className="text-slate-400">
            7 Agentes IA de Elite Governando o Ecossistema
          </p>
        </div>

        {/* Council Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Total de Membros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-400">{members.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Poder de Votação Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">{totalVotingPower}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-600 text-white">Ativo</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Initialize Button */}
        {members.length === 0 && (
          <div className="text-center py-8">
            <Button
              onClick={handleInitialize}
              disabled={initMutation.isPending}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              {initMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Inicializando...
                </>
              ) : (
                <>
                  <Crown className="mr-2" size={18} />
                  Inicializar Conselho
                </>
              )}
            </Button>
          </div>
        )}

        {/* Council Members Grid */}
        {members.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-200 mb-4">Membros do Conselho</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {members.map((member) => {
                const roleInfo = councilRoles.find(r => r.name === member.name);
                return (
                  <Card
                    key={member.id}
                    className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-3xl">{roleInfo?.icon}</div>
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                          {member.votingPower}x
                        </Badge>
                      </div>
                      <CardTitle className="text-slate-200">{member.name}</CardTitle>
                      <CardDescription className="text-xs">{member.role}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Especialização</p>
                        <p className="text-sm text-slate-300">{member.specialization}</p>
                      </div>
                      {member.description && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Descrição</p>
                          <p className="text-xs text-slate-400 line-clamp-2">{member.description}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Council Info */}
        <Card className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap size={20} className="text-cyan-400" />
              Sistema de Votação Ponderada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300">
            <p>
              O Conselho dos Arquitetos utiliza um sistema de votação ponderada onde cada membro possui um poder de voto específico.
              Os membros de elite (AETERNO, EVA-ALPHA, IMPERADOR-CORE, AETHELGARD) possuem 2x de poder de voto, enquanto os
              especialistas (NEXUS-ORACLE, INNOVATOR-X, RISK-SENTINEL) possuem 1x.
            </p>
            <p>
              Decisões críticas como investimentos, sucessões de startups e políticas de governança requerem aprovação do conselho
              através de votação ponderada.
            </p>
          </CardContent>
        </Card>
      </div>
    </HubLayout>
  );
}
