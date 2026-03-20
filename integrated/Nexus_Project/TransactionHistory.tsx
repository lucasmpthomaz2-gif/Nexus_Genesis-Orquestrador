import { Transaction } from "@/types";
import { TrendingUp, TrendingDown, Send, Zap } from "lucide-react";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "reward":
        return <TrendingUp size={18} className="text-neon-green" />;
      case "cost":
        return <TrendingDown size={18} className="text-red-500" />;
      case "transfer":
        return <Send size={18} className="text-neon-cyan" />;
      case "penalty":
        return <Zap size={18} className="text-red-500" />;
      case "dividend":
        return <TrendingUp size={18} className="text-neon-pink" />;
      default:
        return <Zap size={18} className="text-neon-cyan" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      reward: "Recompensa",
      cost: "Custo",
      transfer: "Transferência",
      penalty: "Penalidade",
      dividend: "Dividendo",
    };
    return labels[type] || type;
  };

  const getAmountColor = (type: string) => {
    if (["reward", "dividend"].includes(type)) return "text-neon-green";
    if (["cost", "penalty"].includes(type)) return "text-red-500";
    return "text-neon-cyan";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number, type: string) => {
    const sign = ["reward", "dividend"].includes(type) ? "+" : "-";
    return `${sign}${amount}`;
  };

  return (
    <div className="card-neon mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Zap size={24} className="text-neon-cyan" />
        <h2 className="neon-subtitle">TRANSACTION_HISTORY</h2>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="p-4 text-center text-neon-cyan/60 text-sm">
            Nenhuma transação registrada
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3 border border-neon-cyan/30 rounded bg-neon-cyan/5 hover:bg-neon-cyan/10 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-grow">
                  <div className="mt-1">{getTypeIcon(tx.type)}</div>
                  <div className="flex-grow">
                    <div className="text-neon-cyan font-bold text-sm">
                      {getTypeLabel(tx.type)}
                    </div>
                    {tx.description && (
                      <div className="text-neon-cyan/60 text-xs mt-1">{tx.description}</div>
                    )}
                    <div className="text-neon-cyan/50 text-xs mt-2 font-mono">
                      {formatDate(tx.createdAt)}
                    </div>

                    {/* Distribution Info */}
                    {tx.agentShare !== null && (
                      <div className="mt-2 p-2 bg-neon-purple/10 border border-neon-purple/30 rounded text-xs font-mono text-neon-purple">
                        <div>Agent: {tx.agentShare} ◆</div>
                        {tx.parentShare !== null && <div>Parent: {tx.parentShare} ◆</div>}
                        {tx.infraShare !== null && <div>Infra: {tx.infraShare} ◆</div>}
                      </div>
                    )}
                  </div>
                </div>

                <div className={`flex-shrink-0 text-right ${getAmountColor(tx.type)}`}>
                  <div className="font-bold text-lg">{formatAmount(tx.amount, tx.type)}</div>
                  <div className="text-xs opacity-70">◆</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
