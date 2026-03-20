import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import HubLayout from "@/components/HubLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Users, Zap, Wallet } from "lucide-react";

interface StartupMetrics {
  name: string;
  revenue: number;
  traction: number;
  reputation: number;
  status: string;
  isCore: boolean;
}

export default function Dashboard() {
  const [startups, setStartups] = useState<StartupMetrics[]>([]);
  const [vault, setVault] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const startupsQuery = trpc.hub.startups.list.useQuery();
  const vaultQuery = trpc.hub.finance.getMasterVault.useQuery();

  useEffect(() => {
    if (startupsQuery.data) {
      setStartups(startupsQuery.data);
    }
  }, [startupsQuery.data]);

  useEffect(() => {
    if (vaultQuery.data) {
      setVault(vaultQuery.data);
    }
  }, [vaultQuery.data]);

  useEffect(() => {
    if (startupsQuery.isLoading || vaultQuery.isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [startupsQuery.isLoading, vaultQuery.isLoading]);

  if (loading) {
    return (
      <HubLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="animate-spin text-cyan-400" size={40} />
        </div>
      </HubLayout>
    );
  }

  const coreStartup = startups.find((s) => s.isCore);
  const challengerStartups = startups.filter((s) => !s.isCore);

  return (
    <HubLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            NEXUS-HUB Dashboard
          </h1>
          <p className="text-slate-400">
            Plataforma de Governança Descentralizada para Startups Impulsionadas por IA
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Zap size={16} className="text-cyan-400" />
                Total de Startups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-400">{startups.length}</div>
              <p className="text-xs text-slate-500 mt-1">
                {coreStartup ? "1 Core + " + challengerStartups.length + " Desafiantes" : "Nenhuma"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Wallet size={16} className="text-green-400" />
                Master Vault
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">
                ${(vault?.totalBalance || 0) / 1000}K
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {vault?.btcReserve || 0} BTC em reserva
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-400" />
                Receita Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">
                ${startups.reduce((sum, s) => sum + (s.revenue || 0), 0) / 1000}K
              </div>
              <p className="text-xs text-slate-500 mt-1">Todas as startups</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Users size={16} className="text-purple-400" />
                Reputação Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">
                {startups.length > 0
                  ? Math.round(
                      startups.reduce((sum, s) => sum + (s.reputation || 0), 0) / startups.length
                    )
                  : 0}
              </div>
              <p className="text-xs text-slate-500 mt-1">Ecossistema</p>
            </CardContent>
          </Card>
        </div>

        {/* Core Startup */}
        {coreStartup && (
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-cyan-400">{coreStartup.name}</CardTitle>
                  <CardDescription>Startup Core - Líder do Ecossistema</CardDescription>
                </div>
                <Badge className="bg-cyan-500 text-slate-950">CORE</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Receita</p>
                  <p className="text-2xl font-bold text-cyan-400">${coreStartup.revenue / 1000}K</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Tração</p>
                  <p className="text-2xl font-bold text-blue-400">{coreStartup.traction}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Reputação</p>
                  <p className="text-2xl font-bold text-purple-400">{coreStartup.reputation}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Status</p>
                  <Badge className="mt-1 bg-green-600">{coreStartup.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Challenger Startups */}
        {challengerStartups.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-200 mb-4">Startups Desafiantes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {challengerStartups.map((startup, idx) => (
                <Card key={idx} className="bg-slate-900 border-slate-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-slate-200">{startup.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Receita:</span>
                      <span className="text-cyan-400 font-semibold">${startup.revenue / 1000}K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Tração:</span>
                      <span className="text-blue-400 font-semibold">{startup.traction}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Reputação:</span>
                      <span className="text-purple-400 font-semibold">{startup.reputation}</span>
                    </div>
                    <div className="pt-2">
                      <Badge className="bg-slate-700">{startup.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {startups.length === 0 && (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="py-12 text-center">
              <p className="text-slate-400">Nenhuma startup criada ainda.</p>
              <p className="text-sm text-slate-500">
                Acesse a seção de Startups para criar novas empresas.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </HubLayout>
  );
}
