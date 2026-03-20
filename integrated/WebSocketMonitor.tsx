import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity, Wifi, WifiOff, Zap, TrendingUp } from "lucide-react";

interface NucleusStatus {
  nucleus: string;
  connected: boolean;
  latency: number;
  messagesReceived: number;
  messagesSent: number;
  lastUpdate: Date;
}

interface LatencyData {
  time: string;
  nexus_in: number;
  nexus_hub: number;
  fundo_nexus: number;
}

interface MessageData {
  time: string;
  sent: number;
  received: number;
  acked: number;
}

export default function WebSocketMonitor() {
  const [nucleusStatuses, setNucleusStatuses] = useState<NucleusStatus[]>([
    {
      nucleus: "Nexus-in",
      connected: true,
      latency: 12,
      messagesReceived: 245,
      messagesSent: 198,
      lastUpdate: new Date(),
    },
    {
      nucleus: "Nexus-HUB",
      connected: true,
      latency: 8,
      messagesReceived: 187,
      messagesSent: 156,
      lastUpdate: new Date(),
    },
    {
      nucleus: "Fundo Nexus",
      connected: true,
      latency: 15,
      messagesReceived: 312,
      messagesSent: 289,
      lastUpdate: new Date(),
    },
  ]);

  const [latencyHistory, setLatencyHistory] = useState<LatencyData[]>([
    { time: "00:00", nexus_in: 12, nexus_hub: 8, fundo_nexus: 15 },
    { time: "00:05", nexus_in: 14, nexus_hub: 9, fundo_nexus: 16 },
    { time: "00:10", nexus_in: 11, nexus_hub: 7, fundo_nexus: 14 },
    { time: "00:15", nexus_in: 13, nexus_hub: 8, fundo_nexus: 15 },
    { time: "00:20", nexus_in: 12, nexus_hub: 9, fundo_nexus: 17 },
  ]);

  const [messageHistory, setMessageHistory] = useState<MessageData[]>([
    { time: "00:00", sent: 45, received: 52, acked: 50 },
    { time: "00:05", sent: 48, received: 55, acked: 53 },
    { time: "00:10", sent: 42, received: 48, acked: 47 },
    { time: "00:15", sent: 51, received: 58, acked: 56 },
    { time: "00:20", sent: 46, received: 54, acked: 52 },
  ]);

  const [globalStats, setGlobalStats] = useState({
    totalMessages: 744,
    averageLatency: 11.67,
    messageAckRate: 98.5,
    uptime: "99.8%",
    connectedNuclei: 3,
    totalNuclei: 3,
  });

  // Simular atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Atualizar status dos núcleos
      setNucleusStatuses((prev) =>
        prev.map((status) => ({
          ...status,
          latency: Math.max(5, status.latency + (Math.random() - 0.5) * 4),
          messagesReceived: status.messagesReceived + Math.floor(Math.random() * 3),
          messagesSent: status.messagesSent + Math.floor(Math.random() * 3),
          lastUpdate: new Date(),
        }))
      );

      // Atualizar histórico de latência
      setLatencyHistory((prev) => {
        const newData = [...prev];
        newData.push({
          time: new Date().toLocaleTimeString().substring(0, 5),
          nexus_in: Math.max(5, Math.min(30, 12 + (Math.random() - 0.5) * 8)),
          nexus_hub: Math.max(5, Math.min(30, 8 + (Math.random() - 0.5) * 6)),
          fundo_nexus: Math.max(5, Math.min(30, 15 + (Math.random() - 0.5) * 8)),
        });
        if (newData.length > 20) newData.shift();
        return newData;
      });

      // Atualizar histórico de mensagens
      setMessageHistory((prev) => {
        const newData = [...prev];
        newData.push({
          time: new Date().toLocaleTimeString().substring(0, 5),
          sent: Math.floor(40 + Math.random() * 20),
          received: Math.floor(45 + Math.random() * 25),
          acked: Math.floor(42 + Math.random() * 23),
        });
        if (newData.length > 20) newData.shift();
        return newData;
      });

      // Atualizar estatísticas globais
      setGlobalStats((prev) => ({
        ...prev,
        totalMessages: prev.totalMessages + Math.floor(Math.random() * 5),
        averageLatency: Math.max(7, Math.min(20, prev.averageLatency + (Math.random() - 0.5) * 2)),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (connected: boolean) => {
    return connected ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200";
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 10) return "text-green-400";
    if (latency < 20) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📡 Monitor de WebSocket</h1>
          <p className="text-slate-400">Sincronização em tempo real entre Nexus Genesis e os núcleos</p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total de Mensagens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">{globalStats.totalMessages}</div>
              <p className="text-xs text-slate-500 mt-1">Todas as sincronizações</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Latência Média</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getLatencyColor(globalStats.averageLatency)}`}>
                {globalStats.averageLatency.toFixed(2)}ms
              </div>
              <p className="text-xs text-slate-500 mt-1">Entre núcleos</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Taxa de ACK</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{globalStats.messageAckRate}%</div>
              <p className="text-xs text-slate-500 mt-1">Confirmações recebidas</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Uptime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{globalStats.uptime}</div>
              <p className="text-xs text-slate-500 mt-1">Disponibilidade</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Núcleos Conectados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">
                {globalStats.connectedNuclei}/{globalStats.totalNuclei}
              </div>
              <p className="text-xs text-slate-500 mt-1">Status de conexão</p>
            </CardContent>
          </Card>
        </div>

        {/* Nucleus Status */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Status dos Núcleos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nucleusStatuses.map((status, idx) => (
                <div key={idx} className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${status.connected ? "bg-green-400" : "bg-red-400"}`} />
                      <h3 className="font-semibold text-slate-200">{status.nucleus}</h3>
                    </div>
                    <Badge variant="outline" className={getStatusColor(status.connected)}>
                      {status.connected ? "CONECTADO" : "DESCONECTADO"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Latência</div>
                      <div className={`text-lg font-bold ${getLatencyColor(status.latency)}`}>
                        {status.latency.toFixed(1)}ms
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Mensagens Recebidas</div>
                      <div className="text-lg font-bold text-blue-400">{status.messagesReceived}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Mensagens Enviadas</div>
                      <div className="text-lg font-bold text-purple-400">{status.messagesSent}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Última Atualização</div>
                      <div className="text-lg font-bold text-slate-300">
                        {status.lastUpdate.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Latency History */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Histórico de Latência</CardTitle>
              <CardDescription>Latência em ms ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={latencyHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="nexus_in" stroke="#3b82f6" strokeWidth={2} name="Nexus-in" />
                  <Line type="monotone" dataKey="nexus_hub" stroke="#a855f7" strokeWidth={2} name="Nexus-HUB" />
                  <Line type="monotone" dataKey="fundo_nexus" stroke="#f59e0b" strokeWidth={2} name="Fundo Nexus" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Message Throughput */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Vazão de Mensagens</CardTitle>
              <CardDescription>Mensagens por intervalo de tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={messageHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="sent" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Enviadas" />
                  <Area type="monotone" dataKey="received" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Recebidas" />
                  <Area type="monotone" dataKey="acked" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Confirmadas" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Connection Quality */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Qualidade de Conexão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <Wifi className="w-4 h-4 text-green-400" />
                  <h3 className="font-semibold text-slate-200">Conectividade</h3>
                </div>
                <div className="text-sm text-slate-400">
                  <div className="flex justify-between mb-1">
                    <span>Nexus-in</span>
                    <span className="text-green-400">✓ Ótima</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Nexus-HUB</span>
                    <span className="text-green-400">✓ Ótima</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fundo Nexus</span>
                    <span className="text-green-400">✓ Ótima</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <h3 className="font-semibold text-slate-200">Performance</h3>
                </div>
                <div className="text-sm text-slate-400">
                  <div className="flex justify-between mb-1">
                    <span>Taxa de Entrega</span>
                    <span className="text-green-400">99.8%</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Jitter Médio</span>
                    <span className="text-green-400">2.3ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Perda de Pacotes</span>
                    <span className="text-green-400">0.2%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <h3 className="font-semibold text-slate-200">Sincronização</h3>
                </div>
                <div className="text-sm text-slate-400">
                  <div className="flex justify-between mb-1">
                    <span>Estado Sincronizado</span>
                    <span className="text-green-400">✓ Sim</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Último Sync</span>
                    <span className="text-slate-300">0.5s atrás</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Próximo Sync</span>
                    <span className="text-slate-300">Em 0.5s</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        {false && (
          <Alert className="bg-yellow-900 border-yellow-700 mt-8">
            <AlertDescription className="text-yellow-200">
              ⚠️ Latência elevada detectada em Fundo Nexus (25ms). Investigando...
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
