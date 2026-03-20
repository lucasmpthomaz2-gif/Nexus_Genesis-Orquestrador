import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Terminal, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { gnoxKernel } from "@/lib/gnox-client";

interface CommandLog {
  id: string;
  input: string;
  action: string;
  confidence: number;
  securityLevel: string;
  requiresApproval: boolean;
  status: "pending" | "approved" | "rejected" | "executed";
  response: string;
  timestamp: Date;
}

export default function GnoxTerminal() {
  const [logs, setLogs] = useState<CommandLog[]>([]);
  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const handleSubmitCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setProcessing(true);

    try {
      // Parse comando com Gnox Kernel
      const intent = gnoxKernel.parseNaturalLanguage(input);
      const command = gnoxKernel.validateIntent(intent);

      const log: CommandLog = {
        id: intent.id,
        input,
        action: intent.action,
        confidence: intent.confidence,
        securityLevel: command.securityLevel,
        requiresApproval: command.requiresApproval,
        status: command.requiresApproval ? "pending" : "executed",
        response: gnoxKernel.generateResponse(command, null),
        timestamp: new Date(),
      };

      setLogs((prev) => [...prev, log]);
      setInput("");
    } catch (error) {
      console.error("Erro ao processar comando:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleApproveCommand = (logId: string) => {
    setLogs((prev) =>
      prev.map((log) =>
        log.id === logId
          ? { ...log, status: "approved", response: "✓ Comando aprovado e executado." }
          : log
      )
    );
  };

  const handleRejectCommand = (logId: string) => {
    setLogs((prev) =>
      prev.map((log) =>
        log.id === logId
          ? { ...log, status: "rejected", response: "✗ Comando rejeitado." }
          : log
      )
    );
  };

  const getSecurityColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-600";
      case "high":
        return "bg-orange-600";
      case "medium":
        return "bg-yellow-600";
      default:
        return "bg-green-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "executed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Info className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Terminal className="h-8 w-8 text-purple-500" />
            Gnox Terminal
          </h1>
          <p className="text-slate-400">Interface de Linguagem Natural para Controle do Ecossistema</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Terminal Principal */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700 h-full flex flex-col">
              <CardHeader>
                <CardTitle>Console de Comandos</CardTitle>
                <CardDescription>Digite comandos em linguagem natural</CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Log de Comandos */}
                <div className="flex-1 bg-slate-900 rounded-lg p-4 mb-4 overflow-y-auto max-h-96 font-mono text-sm">
                  {logs.length === 0 ? (
                    <p className="text-slate-500">Aguardando comandos...</p>
                  ) : (
                    logs.map((log) => (
                      <div key={log.id} className="mb-4 pb-4 border-b border-slate-700 last:border-b-0">
                        <div className="flex items-start gap-2 mb-2">
                          {getStatusIcon(log.status)}
                          <div className="flex-1">
                            <p className="text-slate-300">
                              <span className="text-green-400">$</span> {log.input}
                            </p>
                            <p className="text-slate-500 text-xs mt-1">
                              {log.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>

                        <div className="ml-6 space-y-2">
                          <p className="text-slate-400">{log.response}</p>

                          {log.status === "pending" && (
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveCommand(log.id)}
                                className="bg-green-600 hover:bg-green-700 text-xs"
                              >
                                Aprovar
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleRejectCommand(log.id)}
                                variant="destructive"
                                className="text-xs"
                              >
                                Rejeitar
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={logsEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSubmitCommand} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Digite um comando em linguagem natural..."
                    disabled={processing}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                  <Button
                    type="submit"
                    disabled={processing || !input.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Painel de Ajuda */}
          <div className="space-y-4">
            {/* Exemplos de Comandos */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-base">Exemplos de Comandos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="p-2 bg-slate-700 rounded">
                  <p className="text-slate-300">Criar agente:</p>
                  <p className="text-slate-400 text-xs">"Criar um agente chamado Alpha"</p>
                </div>
                <div className="p-2 bg-slate-700 rounded">
                  <p className="text-slate-300">Transferir recursos:</p>
                  <p className="text-slate-400 text-xs">"Transferir 100 para Beta"</p>
                </div>
                <div className="p-2 bg-slate-700 rounded">
                  <p className="text-slate-300">Criar missão:</p>
                  <p className="text-slate-400 text-xs">"Criar uma missão chamada Exploração"</p>
                </div>
                <div className="p-2 bg-slate-700 rounded">
                  <p className="text-slate-300">Analisar ecossistema:</p>
                  <p className="text-slate-400 text-xs">"Como está o ecossistema?"</p>
                </div>
              </CardContent>
            </Card>

            {/* Status de Segurança */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-base">Níveis de Segurança</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600" />
                  <span className="text-slate-300">Crítico (requer aprovação)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-600" />
                  <span className="text-slate-300">Alto (requer aprovação)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-600" />
                  <span className="text-slate-300">Médio (executado)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-600" />
                  <span className="text-slate-300">Baixo (executado)</span>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-base">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total de Comandos:</span>
                  <span className="text-white font-bold">{logs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Executados:</span>
                  <span className="text-green-500 font-bold">
                    {logs.filter((l) => l.status === "executed" || l.status === "approved").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pendentes:</span>
                  <span className="text-yellow-500 font-bold">
                    {logs.filter((l) => l.status === "pending").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rejeitados:</span>
                  <span className="text-red-500 font-bold">
                    {logs.filter((l) => l.status === "rejected").length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
