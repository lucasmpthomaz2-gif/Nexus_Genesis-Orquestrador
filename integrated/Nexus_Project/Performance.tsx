import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Loader2,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  Clock,
  Gauge,
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PerformanceMetric {
  timestamp: string;
  latency: number;
  throughput: number;
  errorRate: number;
  uptime: number;
}

export default function Performance() {
  const { user, loading: authLoading } = useAuth();
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock performance data
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    { timestamp: "00:00", latency: 45, throughput: 850, errorRate: 0.2, uptime: 99.9 },
    { timestamp: "04:00", latency: 52, throughput: 920, errorRate: 0.3, uptime: 99.8 },
    { timestamp: "08:00", latency: 38, throughput: 1200, errorRate: 0.1, uptime: 99.95 },
    { timestamp: "12:00", latency: 61, throughput: 1450, errorRate: 0.5, uptime: 99.7 },
    { timestamp: "16:00", latency: 48, throughput: 1100, errorRate: 0.2, uptime: 99.9 },
    { timestamp: "20:00", latency: 55, throughput: 950, errorRate: 0.4, uptime: 99.85 },
    { timestamp: "23:59", latency: 42, throughput: 800, errorRate: 0.1, uptime: 99.95 },
  ]);

  const [currentMetrics, setCurrentMetrics] = useState({
    latency: 42,
    throughput: 800,
    errorRate: 0.1,
    uptime: 99.95,
    requestsPerSecond: 125,
    activeConnections: 342,
    databaseLatency: 15,
    cacheHitRate: 87.5,
  });

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simulate metric updates
      setCurrentMetrics((prev) => ({
        latency: Math.max(30, prev.latency + (Math.random() - 0.5) * 20),
        throughput: Math.max(500, prev.throughput + (Math.random() - 0.5) * 200),
        errorRate: Math.max(0, prev.errorRate + (Math.random() - 0.5) * 0.3),
        uptime: Math.min(99.99, prev.uptime + (Math.random() - 0.5) * 0.1),
        requestsPerSecond: Math.max(50, prev.requestsPerSecond + (Math.random() - 0.5) * 50),
        activeConnections: Math.max(100, prev.activeConnections + Math.floor((Math.random() - 0.5) * 100)),
        databaseLatency: Math.max(5, prev.databaseLatency + (Math.random() - 0.5) * 10),
        cacheHitRate: Math.min(99, Math.max(70, prev.cacheHitRate + (Math.random() - 0.5) * 5)),
      }));
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const getStatusColor = (value: number, type: string) => {
    if (type === "uptime") {
      return value >= 99.9 ? "text-green-400" : value >= 99 ? "text-yellow-400" : "text-red-400";
    }
    if (type === "errorRate") {
      return value < 0.5 ? "text-green-400" : value < 1 ? "text-yellow-400" : "text-red-400";
    }
    if (type === "latency") {
      return value < 50 ? "text-green-400" : value < 100 ? "text-yellow-400" : "text-red-400";
    }
    return "text-accent";
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-accent w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent neon-glow" />
              <h1 className="text-2xl font-bold neon-glow">Performance Monitor</h1>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                className="px-3 py-2 bg-background border border-border rounded text-foreground text-sm"
              >
                <option value={1000}>1s</option>
                <option value={5000}>5s</option>
                <option value={10000}>10s</option>
                <option value={30000}>30s</option>
              </select>
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? "btn-neon" : ""}
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
              >
                {autoRefresh ? "Auto" : "Manual"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Current Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="card-neon p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Latency</p>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <p className={`text-2xl font-bold ${getStatusColor(currentMetrics.latency, "latency")}`}>
              {currentMetrics.latency.toFixed(1)}ms
            </p>
            <p className="text-xs text-muted-foreground mt-2">Response time</p>
          </Card>

          <Card className="card-neon p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Throughput</p>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">
              {(currentMetrics.throughput / 1000).toFixed(1)}K
            </p>
            <p className="text-xs text-muted-foreground mt-2">Requests/min</p>
          </Card>

          <Card className="card-neon p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Error Rate</p>
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
            </div>
            <p className={`text-2xl font-bold ${getStatusColor(currentMetrics.errorRate, "errorRate")}`}>
              {currentMetrics.errorRate.toFixed(2)}%
            </p>
            <p className="text-xs text-muted-foreground mt-2">Failed requests</p>
          </Card>

          <Card className="card-neon p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Uptime</p>
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <p className={`text-2xl font-bold ${getStatusColor(currentMetrics.uptime, "uptime")}`}>
              {currentMetrics.uptime.toFixed(2)}%
            </p>
            <p className="text-xs text-muted-foreground mt-2">System availability</p>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="card-neon p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">RPS</p>
              <Zap className="w-4 h-4 text-accent" />
            </div>
            <p className="text-2xl font-bold neon-glow">{currentMetrics.requestsPerSecond.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground mt-2">Requests/second</p>
          </Card>

          <Card className="card-neon p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Connections</p>
              <Gauge className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-cyan-400">{currentMetrics.activeConnections}</p>
            <p className="text-xs text-muted-foreground mt-2">Active connections</p>
          </Card>

          <Card className="card-neon p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">DB Latency</p>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-purple-400">{currentMetrics.databaseLatency.toFixed(1)}ms</p>
            <p className="text-xs text-muted-foreground mt-2">Database response</p>
          </Card>

          <Card className="card-neon p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Cache Hit</p>
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">{currentMetrics.cacheHitRate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-2">Cache efficiency</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <Card className="card-neon p-6">
            <h3 className="font-bold neon-glow mb-4">Latency & Throughput Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="timestamp" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "1px solid #FF006E",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke="#00D9FF"
                  dot={false}
                  name="Latency (ms)"
                />
                <Line
                  type="monotone"
                  dataKey="throughput"
                  stroke="#FF006E"
                  dot={false}
                  name="Throughput"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="card-neon p-6">
            <h3 className="font-bold neon-glow mb-4">Error Rate & Uptime</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="timestamp" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "1px solid #FF006E",
                  }}
                />
                <Legend />
                <Bar dataKey="errorRate" fill="#FF006E" name="Error Rate (%)" />
                <Bar dataKey="uptime" fill="#00D9FF" name="Uptime (%)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Alerts */}
        <Card className="card-neon p-6">
          <h3 className="font-bold neon-glow mb-4">Performance Alerts</h3>
          <div className="space-y-2">
            {currentMetrics.latency > 100 && (
              <div className="flex items-center gap-3 p-3 bg-red-400/10 border border-red-400/50 rounded">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm">High latency detected: {currentMetrics.latency.toFixed(1)}ms</p>
              </div>
            )}
            {currentMetrics.errorRate > 1 && (
              <div className="flex items-center gap-3 p-3 bg-red-400/10 border border-red-400/50 rounded">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm">High error rate: {currentMetrics.errorRate.toFixed(2)}%</p>
              </div>
            )}
            {currentMetrics.uptime < 99.5 && (
              <div className="flex items-center gap-3 p-3 bg-yellow-400/10 border border-yellow-400/50 rounded">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <p className="text-sm">Uptime below 99.5%: {currentMetrics.uptime.toFixed(2)}%</p>
              </div>
            )}
            {currentMetrics.latency <= 100 && currentMetrics.errorRate <= 1 && currentMetrics.uptime >= 99.5 && (
              <div className="flex items-center gap-3 p-3 bg-green-400/10 border border-green-400/50 rounded">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-sm">All systems operating normally</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
