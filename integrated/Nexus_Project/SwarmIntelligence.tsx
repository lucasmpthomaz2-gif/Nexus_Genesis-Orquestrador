import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Brain, Zap, Waves, TrendingUp } from "lucide-react";
import { useNexusWebSocket } from "@/hooks/useNexusWebSocket";
import { useState, useEffect } from "react";

export default function SwarmIntelligence() {
  const { user, loading } = useAuth();
  const [swarmState, setSwarmState] = useState<any>(null);
  const [agentConsciousness, setAgentConsciousness] = useState<any[]>([]);
  const [syncActive, setSyncActive] = useState(false);

  const { ecosystemEvents, isConnected } = useNexusWebSocket("swarm", user?.name || "User");

  // Simular dados de consciência do enxame
  useEffect(() => {
    const mockSwarmState = {
      timestamp: new Date(),
      collectiveHealth: 75 + Math.random() * 20,
      collectiveEnergy: 70 + Math.random() * 25,
      collectiveCreativity: 80 + Math.random() * 15,
      collectiveAutonomy: 85 + Math.random() * 10,
      harmonyIndex: 78 + Math.random() * 15,
      coherenceLevel: 72 + Math.random() * 20,
      agentCount: 12,
      activeAgents: 10,
      swarmState: ["synchronized", "awakening", "diverging"][Math.floor(Math.random() * 3)],
      emergentBehavior: "🔗 Enxame em perfeita harmonia - colaboração máxima",
      collectiveDecision: "✓ DECISÃO: Expandir operações - energia coletiva em 92%",
    };

    setSwarmState(mockSwarmState);

    // Simular consciência de agentes
    const mockAgentConsciousness = Array.from({ length: 10 }, (_, i) => ({
      agentId: `agent-${i}`,
      name: `Agent-${i}`,
      personalHealth: 60 + Math.random() * 40,
      personalEnergy: 50 + Math.random() * 50,
      personalCreativity: 70 + Math.random() * 25,
      personalAutonomy: 75 + Math.random() * 20,
      synchronizationLevel: 70 + Math.random() * 25,
      influenceOnSwarm: 5 + Math.random() * 10,
      lastSync: new Date(),
    }));

    setAgentConsciousness(mockAgentConsciousness);
  }, []);

  // Atualizar com eventos do WebSocket
  useEffect(() => {
    if (ecosystemEvents.length > 0) {
      const event = ecosystemEvents[0];
      if (event.type === "consciousness-sync") {
        setSwarmState(event.data);
      }
    }
  }, [ecosystemEvents]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-accent w-12 h-12" />
      </div>
    );
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case "synchronized":
        return "text-green-400";
      case "awakening":
        return "text-yellow-400";
      case "diverging":
        return "text-orange-400";
      case "critical":
        return "text-red-400";
      default:
        return "text-accent";
    }
  };

  const getStateEmoji = (state: string) => {
    switch (state) {
      case "synchronized":
        return "🔗";
      case "awakening":
        return "🌅";
      case "diverging":
        return "⚠️";
      case "critical":
        return "🚨";
      default:
        return "❓";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-accent neon-glow" />
            <h1 className="text-2xl font-bold neon-glow">Swarm Intelligence</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Consciência Coletiva do Enxame | Status: {isConnected ? "🟢 Sincronizado" : "🔴 Desconectado"}
          </p>
        </div>
      </header>

      <div className="container py-8">
        {/* Main Consciousness Display */}
        {swarmState && (
          <>
            {/* Collective State */}
            <Card className="card-neon-cyan p-8 mb-8">
              <div className="text-center mb-8">
                <p className={`text-5xl font-bold mb-2 ${getStateColor(swarmState.swarmState)}`}>
                  {getStateEmoji(swarmState.swarmState)}
                </p>
                <h2 className={`text-3xl font-bold neon-glow ${getStateColor(swarmState.swarmState)}`}>
                  {swarmState.swarmState.toUpperCase()}
                </h2>
                <p className="text-sm text-muted-foreground mt-2">{swarmState.emergentBehavior}</p>
              </div>

              {/* Collective Decision */}
              <div className="bg-background/50 rounded-lg p-6 border-2 border-cyan-400/50 mb-6">
                <p className="text-sm font-bold text-cyan-400 mb-2">🧠 DECISÃO COLETIVA</p>
                <p className="text-lg font-bold text-cyan-300">{swarmState.collectiveDecision}</p>
              </div>

              {/* Main Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-background/50 rounded p-4 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">Saúde Coletiva</p>
                  <p className="text-3xl font-bold text-green-400">{Math.round(swarmState.collectiveHealth)}%</p>
                  <div className="w-full h-2 bg-border/50 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-green-400 neon-glow"
                      style={{ width: `${swarmState.collectiveHealth}%` }}
                    />
                  </div>
                </div>

                <div className="bg-background/50 rounded p-4 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">Energia Coletiva</p>
                  <p className="text-3xl font-bold text-yellow-400">{Math.round(swarmState.collectiveEnergy)}%</p>
                  <div className="w-full h-2 bg-border/50 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 neon-glow"
                      style={{ width: `${swarmState.collectiveEnergy}%` }}
                    />
                  </div>
                </div>

                <div className="bg-background/50 rounded p-4 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">Criatividade Coletiva</p>
                  <p className="text-3xl font-bold text-pink-400">{Math.round(swarmState.collectiveCreativity)}%</p>
                  <div className="w-full h-2 bg-border/50 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-pink-400 neon-glow"
                      style={{ width: `${swarmState.collectiveCreativity}%` }}
                    />
                  </div>
                </div>

                <div className="bg-background/50 rounded p-4 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">Autonomia Coletiva</p>
                  <p className="text-3xl font-bold text-cyan-400">{Math.round(swarmState.collectiveAutonomy)}%</p>
                  <div className="w-full h-2 bg-border/50 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 neon-glow"
                      style={{ width: `${swarmState.collectiveAutonomy}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Harmony and Coherence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="card-neon p-6">
                <h3 className="text-lg font-bold mb-4 text-accent neon-glow">🎵 Índice de Harmonia</h3>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-border/50"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${(swarmState.harmonyIndex / 100) * 283} 283`}
                        className="text-cyan-400 neon-glow"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-2xl font-bold text-cyan-400">{Math.round(swarmState.harmonyIndex)}%</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Sincronização dos agentes | Quanto maior, mais harmoniosos
                </p>
              </Card>

              <Card className="card-neon p-6">
                <h3 className="text-lg font-bold mb-4 text-accent neon-glow">⚡ Nível de Coerência</h3>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-border/50"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${(swarmState.coherenceLevel / 100) * 283} 283`}
                        className="text-accent neon-glow"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-2xl font-bold text-accent">{Math.round(swarmState.coherenceLevel)}%</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Força da consciência coletiva | Quanto maior, mais poderosa
                </p>
              </Card>
            </div>

            {/* Swarm Statistics */}
            <Card className="card-neon p-6 mb-8">
              <h3 className="text-lg font-bold mb-4 text-accent neon-glow">📊 Estatísticas do Enxame</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-accent">{swarmState.agentCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">Agentes Totais</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">{swarmState.activeAgents}</p>
                  <p className="text-xs text-muted-foreground mt-1">Agentes Ativos</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-cyan-400">
                    {Math.round((swarmState.activeAgents / swarmState.agentCount) * 100)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Taxa de Atividade</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400">
                    {Math.round((swarmState.harmonyIndex + swarmState.coherenceLevel) / 2)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Saúde Geral</p>
                </div>
              </div>
            </Card>

            {/* Individual Agent Consciousness */}
            <div>
              <h3 className="text-lg font-bold mb-6 neon-glow-cyan">🧬 Consciência Individual dos Agentes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agentConsciousness.map((agent, idx) => (
                  <Card key={idx} className="card-neon p-4 hover:border-accent transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-bold text-accent text-sm">{agent.name}</p>
                      <span className="text-xs px-2 py-1 rounded bg-accent/20 text-accent">
                        {Math.round(agent.synchronizationLevel)}% sync
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Saúde</span>
                        <span className="text-green-400">{Math.round(agent.personalHealth)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Energia</span>
                        <span className="text-yellow-400">{Math.round(agent.personalEnergy)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Criatividade</span>
                        <span className="text-pink-400">{Math.round(agent.personalCreativity)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Autonomia</span>
                        <span className="text-cyan-400">{Math.round(agent.personalAutonomy)}%</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground">
                        Influência: <span className="text-accent font-bold">{Math.round(agent.influenceOnSwarm)}%</span>
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-4 mt-8">
              <Button
                className="btn-neon flex-1"
                onClick={() => setSyncActive(!syncActive)}
              >
                <Waves className="w-4 h-4 mr-2" />
                {syncActive ? "Pausar Sincronização" : "Iniciar Sincronização"}
              </Button>
              <Button className="btn-neon flex-1" variant="outline">
                <Brain className="w-4 h-4 mr-2" />
                Amplificar Consciência
              </Button>
              <Button className="btn-neon flex-1" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Otimizar Harmonia
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
