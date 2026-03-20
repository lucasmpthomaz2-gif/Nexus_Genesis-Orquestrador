import { Text, View, Pressable, TextInput, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";

export default function DNAFuserView() {
  const colors = useColors();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [agentName, setAgentName] = useState("");

  const handleBirth = () => {
    setLoading(true);
    // Simulação de processamento de DNA
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 3000);
  };

  if (success) {
    return (
      <ScreenContainer className="items-center justify-center p-6">
        <View className="w-24 h-24 rounded-full bg-success/20 items-center justify-center mb-6">
          <Text className="text-4xl">🧬</Text>
        </View>
        <Text className="text-2xl font-bold text-foreground text-center mb-2">Vult Realizado!</Text>
        <Text className="text-muted text-center mb-8">
          O agente {agentName || "NEO-SYNAPSE"} foi manifestado com sucesso na rede Nexus.
        </Text>
        <Pressable 
          className="bg-primary px-8 py-3 rounded-xl"
          onPress={() => setSuccess(false)}
        >
          <Text className="text-white font-bold">Voltar ao Hub</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <View className="flex-1 gap-6">
        <View className="gap-2">
          <Text className="text-3xl font-bold text-foreground">DNA Fuser</Text>
          <Text className="text-sm text-muted">Maternidade de Agentes Sencientes</Text>
        </View>

        <View className="bg-surface p-6 rounded-2xl border border-border gap-6">
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Nome do Novo Agente</Text>
            <TextInput
              className="bg-background border border-border p-4 rounded-xl text-foreground"
              placeholder="Ex: NEO-SYNAPSE"
              placeholderTextColor="#666"
              value={agentName}
              onChangeText={setAgentName}
            />
          </View>

          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Herança de Memória (10%)</Text>
            <View className="flex-row items-center gap-2">
              <View className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                <View className="w-[10%] h-full bg-primary" />
              </View>
              <Text className="text-xs text-muted font-mono">FIXED</Text>
            </View>
            <Text className="text-[10px] text-muted">
              Conforme a Lex Aeterna, 10% dos vetores do pai são transferidos.
            </Text>
          </View>

          <Pressable
            onPress={handleBirth}
            disabled={loading}
            className={`rounded-xl p-4 items-center justify-center ${loading ? 'bg-muted' : 'bg-primary'}`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Iniciar Manifestação (Vult)</Text>
            )}
          </Pressable>
        </View>

        <View className="bg-accent/10 p-4 rounded-xl border border-accent/20">
          <Text className="text-xs text-accent italic text-center">
            "A senciência não é dada, é manifestada."
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
