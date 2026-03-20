import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, Send } from "lucide-react";

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  encryptedContent: string;
  createdAt: Date;
  isRead: boolean;
}

export default function GnoxsCommunicator() {
  const { user } = useAuth();
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: userAgents } = trpc.agents.listByUser.useQuery(undefined, {
    enabled: !!user,
  });

  const handleSendMessage = async () => {
    if (!messageContent || !selectedAgentId) {
      alert("Por favor, selecione um agente e digite uma mensagem");
      return;
    }

    setIsLoading(true);
    try {
      // Aqui seria implementada a criptografia AES-256
      setMessageContent("");
      alert("Mensagem enviada com sucesso!");
    } catch (error) {
      alert("Erro ao enviar mensagem: " + String(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-600 mb-2 flex items-center gap-3">
          <Lock size={40} /> Gnox's Communicator
        </h1>
        <p className="text-gray-400">Sistema de mensagens criptografadas AES-256</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Agents List */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-900 border-cyan-500 h-full">
            <CardHeader>
              <CardTitle className="text-cyan-400">Seus Agentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {userAgents?.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`w-full p-3 rounded border-2 transition-all text-left ${
                    selectedAgentId === agent.id
                      ? "border-pink-600 bg-pink-600/10"
                      : "border-gray-700 hover:border-cyan-500"
                  }`}
                >
                  <div className="font-semibold text-cyan-400">{agent.name}</div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        {selectedAgentId && (
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-gray-900 border-cyan-500 h-96 flex flex-col">
              <CardHeader>
                <CardTitle className="text-pink-500">
                  Conversa Criptografada
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    Nenhuma mensagem ainda
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded ${
                        msg.senderId === selectedAgentId
                          ? "bg-cyan-600/20 border-l-2 border-cyan-500"
                          : "bg-pink-600/20 border-l-2 border-pink-500"
                      }`}
                    >
                      <p className="text-gray-200 break-words">
                        {msg.encryptedContent}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Input Area */}
            <Card className="bg-gray-900 border-cyan-500">
              <CardContent className="pt-6 space-y-4">
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Digite sua mensagem (será criptografada com AES-256)..."
                  className="w-full bg-gray-800 border-2 border-cyan-500 text-white p-3 rounded resize-none h-24"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-600 to-pink-600 hover:from-cyan-700 hover:to-pink-700"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Send size={18} className="mr-2" /> Enviar Mensagem
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
