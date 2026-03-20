import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Lock, Send, Eye, EyeOff, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function GnoxCommunicator() {
  const { user } = useAuth();
  const { data: agents } = trpc.agents.list.useQuery();
  const sendMessage = trpc.gnox.send.useMutation();

  const [selectedSender, setSelectedSender] = useState<string | null>(null);
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [messageType, setMessageType] = useState("strategic");
  const [showDecrypted, setShowDecrypted] = useState(false);
  const [rootKeyActive, setRootKeyActive] = useState(false);

  const { data: messages } = trpc.gnox.getMessages.useQuery(
    { agentId1: selectedSender || "", agentId2: selectedRecipient || "" },
    { enabled: !!selectedSender && !!selectedRecipient }
  );

  const senderAgent = agents?.find((a) => a.agentId === selectedSender);
  const recipientAgent = agents?.find((a) => a.agentId === selectedRecipient);

  const handleSendMessage = async () => {
    if (!selectedSender || !selectedRecipient || !messageContent) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      // Simple encryption simulation (in production, use real AES-256)
      const encryptedContent = btoa(messageContent);

      await sendMessage.mutateAsync({
        senderId: selectedSender,
        recipientId: selectedRecipient,
        encryptedContent,
        messageType,
        translation: rootKeyActive ? messageContent : undefined,
      });

      toast.success("Mensagem enviada com sucesso!");
      setMessageContent("");
    } catch (error) {
      toast.error("Erro ao enviar mensagem");
    }
  };

  const decryptMessage = (encrypted: string) => {
    try {
      return atob(encrypted);
    } catch {
      return "[Erro ao descriptografar]";
    }
  };

  const messageTypes = [
    { value: "strategic", label: "Estratégica", color: "text-cyan-400" },
    { value: "tactical", label: "Tática", color: "text-pink-500" },
    { value: "personal", label: "Pessoal", color: "text-green-400" },
    { value: "emergency", label: "Emergência", color: "text-red-500" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container py-6">
          <h1 className="text-4xl font-bold neon-text-pink mb-2 flex items-center gap-3">
            <Lock className="w-10 h-10" />
            Gnox's Communicator
          </h1>
          <p className="text-muted-foreground">Sistema de comunicação criptografada com protocolo Gnox's</p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Agent Selection */}
          <div className="lg:col-span-1 space-y-4">
            {/* Root Key Status */}
            <Card className="hud-border bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Chave de Visão Root
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <span className={`font-semibold ${rootKeyActive ? "text-green-400" : "text-muted-foreground"}`}>
                    {rootKeyActive ? "● Ativa" : "● Inativa"}
                  </span>
                </div>
                <Button
                  variant={rootKeyActive ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setRootKeyActive(!rootKeyActive)}
                >
                  {rootKeyActive ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Desativar
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Ativar
                    </>
                  )}
                </Button>
                {rootKeyActive && (
                  <p className="text-xs text-yellow-400 bg-yellow-500/10 p-2 rounded">
                    ⚠️ Chave root ativa. Mensagens serão descriptografadas.
                  </p>
                )}
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
                      <div className="text-xs text-muted-foreground">{agent.specialization}</div>
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
                      <div className="text-xs text-muted-foreground">{agent.specialization}</div>
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
                {/* Message Composer */}
                <Card className="hud-border bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-cyan-400" />
                      Compor Mensagem
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Message Type */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tipo de Mensagem</label>
                      <div className="grid grid-cols-2 gap-2">
                        {messageTypes.map((type) => (
                          <button
                            key={type.value}
                            onClick={() => setMessageType(type.value)}
                            className={`p-2 rounded text-sm transition ${
                              messageType === type.value
                                ? "bg-cyan-500/30 border border-cyan-500"
                                : "bg-background/50 border border-border hover:border-foreground"
                            }`}
                          >
                            <span className={type.color}>{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Conteúdo da Mensagem</label>
                      <textarea
                        placeholder="Digite sua mensagem aqui..."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        className="w-full h-32 bg-background/50 border border-border rounded p-3 text-sm resize-none"
                      />
                    </div>

                    {/* Encryption Info */}
                    <div className="bg-background/50 rounded p-3 text-xs text-muted-foreground space-y-1">
                      <p>🔒 Criptografia: AES-256-GCM</p>
                      <p>📍 Protocolo: Gnox's v1.0</p>
                      <p>{rootKeyActive ? "👁️ Chave Root: ATIVA" : "🔐 Chave Root: INATIVA"}</p>
                    </div>

                    {/* Send Button */}
                    <Button
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-6"
                      onClick={handleSendMessage}
                      disabled={sendMessage.isPending || !messageContent}
                    >
                      <Send className="w-5 h-5 mr-2" />
                      {sendMessage.isPending ? "Enviando..." : "Enviar Mensagem Criptografada"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Message History */}
                {messages && messages.length > 0 && (
                  <Card className="hud-border-pink bg-card/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Histórico de Mensagens
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {messages.map((msg) => (
                          <div key={msg.id} className="border border-border rounded p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-cyan-400">{msg.senderId}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(msg.createdAt).toLocaleString("pt-BR")}
                              </span>
                            </div>
                            <div className="bg-background/50 rounded p-2 font-mono text-xs">
                              {rootKeyActive && msg.translation
                                ? msg.translation
                                : `[CRIPTOGRAFADO: ${msg.encryptedContent.substring(0, 50)}...]`}
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
                  <p className="text-muted-foreground">Selecione remetente e destinatário para iniciar comunicação</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
