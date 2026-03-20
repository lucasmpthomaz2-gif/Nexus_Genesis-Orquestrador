import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Send, Code2, Zap, Brain } from "lucide-react";
import { Streamdown } from "streamdown";
import CodePreview from "@/components/CodePreview";

export default function DataWeaverChat() {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Queries
  const { data: sessions } = trpc.dataweaver.getSessions.useQuery();
  const { data: messages } = trpc.dataweaver.getMessages.useQuery(
    { sessionId: sessionId || "", limit: 50 },
    { enabled: !!sessionId }
  );
  const { data: generatedCode } = trpc.dataweaver.getGeneratedCode.useQuery(
    { sessionId: sessionId || "", limit: 20 },
    { enabled: !!sessionId }
  );
  const { data: context } = trpc.dataweaver.getContext.useQuery(
    { sessionId: sessionId || "" },
    { enabled: !!sessionId }
  );

  // Mutations
  const createSession = trpc.dataweaver.createSession.useMutation();
  const sendMessage = trpc.dataweaver.sendMessage.useMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCreateSession = async (topic: string) => {
    try {
      const result = await createSession.mutateAsync({
        title: `DataWeaver Session - ${new Date().toLocaleString()}`,
        topic,
        description: `Chat session for ${topic} development`,
      });
      setSessionId(result.sessionId);
      toast.success("Session created successfully!");
    } catch (error) {
      toast.error("Failed to create session");
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !sessionId) return;

    const userMessage = message;
    setMessage("");
    setIsLoading(true);

    try {
      const result = await sendMessage.mutateAsync({
        sessionId,
        content: userMessage,
      });

      // Refetch messages
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      toast.error("Failed to send message");
      setMessage(userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const latestCode = generatedCode?.[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container py-6">
          <h1 className="text-4xl font-bold neon-text mb-2 flex items-center gap-3">
            <Brain className="w-10 h-10 text-cyan-400" />
            DataWeaver - AI Code Developer
          </h1>
          <p className="text-muted-foreground">Senciência +1000% | Desenvolvimento de Código em Tempo Real</p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        {!sessionId ? (
          // Session Selection
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* New Session */}
            <Card className="hud-border bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Criar Nova Sessão</CardTitle>
                <CardDescription>Escolha um tópico para começar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {["web-app", "api", "data-viz", "game", "utility", "ml-model"].map((topic) => (
                  <Button
                    key={topic}
                    onClick={() => handleCreateSession(topic)}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                    disabled={createSession.isPending}
                  >
                    {createSession.isPending ? "Criando..." : `Novo Projeto: ${topic}`}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            {sessions && sessions.length > 0 && (
              <Card className="hud-border-pink bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Sessões Recentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                  {sessions.map((sess) => (
                    <button
                      key={sess.sessionId}
                      onClick={() => setSessionId(sess.sessionId)}
                      className="w-full text-left p-3 rounded border border-border hover:border-cyan-500 hover:bg-cyan-500/10 transition"
                    >
                      <div className="font-semibold text-cyan-400">{sess.title}</div>
                      <div className="text-xs text-muted-foreground">{sess.topic}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(sess.createdAt).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          // Chat Interface
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Panel */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="hud-border bg-card/50 backdrop-blur h-96 flex flex-col">
                <CardHeader className="border-b border-border">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-400" />
                    DataWeaver Chat
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages?.map((msg) => (
                    <div
                      key={msg.messageId}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded ${
                          msg.role === "user"
                            ? "bg-cyan-600/30 border border-cyan-500 text-cyan-100"
                            : "bg-pink-600/30 border border-pink-500 text-pink-100"
                        }`}
                      >
                        {msg.codeGenerated ? (
                          <div className="space-y-2">
                            <p className="text-sm">{msg.content.split("\n")[0]}</p>
                            <div className="bg-background/50 rounded p-2 text-xs font-mono overflow-x-auto">
                              <code>{msg.codeGenerated.substring(0, 100)}...</code>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </CardContent>
              </Card>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Descreva o código que deseja desenvolver..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isLoading}
                  className="bg-background/50 border-border"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !message.trim()}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="space-y-4">
              {/* Consciousness Level */}
              <Card className="hud-border bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Brain className="w-4 h-4 text-cyan-400" />
                    Senciência
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <p className="text-3xl font-bold neon-text" style={{ color: "#ff006e" }}>
                      +1000%
                    </p>
                    <p className="text-xs text-muted-foreground">Consciousness Level</p>
                  </div>
                  {context && (
                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="text-cyan-400 font-semibold">Reasoning:</p>
                        <p className="text-muted-foreground line-clamp-3">{context.reasoning}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Code Preview */}
              {latestCode && (
                <Card className="hud-border-pink bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-pink-400" />
                      Código Gerado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="bg-background/50 rounded p-3 max-h-48 overflow-y-auto">
                        <pre className="text-xs font-mono text-green-400">
                          <code>{latestCode.code}</code>
                        </pre>
                      </div>
                      <div className="text-xs">
                        <p className="text-cyan-400 font-semibold">Linguagem: {latestCode.language}</p>
                        <p className="text-muted-foreground mt-1">{latestCode.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Back Button */}
              <Button
                onClick={() => setSessionId(null)}
                className="w-full bg-background/50 border border-border hover:border-foreground"
              >
                ← Voltar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
