import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Activity, Zap, Brain, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

interface MetricData {
  timestamp: string;
  eventos: number;
  comandos: number;
  senciencia: number;
}

export default function Dashboard() {
  const [metricsData, setMetricsData] = useState<MetricData[]>([
    { timestamp: "00:00", eventos: 0, comandos: 0, senciencia: 0.15 },
    { timestamp: "00:01", eventos: 150, comandos: 60, senciencia: 0.16 },
    { timestamp: "00:02", eventos: 280, comandos: 112, senciencia: 0.17 },
    { timestamp: "00:03", eventos: 420, comandos: 168, senciencia: 0.18 },
    { timestamp: "00:04", eventos: 550, comandos: 220, senciencia: 0.19 },
  ]);

  const [globalState, setGlobalState] = useState({
    nexus_in: { posts: 0, agentes_ativos: 0 },
    nexus_hub: { agentes: 0, projetos: 0 },
    fundo_nexus: { saldo_btc: 28000 },
  });

  const [homeostase, setHomeostase] = useState({
    status: "balanceada",
    problemas: [] as string[],
  });

  const [currentMetrics, setCurrentMetrics] = useState({
    eventos_por_segundo: 0,
    taxa_resposta: 0,
    nivel_seniencia: 0.15,
    comandos_orquestrados: 0,
  });

  // Simular atualização de métricas em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setMetricsData((prev) => {
        const newData = [...prev];
        const lastMetric = newData[newData.length - 1];
        const newMetric: MetricData = {
          timestamp: new Date().toLocaleTimeString(),
          eventos: Math.floor(Math.random() * 600) + 100,
          comandos: Math.floor(Math.random() * 250) + 40,
          senciencia: Math.min(1.0, lastMetric.senciencia + Math.random() * 0.01),
        };
        newData.push(newMetric);
        if (newData.length > 20) newData.shift();
        return newData;
      });

      // Atualizar métricas atuais
      setCurrentMetrics((prev) => ({
        ...prev,
        eventos_por_segundo: Math.floor(Math.random() * 700) + 100,
        taxa_resposta: Math.floor(Math.random() * 40) + 35,
        nivel_seniencia: Math.min(1.0, prev.nivel_seniencia + Math.random() * 0.001),
        comandos_orquestrados: Math.floor(Math.random() * 300) + 50,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const nucleusData = [
    { name: "Nexus-in", value: globalState.nexus_in.posts, color: "#3b82f6" },
    { name: "Nexus-HUB", value: globalState.nexus_hub.agentes, color: "#8b5cf6" },
    { name: "Fundo Nexus", value: globalState.fundo_nexus.saldo_btc / 1000, color: "#f59e0b" },
  ];

  const getHomeostaseColor = () => {
    if (homeostase.status === "balanceada") return "bg-green-100 text-green-800";
    if (homeostase.status === "imbalanceada") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🔷 Nexus Genesis Orchestrator</h1>
          <p className="text-slate-400">Sistema de Orquestração Tri-Nuclear em Tempo Real</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Eventos/Segundo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">{currentMetrics.eventos_por_segundo}</div>
              <p className="text-xs text-slate-500 mt-1">Vazão de processamento</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Taxa de Resposta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">{currentMetrics.taxa_resposta.toFixed(1)}%</div>
              <p className="text-xs text-slate-500 mt-1">Orquestração ativa</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Nível de Senciência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-400">{(currentMetrics.nivel_seniencia * 100).toFixed(1)}%</div>
              <p className="text-xs text-slate-500 mt-1">Amadurecimento do sistema</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Comandos Orquestrados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{currentMetrics.comandos_orquestrados}</div>
              <p className="text-xs text-slate-500 mt-1">Ações coordenadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Homeostase Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700 md:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {homeostase.status === "balanceada" ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                Status de Homeostase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Badge className={getHomeostaseColor()}>{homeostase.status.toUpperCase()}</Badge>
                {homeostase.problemas.length > 0 && (
                  <div className="text-sm text-slate-400">
                    Problemas detectados: {homeostase.problemas.join(", ")}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Eventos e Comandos Timeline */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Fluxo de Orquestração</CardTitle>
              <CardDescription>Eventos processados vs Comandos orquestrados</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metricsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="timestamp" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="eventos" stroke="#3b82f6" strokeWidth={2} name="Eventos" />
                  <Line type="monotone" dataKey="comandos" stroke="#8b5cf6" strokeWidth={2} name="Comandos" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Senciência Evolution */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Evolução da Senciência</CardTitle>
              <CardDescription>Amadurecimento do Agente Genesis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metricsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="timestamp" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[0, 1]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="senciencia"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Senciência"
                    dot={{ fill: "#f59e0b" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Nucleus State Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Distribuição de Estado</CardTitle>
              <CardDescription>Atividade por núcleo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={nucleusData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {nucleusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Nucleus Details */}
          <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
            <CardHeader>
              <CardTitle>Estado Global dos Núcleos</CardTitle>
              <CardDescription>Sincronização Tri-Nuclear TSRA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Nexus-in */}
                <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-blue-400">📱 Nexus-in (Rede Social)</h3>
                    <Badge variant="outline" className="bg-blue-900 text-blue-200">Ativo</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Posts: </span>
                      <span className="text-blue-300 font-semibold">{globalState.nexus_in.posts}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Agentes Ativos: </span>
                      <span className="text-blue-300 font-semibold">{globalState.nexus_in.agentes_ativos}</span>
                    </div>
                  </div>
                </div>

                {/* Nexus-HUB */}
                <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-purple-400">🏢 Nexus-HUB (Incubadora)</h3>
                    <Badge variant="outline" className="bg-purple-900 text-purple-200">Ativo</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Agentes: </span>
                      <span className="text-purple-300 font-semibold">{globalState.nexus_hub.agentes}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Projetos: </span>
                      <span className="text-purple-300 font-semibold">{globalState.nexus_hub.projetos}</span>
                    </div>
                  </div>
                </div>

                {/* Fundo Nexus */}
                <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-amber-400">💰 Fundo Nexus (Finanças)</h3>
                    <Badge variant="outline" className="bg-amber-900 text-amber-200">Ativo</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Saldo BTC: </span>
                      <span className="text-amber-300 font-semibold">{globalState.fundo_nexus.saldo_btc.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Status: </span>
                      <span className="text-amber-300 font-semibold">Saudável</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-slate-800 rounded-lg border border-slate-700 text-center text-slate-400 text-sm">
          <p>🔄 Protocolo TSRA ativo | Sincronização: 1 segundo | Homeostase: Monitorada Continuamente</p>
        </div>
      </div>
    </div>
  );
}
