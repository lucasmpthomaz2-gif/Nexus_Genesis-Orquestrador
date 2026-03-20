import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import HubLayout from "@/components/HubLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet, TrendingUp, PieChart } from "lucide-react";

interface MasterVault {
  id: number;
  totalBalance: number;
  btcReserve: number;
  liquidityFund: number;
  infrastructureFund: number;
}

interface Transaction {
  id: number;
  amount: number;
  type: string;
  status: string;
  description: string | null;
  createdAt: Date;
}

export default function Treasury() {
  const [vault, setVault] = useState<MasterVault | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const vaultQuery = trpc.hub.finance.getMasterVault.useQuery();
  const transactionsQuery = trpc.hub.finance.getTransactions.useQuery({ limit: 20 });
  const initVaultMutation = trpc.hub.finance.initializeVault.useMutation();

  useEffect(() => {
    if (vaultQuery.data) {
      setVault(vaultQuery.data);
    }
  }, [vaultQuery.data]);

  useEffect(() => {
    if (transactionsQuery.data) {
      setTransactions(transactionsQuery.data);
    }
  }, [transactionsQuery.data]);

  useEffect(() => {
    setLoading(vaultQuery.isLoading || transactionsQuery.isLoading);
  }, [vaultQuery.isLoading, transactionsQuery.isLoading]);

  const handleInitializeVault = async () => {
    try {
      await initVaultMutation.mutateAsync();
      await vaultQuery.refetch();
    } catch (error) {
      console.error("Erro ao inicializar vault:", error);
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

  const distribution = vault ? {
    revenue: Math.round(vault.totalBalance * 0.8),
    growth: Math.round(vault.totalBalance * 0.1),
    infrastructure: Math.round(vault.totalBalance * 0.1),
  } : { revenue: 0, growth: 0, infrastructure: 0 };

  const typeColors: Record<string, string> = {
    transfer: "bg-blue-600",
    investment: "bg-green-600",
    revenue: "bg-cyan-600",
    arbitrage: "bg-purple-600",
    distribution: "bg-orange-600",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-600",
    completed: "bg-green-600",
    failed: "bg-red-600",
  };

  return (
    <HubLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Tesouraria V2 e Master Vault
          </h1>
          <p className="text-slate-400">
            Gestão de fundos com distribuição automática 80/10/10
          </p>
        </div>

        {/* Initialize Button */}
        {!vault && (
          <div className="text-center py-8">
            <Button
              onClick={handleInitializeVault}
              disabled={initVaultMutation.isPending}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              {initVaultMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Inicializando...
                </>
              ) : (
                <>
                  <Wallet className="mr-2" size={18} />
                  Inicializar Master Vault
                </>
              )}
            </Button>
          </div>
        )}

        {vault && (
          <>
            {/* Vault Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400">Saldo Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-cyan-400">
                    ${(vault.totalBalance / 1000000).toFixed(2)}M
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400">Reserva BTC</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-400">{vault.btcReserve}</div>
                  <p className="text-xs text-slate-500 mt-1">Bitcoin</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400">Fundo de Liquidez</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">
                    ${(vault.liquidityFund / 1000000).toFixed(2)}M
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400">Fundo de Infraestrutura</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400">
                    ${(vault.infrastructureFund / 1000000).toFixed(2)}M
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Distribution Model */}
            <Card className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart size={20} className="text-cyan-400" />
                  Modelo de Distribuição 80/10/10
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-cyan-500">
                    <p className="text-sm text-slate-400 mb-2">Receita de Startups (80%)</p>
                    <p className="text-2xl font-bold text-cyan-400">
                      ${(distribution.revenue / 1000000).toFixed(2)}M
                    </p>
                    <p className="text-xs text-slate-500 mt-2">Reinvestimento no ecossistema</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-green-500">
                    <p className="text-sm text-slate-400 mb-2">Crescimento (10%)</p>
                    <p className="text-2xl font-bold text-green-400">
                      ${(distribution.growth / 1000000).toFixed(2)}M
                    </p>
                    <p className="text-xs text-slate-500 mt-2">Novas oportunidades</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-purple-500">
                    <p className="text-sm text-slate-400 mb-2">Infraestrutura (10%)</p>
                    <p className="text-2xl font-bold text-purple-400">
                      ${(distribution.infrastructure / 1000000).toFixed(2)}M
                    </p>
                    <p className="text-xs text-slate-500 mt-2">Manutenção e operações</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transactions */}
            <div>
              <h2 className="text-2xl font-bold text-slate-200 mb-4">Histórico de Transações</h2>
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="px-6 py-3 text-left text-slate-400 font-medium">Tipo</th>
                          <th className="px-6 py-3 text-left text-slate-400 font-medium">Valor</th>
                          <th className="px-6 py-3 text-left text-slate-400 font-medium">Status</th>
                          <th className="px-6 py-3 text-left text-slate-400 font-medium">Descrição</th>
                          <th className="px-6 py-3 text-left text-slate-400 font-medium">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-3">
                              <Badge className={`${typeColors[tx.type] || "bg-slate-600"} text-white`}>
                                {tx.type}
                              </Badge>
                            </td>
                            <td className="px-6 py-3 font-semibold text-cyan-400">
                              ${(tx.amount / 1000000).toFixed(2)}M
                            </td>
                            <td className="px-6 py-3">
                              <Badge className={`${statusColors[tx.status] || "bg-slate-600"} text-white`}>
                                {tx.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-3 text-slate-400 max-w-xs truncate">
                              {tx.description || "-"}
                            </td>
                            <td className="px-6 py-3 text-slate-500">
                              {new Date(tx.createdAt).toLocaleDateString("pt-BR")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {transactions.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      Nenhuma transação registrada
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Security Info */}
            <Card className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} className="text-cyan-400" />
                  Segurança e Auditoria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300">
                <p>
                  A Master Vault implementa múltiplas camadas de segurança incluindo:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>Multi-assinatura para transações críticas</li>
                  <li>Auditoria completa de todas as operações</li>
                  <li>Snapshots automáticos em S3 para compliance</li>
                  <li>Distribuição automática 80/10/10 de receitas</li>
                  <li>Logs imutáveis de todas as decisões financeiras</li>
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </HubLayout>
  );
}
