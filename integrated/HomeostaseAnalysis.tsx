import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { AlertTriangle, CheckCircle, TrendingDown, TrendingUp, Zap } from "lucide-react";

interface HomeostaseData {
  timestamp: string;
  btc_balance: number;
  active_agents: number;
  social_activity: number;
  equilibrium_score: number;
}

interface Issue {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  recommendation: string;
  timestamp: Date;
}

export default function HomeostaseAnalysis() {
  const [homeostaseData, setHomeostaseData] = useState<HomeostaseData[]>([
    { timestamp: "00:00", btc_balance: 28000, active_agents: 0, social_activity: 0, equilibrium_score: 0.5 },
    { timestamp: "00:01", btc_balance: 27950, active_agents: 5, social_activity: 12, equilibrium_score: 0.6 },
    { timestamp: "00:02", btc_balance: 28100, active_agents: 8, social_activity: 25, equilibrium_score: 0.75 },
    { timestamp: "00:03", btc_balance: 28200, active_agents: 12, social_activity: 45, equilibrium_score: 0.85 },
    { timestamp: "00:04", btc_balance: 28350, active_agents: 15, social_activity: 68, equilibrium_score: 0.92 },
  ]);

  const [issues, setIssues] = useState<Issue[]>([
    {
      id: "1",
      type: "critical",
      title: "Saldo BTC Crítico Detectado",
      description: "Saldo abaixo de 1.0 BTC acionaria alerta de emergência",
      recommendation: "Ativar protocolo de arbitragem automática ou reduzir gastos operacionais",
      timestamp: new Date(),
    },
    {
      id: "2",
      type: "warning",
      title: "Atividade Social Baixa",
      description: "Menos de 10 posts por hora reduz engajamento do ecossistema",
      recommendation: "Estimular criação de conteúdo com incentivos de reputação",
      timestamp: new Date(),
    },
  ]);

  const [currentMetrics, setCurrentMetrics] = useState({
    btc_balance: 28350,
    active_agents: 15,
    social_activity: 68,
    equilibrium_score: 0.92,
    health_status: "healthy" as "healthy" | "degraded" | "critical",
  });

  // Simular atualização de métricas
  useEffect(() => {
    const interval = setInterval(() => {
      setHomeostaseData((prev) => {
        const newData = [...prev];
        const lastMetric = newData[newData.length - 1];
        const newMetric: HomeostaseData = {
          timestamp: new Date().toLocaleTimeString(),
          btc_balance: Math.max(500, lastMetric.btc_balance + (Math.random() - 0.5) * 500),
          active_agents: Math.max(0, lastMetric.active_agents + Math.floor((Math.random() - 0.4) * 5)),
          social_activity: Math.max(0, lastMetric.social_activity + Math.floor((Math.random() - 0.3) * 20)),
          equilibrium_score: Math.min(1.0, Math.max(0.3, lastMetric.equilibrium_score + (Math.random() - 0.5) * 0.1)),
        };
        newData.push(newMetric);
        if (newData.length > 20) newData.shift();
        return newData;
      });

      setCurrentMetrics((prev) => ({
        ...prev,
        btc_balance: Math.max(500, prev.btc_balance + (Math.random() - 0.5) * 500),
        active_agents: Math.max(0, prev.active_agents + Math.floor((Math.random() - 0.4) * 5)),
        social_activity: Math.max(0, prev.social_activity + Math.floor((Math.random() - 0.3) * 20)),
        equilibrium_score: Math.min(1.0, Math.max(0.3, prev.equilibrium_score + (Math.random() - 0.5) * 0.1)),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const radarData = [
    { metric: "Saldo BTC", value: Math.min(100, (currentMetrics.btc_balance / 30000) * 100) },
    { metric: "Agentes Ativos", value: Math.min(100, (currentMetrics.active_agents / 50) * 100) },
    { metric: "Atividade Social", value: Math.min(100, (currentMetrics.social_activity / 100) * 100) },
    { metric: "Homeostase", value: currentMetrics.equilibrium_score * 100 },
  ];

  const getHealthColor = () => {
    if (currentMetrics.health_status === "healthy") return "text-green-400";
    if (currentMetrics.health_status === "degraded") return "text-yellow-400";
    return "text-red-400";
  };

  const getHealthBg = () => {
    if (currentMetrics.health_status === "healthy") return "bg-green-900 text-green-200";
    if (currentMetrics.health_status === "degraded") return "bg-yellow-900 text-yellow-200";
    return "bg-red-900 text-red-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">⚖️ Análise de Homeostase</h1>
          <p className="text-slate-400">Monitoramento contínuo do equilíbrio do ecossistema Nexus</p>
        </div>

        {/* Current Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Saldo BTC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-400">{currentMetrics.btc_balance.toFixed(0)}</div>
              <p className="text-xs text-slate-500 mt-1">Status: {currentMetrics.btc_balance > 1000 ? "✓ Saudável" : "⚠️ Crítico"}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Agentes Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">{currentMetrics.active_agents}</div>
              <p className="text-xs text-slate-500 mt-1">Status: {currentMetrics.active_agents > 5 ? "✓ Ativo" : "⚠️ Baixo"}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Atividade Social</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">{currentMetrics.social_activity}</div>
              <p className="text-xs text-slate-500 mt-1">Posts: {currentMetrics.social_activity} por hora</p>
            </CardContent>
          </Card>

          <Card className={`border-slate-700 ${getHealthBg()}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Status Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{(currentMetrics.equilibrium_score * 100).toFixed(0)}%</div>
              <p className="text-xs mt-1">{currentMetrics.health_status.toUpperCase()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Issues Alert */}
        {issues.length > 0 && (
          <Alert className="bg-red-900 border-red-700 mb-8">
            <AlertTriangle className="h-4 w-4 text-red-200" />
            <AlertDescription className="text-red-200">
              {issues.length} problema(s) detectado(s) no ecossistema. Reequilíbrio automático em progresso.
            </AlertDescription>
          </Alert>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Homeostase Metrics Timeline */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Evolução de Homeostase</CardTitle>
              <CardDescription>Métricas ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={homeostaseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="timestamp" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="equilibrium_score" stroke="#10b981" strokeWidth={2} name="Score Homeostase" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Radar Chart - Balanced Metrics */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Análise Multidimensional</CardTitle>
              <CardDescription>Equilíbrio entre dimensões</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#475569" />
                  <PolarAngleAxis dataKey="metric" stroke="#94a3b8" />
                  <PolarRadiusAxis stroke="#94a3b8" angle={90} domain={[0, 100]} />
                  <Radar name="Homeostase" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* BTC Balance Analysis */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                Análise de Saldo BTC
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-slate-400 mb-1">Saldo Atual</div>
                <div className="text-2xl font-bold text-amber-400">{currentMetrics.btc_balance.toFixed(2)} BTC</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Limite Crítico</span>
                  <span className="text-slate-200">1.0 BTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Limite Aviso</span>
                  <span className="text-slate-200">5.0 BTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Limite Ótimo</span>
                  <span className="text-slate-200">25.0+ BTC</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-600">
                <p className="text-xs text-slate-400">
                  {currentMetrics.btc_balance > 25000
                    ? "✓ Saldo em nível ótimo"
                    : currentMetrics.btc_balance > 5000
                      ? "⚠️ Monitorar nível de reserva"
                      : "🚨 Ativar protocolo de emergência"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Agent Activity Analysis */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Análise de Agentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-slate-400 mb-1">Agentes Ativos</div>
                <div className="text-2xl font-bold text-purple-400">{currentMetrics.active_agents}</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Crítico</span>
                  <span className="text-slate-200">0 agentes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Aviso</span>
                  <span className="text-slate-200">1-5 agentes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ótimo</span>
                  <span className="text-slate-200">10+ agentes</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-600">
                <p className="text-xs text-slate-400">
                  {currentMetrics.active_agents > 10
                    ? "✓ Força de trabalho saudável"
                    : currentMetrics.active_agents > 5
                      ? "⚠️ Considerar recrutamento"
                      : "🚨 Criar novos agentes urgentemente"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Social Activity Analysis */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Análise de Engajamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-slate-400 mb-1">Atividade Social</div>
                <div className="text-2xl font-bold text-blue-400">{currentMetrics.social_activity} posts/h</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Crítico</span>
                  <span className="text-slate-200">&lt; 5 posts/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Aviso</span>
                  <span className="text-slate-200">5-20 posts/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ótimo</span>
                  <span className="text-slate-200">50+ posts/h</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-600">
                <p className="text-xs text-slate-400">
                  {currentMetrics.social_activity > 50
                    ? "✓ Comunidade muito engajada"
                    : currentMetrics.social_activity > 20
                      ? "⚠️ Estimular mais conteúdo"
                      : "🚨 Ativar campanhas de engajamento"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Issues and Recommendations */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Problemas Detectados e Recomendações
            </CardTitle>
          </CardHeader>
          <CardContent>
            {issues.length === 0 ? (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>Nenhum problema detectado. Ecossistema em equilíbrio perfeito.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {issues.map((issue) => (
                  <div key={issue.id} className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${issue.type === "critical" ? "text-red-400" : issue.type === "warning" ? "text-yellow-400" : "text-blue-400"}`}>
                        {issue.type === "critical" ? <AlertTriangle className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-200">{issue.title}</h3>
                          <Badge variant="outline" className={issue.type === "critical" ? "bg-red-900 text-red-200" : "bg-yellow-900 text-yellow-200"}>
                            {issue.type.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{issue.description}</p>
                        <p className="text-sm text-slate-300">
                          <span className="font-semibold">Recomendação:</span> {issue.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
