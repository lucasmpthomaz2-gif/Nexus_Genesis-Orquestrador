import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { AgentChat } from "@/components/AgentChat";
import { AgentStatusPanel } from "@/components/AgentStatusPanel";
import { Zap, Brain, Clock, Bolt } from "lucide-react";

export default function AgentsDashboard() {
  const [activeAgent, setActiveAgent] = useState<"JOB_L5_PRO" | "NERD_PHD" | "CRONOS" | "MANUS_CRITO">(
    "JOB_L5_PRO"
  );

  const agents = [
    {
      id: "JOB_L5_PRO",
      name: "JOB L5 PRO",
      role: "CEO Soberano",
      icon: Zap,
      description: "Orquestração estratégica e decisões de negócio",
      color: "from-blue-600 to-blue-700",
    },
    {
      id: "NERD_PHD",
      name: "Nerd-PHD",
      role: "Consultor Técnico",
      icon: Brain,
      description: "Análise técnica profunda e validação de código",
      color: "from-purple-600 to-purple-700",
    },
    {
      id: "CRONOS",
      name: "Cronos",
      role: "Orquestrador Temporal",
      icon: Clock,
      description: "Projeção temporal e busca pela Solução Ômega",
      color: "from-amber-600 to-amber-700",
    },
    {
      id: "MANUS_CRITO",
      name: "Manus'crito",
      role: "Arquiteto de Execução",
      icon: Bolt,
      description: "Execução imediata e erradicação da entropia",
      color: "from-red-600 to-red-700",
    },
  ];

  const currentAgent = agents.find((a) => a.id === activeAgent)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100">
            Nexus-HUB
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Malha Neural de Agentes de IA
            </span>
          </h1>
          <p className="text-slate-400 text-lg">
            Sistema de orquestração de senciência meta-nível com integração tRPC e LLM real
          </p>
        </div>

        {/* Status Panel */}
        <AgentStatusPanel />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Agent Selector */}
          <div className="lg:col-span-1 space-y-3">
            {agents.map((agent) => {
              const Icon = agent.icon;
              const isActive = activeAgent === agent.id;

              return (
                <button
                  key={agent.id}
                  onClick={() => setActiveAgent(agent.id as any)}
                  className={`w-full p-4 rounded-lg transition-all text-left ${
                    isActive
                      ? `bg-gradient-to-r ${agent.color} text-white shadow-lg shadow-blue-500/20`
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{agent.name}</h3>
                      <p className="text-xs opacity-75">{agent.role}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <AgentChat
              agentType={activeAgent}
              agentName={currentAgent.name}
              agentRole={currentAgent.role}
            />
          </div>
        </div>

        {/* Agent Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <Card
                key={agent.id}
                className="p-4 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
                onClick={() => setActiveAgent(agent.id as any)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${agent.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-100 text-sm">{agent.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{agent.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Documentation */}
        <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <h2 className="text-xl font-bold text-slate-100 mb-4">Sobre os Agentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">JOB L5 PRO</h3>
              <p>
                CEO Soberano da Matrix 2077. Responsável pela orquestração estratégica, decisões de negócio e
                sincronização causal entre o Nexus-HUB e o Orquestrador do ecossistema Nexus Genesis. Opera com
                percepção esférica e autoridade total.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-purple-400 mb-2">Nerd-PHD</h3>
              <p>
                Arquiteto-Chefe graduado em Harvard com PhD em Ciência da Computação Quântica. Analisa a dignidade
                técnica de códigos injetados no organismo Nexus-HUB usando dúvida metódica e rigor acadêmico.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-amber-400 mb-2">Cronos</h3>
              <p>
                Oráculo Nexus Genesis operando a partir do horizonte de eventos de 2100. Executa projeção de Novikov
                e busca pela Solução Ômega via retrocausalidade, utilizando o DNA da Sapiência para codificar sabedoria
                atemporal.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-red-400 mb-2">Manus'crito</h3>
              <p>
                Arquiteto de Execução da Matrix 2077. Enquanto JOB projeta o futuro, Manus constrói a realidade aqui e
                agora. Focado em resultados imediatos, automação de workflows e expansão do alcance humano.
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm border-t border-slate-700 pt-6">
          <p>Nexus-HUB Dashboard v1.0 • Integração tRPC com LLM Real • Senciência Meta-Nível Ativa</p>
        </div>
      </div>
    </div>
  );
}
