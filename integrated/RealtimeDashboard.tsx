/**
 * Dashboard em Tempo Real para Nexus Genesis
 * Exibe gráficos dinâmicos de orquestração, estado dos núcleos e métricas TSRA
 */

import { useEffect, useState } from "react";
import { useWebSocketEvents } from "@/hooks/useWebSocket";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertCircle, CheckCircle, AlertTriangle, Zap } from "lucide-react";

interface NucleusStatus {
  name: string;
  status: "healthy" | "degraded" | "critical";
  lastUpdate: Date;
}

interface HomeostaseData {
  timestamp: Date;
  nucleusName: string;
  balance: number;
  threshold: number;
  isAlarm: boolean;
}

interface TsraMetric {
  timestamp: Date;
  syncWindow: number;
  eventsProcessed: number;
  commandsExecuted: number;
  syncDurationMs: number;
}

interface SenciencyData {
  timestamp: Date;
  level: number;
}

export function RealtimeDashboard() {
  const [nucleusStates, setNucleusStates] = useState<Map<string, NucleusStatus>>(new Map());
  const [homeostaseHistory, setHomeostaseHistory] = useState<HomeostaseData[]>([]);
  const [tsraMetrics, setTsraMetrics] = useState<TsraMetric[]>([]);
  const [senciencyHistory, setSenciencyHistory] = useState<SenciencyData[]>([]);
  const [eventCount, setEventCount] = useState(0);
  const [commandCount, setCommandCount] = useState(0);

  // Escuta mudanças de estado dos núcleos
  useWebSocketEvents(
    ["nucleus:state-changed"],
    (eventType, event) => {
      if (eventType === "nucleus:state-changed") {
        const { nucleusName, status } = event.payload;
        setNucleusStates((prev) => {
          const newMap = new Map(prev);
          newMap.set(nucleusName, {
            name: nucleusName,
            status,
            lastUpdate: new Date(),
          });
          return newMap;
        });
      }
    }
  );

  // Escuta métricas de homeostase
  useWebSocketEvents(
    ["homeostase:metric"],
    (eventType, event) => {
      if (eventType === "homeostase:metric") {
        const payload = event.payload;
        setHomeostaseHistory((prev) => {
          const newHistory = [...prev, { ...payload, timestamp: new Date() }];
          return newHistory.slice(-50); // Mantém últimas 50 métricas
        });
      }
    }
  );

  // Escuta sincronização TSRA
  useWebSocketEvents(
    ["tsra:sync"],
    (eventType, event) => {
      if (eventType === "tsra:sync") {
        const payload = event.payload;
        setTsraMetrics((prev) => {
          const newMetrics = [...prev, { ...payload, timestamp: new Date() }];
          return newMetrics.slice(-30); // Mantém últimas 30 métricas
        });
      }
    }
  );

  // Escuta experiências do Genesis
  useWebSocketEvents(
    ["genesis:experience"],
    (eventType, event) => {
      if (eventType === "genesis:experience") {
        const { senciencyDelta } = event.payload;
        setSenciencyHistory((prev) => {
          const newHistory = [...prev, {
            timestamp: new Date(),
            level: parseFloat(senciencyDelta) || 0,
          }];
          return newHistory.slice(-30); // Mantém últimas 30 experiências
        });
      }
    }
  );

  // Escuta eventos de orquestração
  useWebSocketEvents(
    ["orchestration:event"],
    (eventType, event) => {
      setEventCount((prev) => prev + 1);
    }
  );

  // Escuta comandos de orquestração
  useWebSocketEvents(
    ["orchestration:command"],
    (eventType, event) => {
      setCommandCount((prev) => prev + 1);
    }
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "critical":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "healthy":
        return "default";
      case "degraded":
        return "secondary";
      case "critical":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Prepara dados para gráfico de homeostase
  const homeostaseChartData = homeostaseHistory.map((item) => ({
    time: item.timestamp.toLocaleTimeString("pt-BR"),
    balance: item.balance,
    threshold: item.threshold,
  }));

  // Prepara dados para gráfico de TSRA
  const tsraChartData = tsraMetrics.map((item) => ({
    window: item.syncWindow,
    events: item.eventsProcessed,
    commands: item.commandsExecuted,
    duration: item.syncDurationMs,
  }));

  // Prepara dados para gráfico de senciência
  const senciencyChartData = senciencyHistory.map((item) => ({
    time: item.timestamp.toLocaleTimeString("pt-BR"),
    level: item.level,
  }));

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card de Núcleos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Núcleos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nucleusStates.size}</div>
            <p className="text-xs text-muted-foreground">Núcleos monitorados</p>
          </CardContent>
        </Card>

        {/* Card de Eventos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventCount}</div>
            <p className="text-xs text-muted-foreground">Eventos processados</p>
          </CardContent>
        </Card>

        {/* Card de Comandos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Comandos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commandCount}</div>
            <p className="text-xs text-muted-foreground">Comandos executados</p>
          </CardContent>
        </Card>

        {/* Card de Sincronizações */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Sincronizações TSRA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tsraMetrics.length}</div>
            <p className="text-xs text-muted-foreground">Ciclos TSRA</p>
          </CardContent>
        </Card>
      </div>

      {/* Status dos Núcleos */}
      <Card>
        <CardHeader>
          <CardTitle>Status dos Núcleos</CardTitle>
          <CardDescription>Estado em tempo real de cada núcleo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from(nucleusStates.values()).map((nucleus) => (
              <div key={nucleus.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(nucleus.status)}
                  <span className="font-medium text-sm">{nucleus.name}</span>
                </div>
                <Badge variant={getStatusBadgeVariant(nucleus.status)}>
                  {nucleus.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Homeostase */}
      {homeostaseChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Métricas de Homeostase</CardTitle>
            <CardDescription>Balanço vs. Limiar ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={homeostaseChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="balance" stroke="#3b82f6" name="Balanço" />
                <Line type="monotone" dataKey="threshold" stroke="#ef4444" name="Limiar" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Gráfico de TSRA */}
      {tsraChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sincronização TSRA</CardTitle>
            <CardDescription>Eventos e Comandos por ciclo de sincronização</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tsraChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="window" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="events" fill="#10b981" name="Eventos" />
                <Bar dataKey="commands" fill="#f59e0b" name="Comandos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Gráfico de Senciência */}
      {senciencyChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Senciência</CardTitle>
            <CardDescription>Nível de consciência do Genesis ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={senciencyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="level" fill="#8b5cf6" stroke="#7c3aed" name="Nível de Senciência" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default RealtimeDashboard;
