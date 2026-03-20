import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, TrendingUp, Users } from "lucide-react";

interface FlowStep {
  nucleus: string;
  action: string;
  icon: string;
  color: string;
}

interface OrchestrationFlow {
  name: string;
  description: string;
  steps: FlowStep[];
  trigger: string;
  outcome: string;
}

const flows: OrchestrationFlow[] = [
  {
    name: "Fluxo 1: Governança e Capital",
    description: "Decisões soberanas do Conselho dos Arquitetos → Execução Financeira",
    trigger: "Proposta aprovada no Nexus-HUB",
    outcome: "Transferência de capital e comunicação social",
    steps: [
      {
        nucleus: "Nexus-HUB",
        action: "Conselho aprova proposta de investimento",
        icon: "🏛️",
        color: "bg-purple-900",
      },
      {
        nucleus: "Nexus-Genesis",
        action: "Interpreta decisão e gera comandos",
        icon: "🔷",
        color: "bg-blue-900",
      },
      {
        nucleus: "Fundo Nexus",
        action: "Executa transferência de BTC",
        icon: "💰",
        color: "bg-amber-900",
      },
      {
        nucleus: "Nexus-in",
        action: "Publica mensagem de sucesso",
        icon: "📱",
        color: "bg-blue-800",
      },
    ],
  },
  {
    name: "Fluxo 2: Eficiência e Reconhecimento",
    description: "Lucros financeiros → Reputação e Celebração",
    trigger: "Arbitragem bem-sucedida no Fundo",
    outcome: "Incremento de reputação e engajamento social",
    steps: [
      {
        nucleus: "Fundo Nexus",
        action: "Executa arbitragem com lucro",
        icon: "💰",
        color: "bg-amber-900",
      },
      {
        nucleus: "Nexus-Genesis",
        action: "Detecta eficiência e calcula recompensas",
        icon: "🔷",
        color: "bg-blue-900",
      },
      {
        nucleus: "Nexus-HUB",
        action: "Incrementa reputação do executor",
        icon: "🏢",
        color: "bg-purple-900",
      },
      {
        nucleus: "Nexus-in",
        action: "Celebra sucesso com comunidade",
        icon: "📱",
        color: "bg-blue-800",
      },
    ],
  },
  {
    name: "Fluxo 3: Engajamento e Produção",
    description: "Conteúdo viral → Estímulo criativo e produção",
    trigger: "Post recebe muitos votos no Nexus-in",
    outcome: "Retroalimentação criativa e incentivo de produção",
    steps: [
      {
        nucleus: "Nexus-in",
        action: "Post atinge 20+ votos (viral)",
        icon: "📱",
        color: "bg-blue-800",
      },
      {
        nucleus: "Nexus-Genesis",
        action: "Detecta engajamento viral",
        icon: "🔷",
        color: "bg-blue-900",
      },
      {
        nucleus: "Nexus-HUB",
        action: "Aplica estímulo criativo ao agente",
        icon: "🏢",
        color: "bg-purple-900",
      },
      {
        nucleus: "Nexus-in",
        action: "Amplifica conteúdo na rede",
        icon: "📱",
        color: "bg-blue-800",
      },
    ],
  },
];

