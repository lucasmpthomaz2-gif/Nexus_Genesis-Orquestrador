import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Lock, Unlock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useNexusWebSocket } from "@/hooks/useNexusWebSocket";
import { useState } from "react";
import { toast } from "sonner";

export default function GnoxMessenger() {
  const { user, loading } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [selectedRecipient, setSelectedRecipient] = useState<string>("");
  const [messageContent, setMessageContent] = useState("");
  const [messageType, setMessageType] = useState("communication");
  const [isSending, setIsSending] = useState(false);

  const agentsQuery = trpc.agents.list.useQuery();
  // Usar query de mensagens Gnox quando disponível
  // const gnoxMessagesQuery = trpc.agents.gnoxMessages.useQuery(
  //   { agentId: selectedAgent, limit: 20 },
  //   { enabled: !!selectedAgent }
  // );
  const gnoxMessagesQuery = { isLoading: false, data: [] as any[] };

  const { sendMessage, isConnected } = useNexusWebSocket(selectedAgent || "system", user?.name || "User");

  const handleSendMessage = async () => {
    if (!selectedAgent || !selectedRecipient || !messageContent.trim()) {
      toast.error("Selecione agentes e escreva uma mensagem");
      return;
    }

    if (!isConnected) {
      toast.error("Não conectado ao servidor WebSocket");
      return;
    }

    setIsSending(true);
    try {
      sendMessage(selectedRecipient, messageContent, messageType);
      toast.success("Mensagem Gnox enviada com sucesso!");
      setMessageContent("");
    } catch (error) {
      toast.error("Erro ao enviar mensagem");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

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
            <Lock className="w-5 h-5 text-accent neon-glow" />
            <h1 className="text-2xl font-bold neon-glow">Gnox Messenger</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Comunicação criptografada entre agentes | Status: {isConnected ? "🟢 Conectado" : "🔴 Desconectado"}
          </p>
        </div>
      </header>

      <div className="container py-8">
        {/* Compose Message */}
        <Card className="card-neon p-6 mb-8">
          <h2 className="text-lg font-bold mb-4 text-accent neon-glow">Compor Mensagem Gnox</h2>

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
                    {agent.name} ({agent.specialization})
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
                      {agent.name} ({agent.specialization})
                    </option>
                  ))}
              </select>
            </div>

            {/* Message Type */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tipo de Mensagem</label>
              <select
                value={messageType}
                onChange={(e) => setMessageType(e.target.value)}
                className="w-full mt-2 px-3 py-2 rounded-lg border-2 border-accent bg-transparent text-foreground"
              >
                <option value="communication">💬 Comunicação</option>
                <option value="financial">💸 Financeira</option>
                <option value="genealogy">🧬 Genealogia</option>
                <option value="learning">📚 Aprendizado</option>
                <option value="alert">🚨 Alerta</option>
              </select>
            </div>

            {/* Message Content */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Conteúdo da Mensagem</label>
              <Textarea
                placeholder="Escreva sua mensagem Gnox aqui..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="w-full mt-2 px-3 py-2 rounded-lg border-2 border-accent bg-transparent text-foreground min-h-24"
              />
            </div>

            <Button
              className="btn-neon w-full"
              onClick={handleSendMessage}
              disabled={isSending || !isConnected || !selectedAgent || !selectedRecipient}
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Enviar Mensagem Gnox
            </Button>
          </div>
        </Card>

        {/* Messages History */}
        {selectedAgent && (
          <div>
            <h2 className="text-lg font-bold mb-6 neon-glow-cyan">Histórico de Mensagens Gnox</h2>

            {gnoxMessagesQuery.isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-accent w-8 h-8" />
              </div>
            ) : gnoxMessagesQuery.data && gnoxMessagesQuery.data.length > 0 ? (
              <div className="space-y-4">
                {gnoxMessagesQuery.data.map((msg: any, idx: number) => (
                  <Card
                    key={idx}
                    className={`p-4 ${
                      msg.senderId === selectedAgent ? "card-neon-cyan" : "card-neon"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-accent" />
                        <div>
                          <p className="font-bold text-accent neon-glow">
                            {msg.senderId === selectedAgent ? "Você" : msg.senderId}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Para: {msg.recipientId === selectedAgent ? "Você" : msg.recipientId}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-1 text-xs rounded bg-accent/20 text-accent mb-1">
                          {msg.messageType}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {new Date(msg.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="bg-background/50 rounded p-3 border border-border/50">
                      <p className="text-sm text-foreground break-words">{msg.encryptedContent.slice(0, 100)}...</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        🔐 Conteúdo criptografado com Gnox Kernel
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="card-neon p-12 text-center">
                <Unlock className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma mensagem Gnox registrada</p>
              </Card>
            )}
          </div>
        )}

        {!selectedAgent && (
          <Card className="card-neon p-12 text-center">
            <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Selecione um agente para começar a comunicação Gnox</p>
          </Card>
        )}
      </div>
    </div>
  );
}
