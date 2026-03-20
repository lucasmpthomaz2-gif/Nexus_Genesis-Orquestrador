import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2, TrendingUp, BarChart3, PieChart as PieChartIcon } from "lucide-react";

export default function AdvancedMetrics() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  // Mock data for growth
  const growthData = [
    { date: "Jan 1", agents: 5, transactions: 12 },
    { date: "Jan 8", agents: 8, transactions: 24 },
    { date: "Jan 15", agents: 12, transactions: 45 },
    { date: "Jan 22", agents: 18, transactions: 78 },
    { date: "Jan 29", agents: 25, transactions: 120 },
    { date: "Feb 5", agents: 35, transactions: 180 },
    { date: "Feb 12", agents: 48, transactions: 250 },
    { date: "Feb 18", agents: 62, transactions: 340 },
  ];

  // Mock data for specializations
  const specializationData = [
    { name: "Data Analyst", value: 18, color: "#FF006E" },
    { name: "Developer", value: 22, color: "#00D9FF" },
    { name: "Designer", value: 12, color: "#FFD60A" },
    { name: "Manager", value: 10, color: "#06FFA5" },
  ];

  // Mock data for transaction types
  const transactionTypeData = [
    { type: "Transfer", count: 85 },
    { type: "Reward", count: 120 },
    { type: "Fee", count: 45 },
    { type: "Dividend", count: 90 },
  ];

  // Query for real data
  const { data: analyticsData, isLoading } = trpc.analytics.getMainMetrics.useQuery();

  const COLORS = ["#FF006E", "#00D9FF", "#FFD60A", "#06FFA5", "#FF006E"];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent neon-glow" />
              <h1 className="text-2xl font-bold neon-glow">Advanced Metrics</h1>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2">
            {(["7d", "30d", "90d", "1y"] as const).map((p) => (
              <Button
                key={p}
                onClick={() => setPeriod(p)}
                className={`text-sm ${
                  period === p
                    ? "btn-neon"
                    : "btn-neon-outline hover:border-accent/50"
                }`}
                variant={period === p ? "default" : "outline"}
              >
                {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : p === "90d" ? "90 Days" : "1 Year"}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <div className="container py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-accent w-8 h-8" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Growth Chart */}
            <Card className="card-neon p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold neon-glow">Ecosystem Growth</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0e27",
                      border: "1px solid #FF006E",
                      borderRadius: "4px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="agents"
                    stroke="#00D9FF"
                    strokeWidth={2}
                    dot={{ fill: "#00D9FF", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Agents"
                  />
                  <Line
                    type="monotone"
                    dataKey="transactions"
                    stroke="#FF006E"
                    strokeWidth={2}
                    dot={{ fill: "#FF006E", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Transactions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Specializations */}
              <Card className="card-neon p-6">
                <div className="flex items-center gap-2 mb-4">
                  <PieChartIcon className="w-5 h-5 text-pink-400" />
                  <h2 className="text-lg font-bold neon-glow">Specializations</h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
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
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0a0e27",
                        border: "1px solid #FF006E",
                        borderRadius: "4px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              {/* Transaction Types */}
              <Card className="card-neon p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-lg font-bold neon-glow">Transaction Types</h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={transactionTypeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="type" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0a0e27",
                        border: "1px solid #FF006E",
                        borderRadius: "4px",
                      }}
                    />
                    <Bar dataKey="count" fill="#00D9FF" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Key Metrics */}
            {analyticsData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="card-neon p-4">
                  <p className="text-xs text-muted-foreground mb-2">Total Agents</p>
                  <p className="text-3xl font-bold text-cyan-400">
                    {analyticsData.totalAgents}
                  </p>
                  <p className="text-xs text-green-400 mt-2">↑ 12% this period</p>
                </Card>
                <Card className="card-neon p-4">
                  <p className="text-xs text-muted-foreground mb-2">Total Transactions</p>
                  <p className="text-3xl font-bold text-pink-400">
                    {analyticsData.totalTransactions}
                  </p>
                  <p className="text-xs text-green-400 mt-2">↑ 28% this period</p>
                </Card>
                <Card className="card-neon p-4">
                  <p className="text-xs text-muted-foreground mb-2">Total Volume</p>
                  <p className="text-3xl font-bold text-yellow-400">
                    {analyticsData.totalVolume.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-400 mt-2">↑ 35% this period</p>
                </Card>
                <Card className="card-neon p-4">
                  <p className="text-xs text-muted-foreground mb-2">Avg Reputation</p>
                  <p className="text-3xl font-bold text-green-400">
                    {analyticsData.avgReputation.toFixed(1)}
                  </p>
                  <p className="text-xs text-green-400 mt-2">Excellent</p>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
