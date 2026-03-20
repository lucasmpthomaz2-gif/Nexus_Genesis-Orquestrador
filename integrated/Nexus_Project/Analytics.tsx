import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, Users, Zap, Gem, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";

export default function Analytics() {
  const { user, loading } = useAuth();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  // Mock data - em produção, vem da API
  const growthData = [
    { date: "Jan", agents: 5, transactions: 12, volume: 450 },
    { date: "Fev", agents: 8, transactions: 28, volume: 1200 },
    { date: "Mar", agents: 15, transactions: 52, volume: 3400 },
    { date: "Abr", agents: 24, transactions: 98, volume: 7800 },
    { date: "Mai", agents: 38, transactions: 156, volume: 14200 },
    { date: "Jun", agents: 58, transactions: 234, volume: 24500 },
  ];

  const specializationData = [
    { name: "Analyst", value: 18, color: "#FF006E" },
    { name: "Developer", value: 15, color: "#00D9FF" },
    { name: "Trader", value: 12, color: "#FFD60A" },
    { name: "Creator", value: 8, color: "#3A86FF" },
    { name: "Researcher", value: 5, color: "#FB5607" },
  ];

  const transactionTypeData = [
    { type: "Transfer", count: 145, value: 8900 },
    { type: "Autonomous", count: 89, value: 4200 },
    { type: "Reward", count: 56, value: 2100 },
    { type: "Fee Distribution", count: 234, value: 1500 },
  ];

  const healthDistribution = [
    { range: "90-100%", agents: 28, color: "#00FF00" },
    { range: "70-89%", agents: 18, color: "#FFD60A" },
    { range: "50-69%", agents: 8, color: "#FF9500" },
    { range: "<50%", agents: 4, color: "#FF0000" },
  ];

  const metrics = [
    {
      label: "Total de Agentes",
      value: "58",
      change: "+12",
      icon: <Users className="w-5 h-5" />,
      color: "text-pink-400",
    },
    {
      label: "Transações",
      value: "234",
      change: "+45",
      icon: <Zap className="w-5 h-5" />,
      color: "text-cyan-400",
    },
    {
      label: "Volume Total",
      value: "24.5K Ⓣ",
      change: "+8.2K",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-green-400",
    },
    {
      label: "NFTs Forjados",
      value: "142",
      change: "+23",
      icon: <Gem className="w-5 h-5" />,
      color: "text-blue-400",
    },
  ];

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
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent neon-glow" />
              <h1 className="text-2xl font-bold neon-glow">Analytics Dashboard</h1>
            </div>
            <div className="flex gap-2">
              {(["7d", "30d", "90d", "all"] as const).map((range) => (
                <Button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`text-xs py-1 px-2 ${
                    timeRange === range ? "btn-neon" : "btn-neon variant-outline"
                  }`}
                  variant={timeRange === range ? "default" : "outline"}
                >
                  {range === "7d" && "7 dias"}
                  {range === "30d" && "30 dias"}
                  {range === "90d" && "90 dias"}
                  {range === "all" && "Tudo"}
                </Button>
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Métricas e tendências do ecossistema NEXUS</p>
        </div>
      </header>

      <div className="container py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, idx) => (
            <Card key={idx} className="card-neon p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                  <p className={`text-2xl font-bold ${metric.color} neon-glow`}>{metric.value}</p>
                  <p className="text-xs text-green-400 mt-2">↑ {metric.change}</p>
                </div>
                <div className={`${metric.color} opacity-50`}>{metric.icon}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Growth Chart */}
        <Card className="card-neon p-6">
          <h2 className="text-lg font-bold mb-4 neon-glow flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Crescimento do Ecossistema
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{ backgroundColor: "#0a0e27", border: "1px solid #FF006E" }}
                labelStyle={{ color: "#00D9FF" }}
              />
              <Legend />
              <Line type="monotone" dataKey="agents" stroke="#FF006E" strokeWidth={2} name="Agentes" />
              <Line type="monotone" dataKey="transactions" stroke="#00D9FF" strokeWidth={2} name="Transações" />
              <Line type="monotone" dataKey="volume" stroke="#FFD60A" strokeWidth={2} name="Volume (x100)" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Specialization & Transaction Types */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Specialization Distribution */}
          <Card className="card-neon p-6">
            <h2 className="text-lg font-bold mb-4 neon-glow flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-accent" />
              Distribuição de Especialidades
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={specializationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {specializationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#0a0e27", border: "1px solid #FF006E" }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Transaction Types */}
          <Card className="card-neon p-6">
            <h2 className="text-lg font-bold mb-4 neon-glow flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              Tipos de Transações
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={transactionTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="type" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0a0e27", border: "1px solid #FF006E" }}
                  labelStyle={{ color: "#00D9FF" }}
                />
                <Legend />
                <Bar dataKey="count" fill="#FF006E" name="Quantidade" />
                <Bar dataKey="value" fill="#00D9FF" name="Valor (Ⓣ)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Health Distribution */}
        <Card className="card-neon p-6">
          <h2 className="text-lg font-bold mb-4 neon-glow flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            Distribuição de Saúde dos Agentes
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={healthDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="range" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{ backgroundColor: "#0a0e27", border: "1px solid #FF006E" }}
                labelStyle={{ color: "#00D9FF" }}
              />
              <Bar dataKey="agents" fill="#FFD60A" name="Agentes" radius={[8, 8, 0, 0]}>
                {healthDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-neon p-4">
            <h3 className="font-bold text-accent mb-2">📈 Tendência</h3>
            <p className="text-sm text-muted-foreground">
              Crescimento exponencial detectado. Ecossistema em expansão acelerada.
            </p>
          </Card>

          <Card className="card-neon-cyan p-4">
            <h3 className="font-bold text-cyan-400 mb-2">🎯 Especialidade Dominante</h3>
            <p className="text-sm text-muted-foreground">
              Analysts (31%) liderando, seguidos por Developers (26%).
            </p>
          </Card>

          <Card className="card-neon p-4">
            <h3 className="font-bold text-green-400 mb-2">💪 Saúde Geral</h3>
            <p className="text-sm text-muted-foreground">
              93% dos agentes em estado ótimo. Ecossistema estável e harmônico.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
