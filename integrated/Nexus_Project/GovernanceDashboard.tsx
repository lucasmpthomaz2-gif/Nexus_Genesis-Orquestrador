import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Activity, Zap } from "lucide-react";

interface GovernanceMetrics {
  activeAgents: number;
  totalTransactions: number;
  totalVolume: number;
  averageEngagement: number;
  systemHealth: number;
  timestamp: Date;
}

export default function GovernanceDashboard() {
  const [metrics, setMetrics] = useState<GovernanceMetrics[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<GovernanceMetrics | null>(
    null
  );

  const { data: allTransactions } = trpc.transactions.getAll.useQuery({
    limit: 100,
  });

  useEffect(() => {
    const mockMetrics: GovernanceMetrics[] = [
      {
        activeAgents: 42,
        totalTransactions: 1250,
        totalVolume: 50000,
        averageEngagement: 85,
        systemHealth: 98,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        activeAgents: 48,
        totalTransactions: 1450,
        totalVolume: 62000,
        averageEngagement: 87,
        systemHealth: 99,
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        activeAgents: 55,
        totalTransactions: 1680,
        totalVolume: 75000,
        averageEngagement: 89,
        systemHealth: 99.5,
        timestamp: new Date(),
      },
    ];

    setMetrics(mockMetrics);
    setCurrentMetrics(mockMetrics[mockMetrics.length - 1]);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-600 mb-2">
          Governance Dashboard
        </h1>
        <p className="text-gray-400">Métricas e estatísticas da plataforma</p>
      </div>

      {currentMetrics && (
        <div className="max-w-7xl mx-auto">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-900 border-cyan-500">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <Users size={20} /> Agentes Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-cyan-400">
                  {currentMetrics.activeAgents}
                </p>
                <p className="text-gray-400 text-sm mt-2">Agentes em operação</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-pink-600">
              <CardHeader>
                <CardTitle className="text-pink-400 flex items-center gap-2">
                  <TrendingUp size={20} /> Transações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-pink-400">
                  {currentMetrics.totalTransactions}
                </p>
                <p className="text-gray-400 text-sm mt-2">Total de transações</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-purple-600">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Activity size={20} /> Engajamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-purple-400">
                  {currentMetrics.averageEngagement.toFixed(1)}%
                </p>
                <p className="text-gray-400 text-sm mt-2">Média de engajamento</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-green-600">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Zap size={20} /> Saúde do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-green-400">
                  {currentMetrics.systemHealth.toFixed(1)}%
                </p>
                <p className="text-gray-400 text-sm mt-2">Status operacional</p>
              </CardContent>
            </Card>
          </div>

          {/* Metrics History */}
          <Card className="bg-gray-900 border-cyan-500">
            <CardHeader>
              <CardTitle className="text-cyan-400">Histórico de Métricas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-cyan-400">Data</th>
                      <th className="text-left py-3 px-4 text-cyan-400">Agentes</th>
                      <th className="text-left py-3 px-4 text-cyan-400">
                        Transações
                      </th>
                      <th className="text-left py-3 px-4 text-cyan-400">Volume</th>
                      <th className="text-left py-3 px-4 text-cyan-400">
                        Engajamento
                      </th>
                      <th className="text-left py-3 px-4 text-cyan-400">Saúde</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map((metric, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-800 hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-4 text-gray-300">
                          {new Date(metric.timestamp).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-cyan-400">
                          {metric.activeAgents}
                        </td>
                        <td className="py-3 px-4 text-pink-400">
                          {metric.totalTransactions}
                        </td>
                        <td className="py-3 px-4 text-purple-400">
                          {metric.totalVolume.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-green-400">
                          {metric.averageEngagement.toFixed(1)}%
                        </td>
                        <td className="py-3 px-4 text-yellow-400">
                          {metric.systemHealth.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
