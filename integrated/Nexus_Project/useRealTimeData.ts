import { useEffect, useState } from "react";
import { useWebSocket } from "@/contexts/WebSocketContext";

export interface Agent {
  id: number;
  name: string;
  health: number;
  energy: number;
  reputation: number;
  specialization: string;
  status: "active" | "idle" | "offline";
  lastActivity: string;
}

export interface Metric {
  activeAgents: number;
  harmonyLevel: number;
  avgHealth: number;
  avgEnergy: number;
  marketSentiment: string;
  missionsCompleted: number;
  totalMissions: number;
  successRate: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  marketCap?: number;
  volume24h?: number;
  timestamp: string;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  progress: number;
  assignedAgent?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Alert {
  id: number;
  title: string;
  message: string;
  severity: "low" | "medium" | "high";
  createdAt: string;
  read: boolean;
}

/**
 * Hook para obter métricas em tempo real
 */
export function useRealTimeMetrics() {
  const { metrics, isConnected } = useWebSocket();
  const [data, setData] = useState<Metric | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (metrics) {
      setData(metrics);
      setLoading(false);
    }
  }, [metrics]);

  return { data, loading, isConnected };
}

/**
 * Hook para obter lista de agentes
 */
export function useRealTimeAgents() {
  const { agentsStatus, isConnected } = useWebSocket();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (agentsStatus?.agents) {
      setAgents(agentsStatus.agents);
      setLoading(false);
    }
  }, [agentsStatus]);

  return { agents, loading, isConnected };
}

/**
 * Hook para obter dados de mercado
 */
export function useRealTimeMarket() {
  const { marketData, isConnected } = useWebSocket();
  const [data, setData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (marketData) {
      setData(marketData);
      setLoading(false);
    }
  }, [marketData]);

  return { data, loading, isConnected };
}

/**
 * Hook para obter alertas
 */
export function useRealTimeAlerts() {
  const { alerts, isConnected } = useWebSocket();
  const [data, setData] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (alerts) {
      setData(alerts);
      setLoading(false);
    }
  }, [alerts]);

  return { data, loading, isConnected };
}

/**
 * Hook para dados simulados (fallback quando não há backend)
 */
export function useMockMetrics(): Metric {
  const [data, setData] = useState<Metric>({
    activeAgents: 12,
    harmonyLevel: 87,
    avgHealth: 92,
    avgEnergy: 78,
    marketSentiment: "altista",
    missionsCompleted: 156,
    totalMissions: 180,
    successRate: 86.7,
  });

  // Simular atualizações
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        harmonyLevel: Math.min(100, prev.harmonyLevel + (Math.random() - 0.5) * 5),
        avgHealth: Math.min(100, prev.avgHealth + (Math.random() - 0.5) * 3),
        avgEnergy: Math.min(100, prev.avgEnergy + (Math.random() - 0.5) * 4),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return data;
}

export function useMockAgents(): Agent[] {
  return [
    {
      id: 1,
      name: "Alpha-7",
      health: 95,
      energy: 88,
      reputation: 92,
      specialization: "Análise de Mercado",
      status: "active",
      lastActivity: "2 minutos atrás",
    },
    {
      id: 2,
      name: "Beta-3",
      health: 78,
      energy: 65,
      reputation: 85,
      specialization: "Execução de Trades",
      status: "active",
      lastActivity: "5 segundos atrás",
    },
    {
      id: 3,
      name: "Gamma-9",
      health: 88,
      energy: 92,
      reputation: 78,
      specialization: "Gerenciamento de Risco",
      status: "active",
      lastActivity: "1 minuto atrás",
    },
    {
      id: 4,
      name: "Delta-2",
      health: 45,
      energy: 32,
      reputation: 65,
      specialization: "Análise de Dados",
      status: "idle",
      lastActivity: "15 minutos atrás",
    },
  ];
}

export function useMockMarketData(): MarketData[] {
  return [
    {
      symbol: "BTC",
      price: 45230.5,
      change24h: 1250.75,
      changePercent24h: 2.84,
      marketCap: 890000000000,
      volume24h: 28500000000,
      timestamp: new Date().toISOString(),
    },
    {
      symbol: "ETH",
      price: 2450.25,
      change24h: -85.5,
      changePercent24h: -3.37,
      marketCap: 294000000000,
      volume24h: 15200000000,
      timestamp: new Date().toISOString(),
    },
    {
      symbol: "SOL",
      price: 98.75,
      change24h: 5.2,
      changePercent24h: 5.56,
      marketCap: 42000000000,
      volume24h: 2800000000,
      timestamp: new Date().toISOString(),
    },
  ];
}

export function useMockAlerts(): Alert[] {
  return [
    {
      id: 1,
      title: "Nível de Harmonia Crítico",
      message: "O nível de harmonia caiu para 45%. Ação recomendada.",
      severity: "high",
      createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
      read: false,
    },
    {
      id: 2,
      title: "Agente Offline",
      message: "O agente Alpha-7 está offline há 10 minutos.",
      severity: "medium",
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
      read: false,
    },
    {
      id: 3,
      title: "Missão Concluída",
      message: "A missão #156 foi concluída com sucesso.",
      severity: "low",
      createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
      read: true,
    },
  ];
}
