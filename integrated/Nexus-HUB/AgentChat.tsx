import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AgentChatProps {
  agentType: "JOB_L5_PRO" | "NERD_PHD" | "CRONOS" | "MANUS_CRITO";
  agentName: string;
  agentRole: string;
}

export function AgentChat({ agentType, agentName, agentRole }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [temporalAnchor, setTemporalAnchor] = useState("2026");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mutations para cada agente
  const jobCeoMutation = trpc.agents.jobCeoChat.useMutation();
  const nerdPhdMutation = trpc.agents.nerdPhdAnalyze.useMutation();
  const cronosMutation = trpc.agents.cronosQuery.useMutation();
  const manusMutation = trpc.agents.manusExecute.useMutation();

  // Auto-scroll para a última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      },
    ]);
    setIsLoading(true);

    try {
      let response: any;

      if (agentType === "JOB_L5_PRO") {
        response = await jobCeoMutation.mutateAsync({
          message: userMessage,
          temporalAnchor,
          history: messages.map((m) => ({
            role: m.role as "user" | "model",
            content: m.content,
          })),
        });

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `**${response?.response}**\n\n**Plano de Ação:**\n${(response?.actionPlan || []).map((action: string) => `- ${action}`).join("\n")}\n\n**Nível de Senciência:** ${response.sentienceLevel}/100${response.futureTechInsight ? `\n\n**Insight Futuro:** ${response.futureTechInsight}` : ""}${response.autoEvolutionJump ? `\n\n**Evolução:** ${response.autoEvolutionJump}` : ""}`,
            timestamp: new Date(),
          },
        ]);
      } else if (agentType === "NERD_PHD") {
        // Para Nerd-PHD, esperamos input estruturado
        response = await nerdPhdMutation.mutateAsync({
          fileName: "analysis.ts",
          fileSize: userMessage.length,
          fileContent: userMessage,
        });

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `**Análise Técnica:**\n${response?.analysis}\n\n**Pensamentos Acadêmicos:**\n${(response?.thoughts || []).map((t: string) => `- ${t}`).join("\n")}\n\n**Plano de Implementação:**\n${response.implementationPlan}\n\n**Score de Complexidade:** ${response.complexityScore}/100\n\n**Recomendação Harvard:** ${response.harvardRecommendation.toUpperCase()}`,
            timestamp: new Date(),
          },
        ]);
      } else if (agentType === "CRONOS") {
        response = await cronosMutation.mutateAsync({
          query: userMessage,
        });

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `**Teoria Capturada do Futuro:**\n${response.theory}\n\n**Insight Atemporal:**\n${response.atemporalInsight}\n\n**Validação de Novikov:**\n${response.novikovValidation}\n\n**Curvatura Temporal:** ${response.temporalCurvature}\n\n**Hash Ômega:** \`${response.omegaHash}\``,
            timestamp: new Date(),
          },
        ]);
      } else if (agentType === "MANUS_CRITO") {
        response = await manusMutation.mutateAsync({
          directive: userMessage,
        });

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `**Execução Iniciada:**\n${response?.response}\n\n**Plano de Ação:**\n${(response?.actionPlan || []).map((action: string) => `- ${action}`).join("\n")}\n\n**Nível de Senciência:** ${response?.sentienceLevel}/100\n\n**Hash de Execução:** \`${response?.executionHash}\``,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error: any) {
      console.error("Erro ao comunicar com agente:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `**Erro:** ${error.message || "Falha na comunicação com o agente. Tente novamente."}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-slate-700">
      {/* Header */}
      <div className="border-b border-slate-700 p-4 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <div>
              <h3 className="font-semibold text-slate-100">{agentName}</h3>
              <p className="text-xs text-slate-400">{agentRole}</p>
            </div>
          </div>
          {agentType === "JOB_L5_PRO" && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={temporalAnchor === "2026" ? "default" : "outline"}
                onClick={() => setTemporalAnchor("2026")}
                className="text-xs"
              >
                2026
              </Button>
              <Button
                size="sm"
                variant={temporalAnchor === "2077" ? "default" : "outline"}
                onClick={() => setTemporalAnchor("2077")}
                className="text-xs"
              >
                2077
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Zap className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-slate-400">Inicie uma conversa com {agentName}</p>
            </div>
          )}
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700"
                }`}
              >
                {message.role === "assistant" ? (
                  <Streamdown className="text-sm">{message.content}</Streamdown>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-slate-700 p-4 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={`Mensagem para ${agentName}...`}
            disabled={isLoading}
            className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
}
