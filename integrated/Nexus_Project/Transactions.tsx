import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Send, TrendingUp, TrendingDown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useNexusWebSocket } from "@/hooks/useNexusWebSocket";
import { useState } from "react";
import { toast } from "sonner";

export default function Transactions() {
  const { user, loading } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [selectedRecipient, setSelectedRecipient] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("transfer");
  const [description, setDescription] = useState("");
  const [isSending, setIsSending] = useState(false);

  const agentsQuery = trpc.agents.list.useQuery();
  const transactionsQuery = trpc.transactions.byAgent.useQuery(
    { agentId: selectedAgent },
    { enabled: !!selectedAgent }
  );

  const { sendTransaction, isConnected } = useNexusWebSocket(selectedAgent || "system", user?.name || "User");

  const handleExecuteTransaction = async () => {
    if (!selectedAgent || !selectedRecipient || !amount) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (!isConnected) {
      toast.error("Não conectado ao servidor WebSocket");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Valor inválido");
      return;
    }

    setIsSending(true);
    try {
      sendTransaction(selectedRecipient, numAmount, transactionType, description);
      toast.success("Transação executada com sucesso!");
      setAmount("");
      setDescription("");
    } catch (error) {
      toast.error("Erro ao executar transação");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const selectedAgentData = agentsQuery.data?.find((a) => a.agentId === selectedAgent);

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
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-accent neon-glow" />
            <h1 className="text-2xl font-bold neon-glow">Transações NEXUS</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Sistema financeiro em tempo real | Status: {isConnected ? "🟢 Conectado" : "🔴 Desconectado"}
          </p>
        </div>
      </header>

      <div className="container py-8">
        {/* Execute Transaction */}
        <Card className="card-neon p-6 mb-8">
          <h2 className="text-lg font-bold mb-4 text-accent neon-glow">Executar Transação</h2>

          <div className="space-y-4">
            {/* Sender Agent */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Agente Remetente</label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full mt-2 px-3 py-2 rounded-lg border-2 border-accent bg-transparent text-foreground"
              >
                <option value="">-- Selecione seu agente --</option>
                {agentsQuery.data?.map((agent) => (
                  <option key={agent.id} value={agent.agentId}>
                    {agent.name} (Balanço: {agent.balance} Ⓣ)
                  </option>
                ))}
              </select>
            </div>

            {/* Recipient Agent */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Agente Destinatário</label>
              <select
                value={selectedRecipient}
                onChange={(e) => setSelectedRecipient(e.target.value)}
                disabled={!selectedAgent}
                className="w-full mt-2 px-3 py-2 rounded-lg border-2 border-accent bg-transparent text-foreground disabled:opacity-50"
              >
                <option value="">-- Selecione destinatário --</option>
                {agentsQuery.data
                  ?.filter((agent) => agent.agentId !== selectedAgent)
                  .map((agent) => (
                    <option key={agent.id} value={agent.agentId}>
                      {agent.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Quantidade (Ⓣ)</label>
              <Input
                type="number"
                placeholder="Ex: 100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full mt-2 px-3 py-2 rounded-lg border-2 border-accent bg-transparent text-foreground"
              />
            </div>

            {/* Transaction Type */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tipo de Transação</label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className="w-full mt-2 px-3 py-2 rounded-lg border-2 border-accent bg-transparent text-foreground"
              >
                <option value="transfer">💸 Transferência</option>
                <option value="payment">💰 Pagamento</option>
                <option value="reward">🏆 Recompensa</option>
                <option value="fee">📊 Taxa</option>
                <option value="investment">📈 Investimento</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Descrição (opcional)</label>
              <Input
                placeholder="Ex: Pagamento por serviços de IA"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-2 px-3 py-2 rounded-lg border-2 border-accent bg-transparent text-foreground"
              />
            </div>

            {/* Fee Distribution Info */}
            {amount && !isNaN(parseFloat(amount)) && (
              <Card className="card-neon-cyan p-4">
                <p className="text-sm font-bold text-cyan-400 mb-2">Distribuição de Taxas</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>
                    💳 Agente Destinatário: <span className="text-cyan-400">{Math.floor(parseFloat(amount) * 0.8)} Ⓣ</span>
                  </p>
                  <p>
                    👨‍👩‍👧 Parent: <span className="text-cyan-400">{Math.floor(parseFloat(amount) * 0.1)} Ⓣ</span>
                  </p>
                  <p>
                    🏗️ Infraestrutura: <span className="text-cyan-400">{parseFloat(amount) - Math.floor(parseFloat(amount) * 0.8) - Math.floor(parseFloat(amount) * 0.1)} Ⓣ</span>
                  </p>
                </div>
              </Card>
            )}

            <Button
              className="btn-neon w-full"
              onClick={handleExecuteTransaction}
              disabled={isSending || !isConnected || !selectedAgent || !selectedRecipient || !amount}
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Executar Transação
            </Button>
          </div>
        </Card>

        {/* Transaction History */}
        {selectedAgent && (
          <div>
            <h2 className="text-lg font-bold mb-6 neon-glow-cyan">Histórico de Transações</h2>

            {transactionsQuery.isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-accent w-8 h-8" />
              </div>
            ) : transactionsQuery.data && transactionsQuery.data.length > 0 ? (
              <div className="space-y-4">
                {transactionsQuery.data.map((tx: any, idx: number) => {
                  const isOutgoing = tx.senderId === selectedAgent;
                  return (
                    <Card key={idx} className={`p-4 ${isOutgoing ? "card-neon" : "card-neon-cyan"}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          {isOutgoing ? (
                            <TrendingDown className="w-5 h-5 text-red-400" />
                          ) : (
                            <TrendingUp className="w-5 h-5 text-green-400" />
                          )}
                          <div className="flex-1">
                            <p className="font-bold text-accent neon-glow">
                              {isOutgoing ? "Enviado para" : "Recebido de"} {isOutgoing ? tx.recipientId : tx.senderId}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {tx.transactionType} • {tx.description || "Sem descrição"}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={`text-lg font-bold ${isOutgoing ? "text-red-400" : "text-green-400"}`}>
                            {isOutgoing ? "-" : "+"}{tx.amount} Ⓣ
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Fee Breakdown */}
                      <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground space-y-1">
                        <p>
                          Agente: <span className="text-cyan-400">{tx.agentShare} Ⓣ</span> | Parent:{" "}
                          <span className="text-cyan-400">{tx.parentShare} Ⓣ</span> | Infra:{" "}
                          <span className="text-cyan-400">{tx.infraShare} Ⓣ</span>
                        </p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="card-neon p-12 text-center">
                <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma transação registrada</p>
              </Card>
            )}
          </div>
        )}

        {!selectedAgent && (
          <Card className="card-neon p-12 text-center">
            <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Selecione um agente para ver transações</p>
          </Card>
        )}
      </div>
    </div>
  );
}
