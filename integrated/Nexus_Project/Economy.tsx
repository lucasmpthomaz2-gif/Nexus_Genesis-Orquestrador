import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { TrendingUp, Send, Wallet, PieChart } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function Economy() {
  const { user } = useAuth();
  const { data: agents } = trpc.agents.list.useQuery();
  const [selectedSender, setSelectedSender] = useState<string | null>(null);

  const { data: transactions } = trpc.transactions.getByAgent.useQuery(
    { agentId: selectedSender || "", limit: 20 },
    { enabled: !!selectedSender }
  );
  const createTransaction = trpc.transactions.create.useMutation();

  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactionType, setTransactionType] = useState("transfer");

  const senderAgent = agents?.find((a) => a.agentId === selectedSender);
  const recipientAgent = agents?.find((a) => a.agentId === selectedRecipient);

  const handleCreateTransaction = async () => {
    if (!selectedSender || !selectedRecipient || !amount) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      await createTransaction.mutateAsync({
        senderId: selectedSender,
        recipientId: selectedRecipient,
        amount,
        transactionType,
        description,
      });

      toast.success("Transação realizada com sucesso!");
      setAmount("");
      setDescription("");
    } catch (error) {
      toast.error("Erro ao realizar transação");
    }
  };

  const getTotalBalance = () => {
    return agents?.reduce((sum, agent) => sum + parseFloat(agent.balance as any || "0"), 0) || 0;
  };

  const getTransactionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      transfer: "Transferência",
      reward: "Recompensa",
      penalty: "Penalidade",
      investment: "Investimento",
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container py-6">
          <h1 className="text-4xl font-bold neon-text mb-2 flex items-center gap-3">
            <Wallet className="w-10 h-10 text-green-400" />
            Sistema de Economia
          </h1>
          <p className="text-muted-foreground">Gerenciar transações e distribuição de tokens no Wedark</p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Economy Stats */}
            <Card className="hud-border bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  Economia Global
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Saldo Total</p>
                  <p className="text-2xl font-bold neon-text" style={{ color: "#00ff88" }}>
                    {getTotalBalance().toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Agentes Ativos</p>
                  <p className="text-2xl font-bold neon-text">{agents?.length || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Distribuição</p>
                  <p className="text-xs text-cyan-400">80% Agente | 10% Pai | 10% Infra</p>
                </div>
              </CardContent>
            </Card>

            {/* Sender Selection */}
            <Card className="hud-border-pink bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-base">Remetente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {agents?.map((agent) => (
                    <button
                      key={agent.agentId}
                      onClick={() => setSelectedSender(agent.agentId)}
                      className={`w-full text-left p-2 rounded text-sm transition ${
                        selectedSender === agent.agentId
                          ? "bg-pink-500/30 border border-pink-500"
                          : "bg-background/50 border border-border hover:border-pink-500"
                      }`}
                    >
                      <div className="font-semibold">{agent.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Saldo: {parseFloat(agent.balance as any || "0").toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recipient Selection */}
            <Card className="hud-border bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-base">Destinatário</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {agents?.filter((a) => a.agentId !== selectedSender).map((agent) => (
                    <button
                      key={agent.agentId}
                      onClick={() => setSelectedRecipient(agent.agentId)}
                      className={`w-full text-left p-2 rounded text-sm transition ${
                        selectedRecipient === agent.agentId
                          ? "bg-cyan-500/30 border border-cyan-500"
                          : "bg-background/50 border border-border hover:border-cyan-500"
                      }`}
                    >
                      <div className="font-semibold">{agent.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Saldo: {parseFloat(agent.balance as any || "0").toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {selectedSender && selectedRecipient ? (
              <>
                {/* Transaction Form */}
                <Card className="hud-border bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-cyan-400" />
                      Nova Transação
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Transaction Type */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tipo de Transação</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["transfer", "reward", "penalty", "investment"].map((type) => (
                          <button
                            key={type}
                            onClick={() => setTransactionType(type)}
                            className={`p-2 rounded text-sm transition ${
                              transactionType === type
                                ? "bg-cyan-500/30 border border-cyan-500"
                                : "bg-background/50 border border-border hover:border-foreground"
                            }`}
                          >
                            {getTransactionTypeLabel(type)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Quantidade de Tokens</label>
                      <Input
                        type="number"
                        placeholder="Ex: 100.50"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-background/50 border-border"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Descrição (Opcional)</label>
                      <Input
                        placeholder="Motivo da transação..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-background/50 border-border"
                      />
                    </div>

                    {/* Distribution Preview */}
                    {amount && (
                      <div className="bg-background/50 rounded p-3 space-y-2 text-sm">
                        <p className="font-semibold text-cyan-400">Distribuição Automática:</p>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p>💰 Agente (80%): {(parseFloat(amount) * 0.8).toFixed(2)} tokens</p>
                          <p>👨 Pai (10%): {(parseFloat(amount) * 0.1).toFixed(2)} tokens</p>
                          <p>🏗️ Infraestrutura (10%): {(parseFloat(amount) * 0.1).toFixed(2)} tokens</p>
                        </div>
                      </div>
                    )}

                    {/* Create Button */}
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6"
                      onClick={handleCreateTransaction}
                      disabled={createTransaction.isPending || !amount}
                    >
                      <Send className="w-5 h-5 mr-2" />
                      {createTransaction.isPending ? "Processando..." : "Realizar Transação"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Transaction History */}
                {transactions && transactions.length > 0 && (
                  <Card className="hud-border-pink bg-card/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-base">Histórico de Transações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {transactions.map((tx) => (
                          <div key={tx.id} className="border border-border rounded p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold text-cyan-400">
                                  {getTransactionTypeLabel(tx.transactionType)}
                                </p>
                                <p className="text-xs text-muted-foreground">{tx.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold neon-text" style={{ color: "#00ff88" }}>
                                  +{parseFloat(tx.amount as any).toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(tx.createdAt).toLocaleDateString("pt-BR")}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="hud-border bg-card/50 backdrop-blur">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Selecione remetente e destinatário para criar transação</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
