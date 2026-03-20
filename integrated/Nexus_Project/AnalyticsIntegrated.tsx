import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Loader2, TrendingUp, Download } from "lucide-react";
import { useState } from "react";

type Period = "7d" | "30d" | "90d" | "all";

const COLORS = ["#FF006E", "#00D9FF", "#00FF41", "#FFFF00", "#FF6B9D"];

export default function AnalyticsIntegrated() {
  const { user, loading: authLoading } = useAuth();
  const [period, setPeriod] = useState<Period>("30d");

  // Queries
  const { data: mainMetrics, isLoading: metricsLoading } = trpc.analytics.getMainMetrics.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: specializationData } = trpc.analytics.getSpecializationDistribution.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: transactionData } = trpc.analytics.getTransactionTypeDistribution.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: healthData } = trpc.analytics.getHealthDistribution.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: growthData } = trpc.analytics.getGrowthData.useQuery(
    { period },
    { enabled: !!user }
  );

  const { data: nftStats } = trpc.analytics.getNFTStats.useQuery(undefined, {
    enabled: !!user,
  });

  const handleExportJSON = () => {
    alert("Exportação JSON disponível via API tRPC");
  };

  const handleExportCSV = () => {
    alert("Exportação CSV disponível via API tRPC");
  };

  if (authLoading) {
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
            <TrendingUp className="w-5 h-5 text-accent neon-glow" />
            <h1 className="text-2xl font-bold neon-glow">Analytics</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Métricas e tendências do ecossistema NEXUS
          </p>
        </div>
      </header>

      <div className="container py-8">
        {/* Main Metrics */}
        {mainMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="card-neon p-6">
              <p className="text-xs text-muted-foreground mb-2">Total de Agentes</p>
              <p className="text-3xl font-bold neon-glow">{mainMetrics.totalAgents}</p>
              <p className="text-xs text-cyan-400 mt-2">
                {mainMetrics.activeAgents} ativos
              </p>
            </Card>
            <Card className="card-neon p-6">
              <p className="text-xs text-muted-foreground mb-2">Transações</p>
              <p className="text-3xl font-bold text-green-400">
                {mainMetrics.totalTransactions}
              </p>
              <p className="text-xs text-green-400 mt-2">
                Volume: {mainMetrics.totalVolume.toFixed(2)}
              </p>
            </Card>
            <Card className="card-neon p-6">
              <p className="text-xs text-muted-foreground mb-2">NFTs Forjados</p>
              <p className="text-3xl font-bold text-orange-400">{mainMetrics.totalNFTs}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Reputação média: {mainMetrics.avgReputation}
              </p>
            </Card>
          </div>
        )}

        {/* Period Selector */}
        <div className="flex gap-2 mb-8">
          {(["7d", "30d", "90d", "all"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                period === p
                  ? "border-accent bg-accent/20 neon-glow"
                  : "border-border/50 hover:border-accent/50"
              }`}
            >
              {p === "7d" ? "7 dias" : p === "30d" ? "30 dias" : p === "90d" ? "90 dias" : "Tudo"}
            </button>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Growth Chart */}
          {growthData && (
            <Card className="card-neon p-6">
              <h3 className="text-lg font-bold mb-4 neon-glow">Crescimento</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0e27",
                      border: "2px solid #FF006E",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="agents"
                    stroke="#FF006E"
                    strokeWidth={2}
                    name="Agentes"
                  />
                  <Line
                    type="monotone"
                    dataKey="transactions"
                    stroke="#00D9FF"
                    strokeWidth={2}
                    name="Transações"
                  />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="#00FF41"
                    strokeWidth={2}
                    name="Volume"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Specialization Distribution */}
          {specializationData && specializationData.length > 0 && (
            <Card className="card-neon p-6">
              <h3 className="text-lg font-bold mb-4 neon-glow">Especialidades</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={specializationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#FF006E"
                    dataKey="value"
                  >
                    {specializationData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0e27",
                      border: "2px solid #FF006E",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Transaction Types */}
          {transactionData && transactionData.length > 0 && (
            <Card className="card-neon p-6">
              <h3 className="text-lg font-bold mb-4 neon-glow">Tipos de Transações</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={transactionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="type" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0e27",
                      border: "2px solid #FF006E",
                    }}
                  />
                  <Bar dataKey="count" fill="#FF006E" name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Health Distribution */}
          {healthData && healthData.length > 0 && (
            <Card className="card-neon p-6">
              <h3 className="text-lg font-bold mb-4 neon-glow">Distribuição de Saúde</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="range" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0e27",
                      border: "2px solid #FF006E",
                    }}
                  />
                  <Bar dataKey="agents" fill="#00D9FF" name="Agentes" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>

        {/* NFT Stats */}
        {nftStats && (
          <Card className="card-neon p-6 mb-8">
            <h3 className="text-lg font-bold mb-4 neon-glow">Estatísticas de NFTs</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-orange-400">{nftStats.total}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold text-green-400">
                  {nftStats.totalValue.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Valor Médio</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {nftStats.avgValue.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Raridades</p>
                <p className="text-2xl font-bold text-pink-400">
                  {Object.keys(nftStats.rarityDistribution).length}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Export Section */}
        <Card className="card-neon p-6">
          <h3 className="text-lg font-bold mb-4 neon-glow flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportar Dados
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button
              onClick={handleExportJSON}
              className="btn-neon text-sm"
            >
              JSON Completo
            </Button>
            <Button
              onClick={handleExportCSV}
              className="btn-neon text-sm"
            >
              Agentes CSV
            </Button>
            <Button
              onClick={handleExportCSV}
              className="btn-neon text-sm"
            >
              Transações CSV
            </Button>
            <Button
              onClick={handleExportCSV}
              className="btn-neon text-sm"
            >
              NFTs CSV
            </Button>
            <Button
              onClick={handleExportCSV}
              className="btn-neon text-sm"
            >
              Sinais CSV
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
