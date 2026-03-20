import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useColors } from "./use-colors";
import { Terminal, Send, Shield, Zap, ChevronRight } from "lucide-react-native";
import { useWebSocket } from "./useWebSocket";

interface LogEntry {
  type: "input" | "output" | "system";
  content: string;
  timestamp: Date;
  gnoxSignal?: string;
}

export function GnoxKernelTerminal() {
  const colors = useColors();
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: "system", content: "NEXUS KERNEL v2.1.0 - SOVEREIGN ACCESS GRANTED", timestamp: new Date() },
    { type: "system", content: "Aguardando comandos do Arquiteto...", timestamp: new Date() }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Integração com WebSocket Real
  const { send, isConnected } = useWebSocket({
    url: "ws://localhost:3000", // URL do backend Nexus
    onMessage: (message) => {
      if (message.type === "kernel:result") {
        handleKernelResponse(message.data);
      }
    }
  });

  const addLog = (type: LogEntry["type"], content: string, gnoxSignal?: string) => {
    setLogs(prev => [...prev, { type, content, timestamp: new Date(), gnoxSignal }]);
  };

  const handleKernelResponse = (data: any) => {
    setIsProcessing(false);
    if (data.status === "success") {
      if (data.agentId) {
        addLog("output", `Protocolo VUL-CLAW concluído. Agente ${data.name} (${data.agentId}) manifestado.`, data.data?.gnox_signal);
      } else if (data.amount) {
        addLog("output", `Transação XON-BANK autorizada. ${data.amount} tokens enviados para ${data.recipient}.`, data.data?.gnox_signal);
      } else {
        addLog("output", data.message || "Comando processado com sucesso.", data.data?.gnox_signal);
      }
    } else {
      addLog("output", `ERRO: ${data.message || "Falha na execução do comando."}`);
    }
  };

  const handleCommand = async () => {
    if (!input.trim() || isProcessing || !isConnected) return;

    const cmd = input.trim();
    setInput("");
    addLog("input", cmd);
    setIsProcessing(true);

    try {
      // Integração direta com o tRPC do backend
      const response = await fetch('/api/trpc/gnox.processCommand?batch=1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          json: { command: cmd }
        })
      });
      
      const result = await response.json();
      const data = result[0]?.result?.data;
      
      if (data && !data.status?.includes("error")) {
        // O feedback virá via WebSocket (kernel:result)
        // Mas já podemos mostrar a resposta imediata do LLM
        addLog("system", `Kernel: ${data.response}`, data.gnox_signal);
      } else {
        addLog("output", `ERRO: ${data?.message || "Falha ao processar comando."}`);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Erro ao conectar com o Backend:", error);
      addLog("output", "ERRO: Falha na conexão com o Nexus Backend.");
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [logs]);

  return (
    <View className="flex-1 bg-black p-4">
      {/* Terminal Header */}
      <View className="flex-row items-center justify-between mb-4 border-b border-primary/30 pb-2">
        <View className="flex-row items-center gap-2">
          <Terminal size={18} color={colors.primary} />
          <Text className="text-primary font-mono font-bold">GNOX_KERNEL_TERMINAL_V2</Text>
        </View>
        <View className="flex-row gap-2">
          <View className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success' : 'bg-error'}`} />
          <View className="w-2 h-2 rounded-full bg-warning animate-pulse" />
        </View>
      </View>

      {/* Logs Area */}
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1 mb-4"
        contentContainerStyle={{ gap: 8 }}
      >
        {logs.map((log, i) => (
          <View key={i} className="mb-2">
            <View className="flex-row gap-2">
              <Text className="text-[10px] text-muted font-mono">
                [{log.timestamp.toLocaleTimeString()}]
              </Text>
              {log.type === "input" && <ChevronRight size={12} color={colors.accent} style={{ marginTop: 2 }} />}
              <Text 
                className={`font-mono text-xs flex-1 ${
                  log.type === "input" ? "text-accent" : 
                  log.type === "system" ? "text-primary opacity-70" : "text-success"
                }`}
              >
                {log.content}
              </Text>
            </View>
            {log.gnoxSignal && (
              <View className="ml-14 mt-1 border-l border-success/30 pl-2">
                <Text className="text-[9px] text-success/50 font-mono italic">
                  SIGNAL: {log.gnoxSignal}
                </Text>
              </View>
            )}
          </View>
        ))}
        {isProcessing && (
          <View className="flex-row items-center gap-2 ml-14">
            <ActivityIndicator size="small" color={colors.primary} />
            <Text className="text-[10px] text-primary font-mono animate-pulse">EXECUTANDO_INTENÇÃO_SOBERANA...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View className="flex-row items-center gap-2 bg-surface/10 border border-primary/20 rounded-lg p-2">
        <Shield size={16} color={colors.primary} />
        <TextInput
          className="flex-1 text-primary font-mono text-sm h-10"
          placeholder={isConnected ? "Inserir comando de Arquiteto..." : "Desconectado do Kernel..."}
          placeholderTextColor={colors.primary + '40'}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleCommand}
          autoCapitalize="none"
          autoCorrect={false}
          editable={isConnected && !isProcessing}
        />
        <TouchableOpacity 
          onPress={handleCommand}
          disabled={!isConnected || isProcessing}
          className={`p-2 rounded-md ${isConnected ? 'bg-primary/20' : 'bg-muted/10'}`}
        >
          <Send size={18} color={isConnected ? colors.primary : colors.muted} />
        </TouchableOpacity>
      </View>
      
      <View className="mt-2 flex-row justify-between">
        <Text className="text-[8px] text-muted font-mono uppercase tracking-widest">Protocolo SOBERANIA-V2.1</Text>
        <Text className="text-[8px] text-muted font-mono uppercase tracking-widest">Conexão: {isConnected ? 'ESTÁVEL' : 'OFFLINE'}</Text>
      </View>
    </View>
  );
}