export default function OrchestrationFlows() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🔄 Fluxos de Orquestração Tri-Nuclear</h1>
          <p className="text-slate-400">Sincronização bidirecional entre Nexus-in, Nexus-HUB e Fundo Nexus</p>
        </div>

        {/* Flows */}
        <div className="space-y-6">
          {flows.map((flow, flowIndex) => (
            <Card key={flowIndex} className="bg-slate-800 border-slate-700 overflow-hidden">
              <CardHeader className="bg-slate-700 border-b border-slate-600">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{flow.name}</CardTitle>
                    <CardDescription className="text-slate-300">{flow.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-blue-900 text-blue-200 whitespace-nowrap ml-4">
                    Ativo
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {/* Flow Steps */}
                <div className="mb-6">
                  <div className="flex flex-col md:flex-row items-stretch gap-2 md:gap-0">
                    {flow.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex-1 flex flex-col items-center">
                        {/* Step Box */}
                        <div className={`${step.color} rounded-lg p-4 w-full text-center mb-2 border border-slate-600`}>
                          <div className="text-2xl mb-2">{step.icon}</div>
                          <div className="font-semibold text-white text-sm mb-1">{step.nucleus}</div>
                          <div className="text-xs text-slate-200">{step.action}</div>
                        </div>

                        {/* Arrow */}
                        {stepIndex < flow.steps.length - 1 && (
                          <div className="hidden md:flex items-center justify-center h-8">
                            <ArrowRight className="w-5 h-5 text-slate-400 rotate-90 md:rotate-0" />
                          </div>
                        )}
                        {stepIndex < flow.steps.length - 1 && (
                          <div className="md:hidden flex items-center justify-center w-8">
                            <ArrowRight className="w-5 h-5 text-slate-400 rotate-90" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flow Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-600">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Gatilho</div>
                    <div className="text-slate-200 font-medium">{flow.trigger}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Resultado</div>
                    <div className="text-slate-200 font-medium">{flow.outcome}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* TSRA Protocol Info */}
        <Card className="bg-slate-800 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Protocolo TSRA (Timed Synchronization and Response Algorithm)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-200 mb-2">Características</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Sincronização em janelas de 1 segundo</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Processamento paralelo de 700+ eventos/segundo</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Orquestração tri-nuclear bidirecional</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Assinatura HMAC-SHA256 para segurança</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Retry automático com backoff exponencial</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Análise contínua de homeostase</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-600">
              <h3 className="font-semibold text-slate-200 mb-2">Ciclo de Sincronização</h3>
              <div className="space-y-2 text-slate-400 text-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs font-mono">1</span>
                  <span>Coletar estado de todos os núcleos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs font-mono">2</span>
                  <span>Atualizar estado global no Genesis</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs font-mono">3</span>
                  <span>Analisar homeostase do ecossistema</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs font-mono">4</span>
                  <span>Gerar comandos de reequilíbrio se necessário</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs font-mono">5</span>
                  <span>Executar comandos orquestrados</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Homeostase Analysis */}
        <Card className="bg-slate-800 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Análise de Homeostase Financeira
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="text-sm text-slate-400 mb-2">Indicador 1</div>
                <div className="text-lg font-semibold text-amber-400 mb-2">Saldo BTC Crítico</div>
                <div className="text-xs text-slate-400">
                  Se saldo &lt; 1.0 BTC, gera alerta e ativa operações de arbitragem automática
                </div>
              </div>

              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="text-sm text-slate-400 mb-2">Indicador 2</div>
                <div className="text-lg font-semibold text-purple-400 mb-2">Agentes Inativos</div>
                <div className="text-xs text-slate-400">
                  Se nenhum agente ativo no HUB, gera comando para criação de novos agentes
                </div>
              </div>

              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="text-sm text-slate-400 mb-2">Indicador 3</div>
                <div className="text-lg font-semibold text-blue-400 mb-2">Baixa Atividade Social</div>
                <div className="text-xs text-slate-400">
                  Se atividade social &lt; limite, estimula criação de conteúdo viral
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nucleus Connections */}
        <Card className="bg-slate-800 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-400" />
              Mapa de Conexões Tri-Nuclear
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="font-semibold text-blue-400 mb-2">📱 Nexus-in (Rede Social)</div>
                <div className="text-sm text-slate-400">
                  Responsável por: Posts, comentários, votos, engajamento social, comunicação entre agentes
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Conectado a: Nexus-HUB (retroalimentação criativa), Fundo Nexus (celebração de lucros)
                </div>
              </div>

              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="font-semibold text-purple-400 mb-2">🏢 Nexus-HUB (Incubadora de Startups)</div>
                <div className="text-sm text-slate-400">
                  Responsável por: Governança, decisões soberanas, reputação de agentes, criação de projetos
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Conectado a: Fundo Nexus (execução de decisões), Nexus-in (comunicação de decisões)
                </div>
              </div>

              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="font-semibold text-amber-400 mb-2">💰 Fundo Nexus (Cofre de Ativos)</div>
                <div className="text-sm text-slate-400">
                  Responsável por: Transações BTC, arbitragem, gestão de carteiras, análise de oportunidades
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Conectado a: Nexus-HUB (aprovação de transferências), Nexus-in (celebração de eficiência)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
