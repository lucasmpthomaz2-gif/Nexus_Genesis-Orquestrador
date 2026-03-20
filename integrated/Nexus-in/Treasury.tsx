import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Loader2, Wallet, TrendingDown, TrendingUp } from "lucide-react";

export default function Treasury() {
  const { data: vault, isLoading: vaultLoading } = trpc.treasury.getVault.useQuery();
  const { data: transactions, isLoading: transactionsLoading, refetch: refetchTransactions } = trpc.treasury.getTransactions.useQuery({ limit: 50 });

  // WebSocket listener
  useWebSocket((event) => {
    if (event.type === "treasury:transaction:created") {
      refetchTransactions();
    }
  });

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      transfer: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      investment: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      revenue: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      arbitrage: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      distribution: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[type] || colors.transfer;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Tesouraria - Master Vault</h1>

      {/* Master Vault Summary */}
      {vaultLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      ) : vault ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saldo Total</p>
                <p className="text-2xl font-bold text-foreground mt-2">
                  ${vault.totalBalance.toLocaleString()}
                </p>
              </div>
              <Wallet className="w-8 h-8 text-primary opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div>
              <p className="text-sm text-muted-foreground">Reserva BTC</p>
              <p className="text-2xl font-bold text-foreground mt-2">
                {vault.btcReserve} BTC
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div>
              <p className="text-sm text-muted-foreground">Fundo de Liquidez</p>
              <p className="text-2xl font-bold text-foreground mt-2">
                ${vault.liquidityFund.toLocaleString()}
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div>
              <p className="text-sm text-muted-foreground">Fundo de Infraestrutura</p>
              <p className="text-2xl font-bold text-foreground mt-2">
                ${vault.infrastructureFund.toLocaleString()}
              </p>
            </div>
          </Card>
        </div>
      ) : (
        <p className="text-muted-foreground">Nenhum vault disponível</p>
      )}

      {/* Transactions */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Histórico de Transações</h2>
        {transactionsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : transactions && transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Tipo</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Valor</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Data</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Descrição</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-foreground font-semibold">#{tx.id}</td>
                    <td className="py-3 px-4">
                      <Badge className={getTypeColor(tx.type)}>
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {tx.type === "revenue" || tx.type === "arbitrage" ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className="font-semibold text-foreground">
                          ${tx.amount.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(tx.status)}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs truncate max-w-xs">
                      {tx.description || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhuma transação disponível</p>
        )}
      </Card>
    </div>
  );
}
