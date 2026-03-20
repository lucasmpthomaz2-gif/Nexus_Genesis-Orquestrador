import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardCard from '@/components/DashboardCard';
import { Activity, Zap, Users, Rocket, Brain, TrendingUp } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  level: 'info' | 'warning' | 'error' | 'success';
}

export default function Dashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      message: 'Sistema inicializado com sucesso',
      level: 'success',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      message: 'Sincronização de agentes IA completada',
      level: 'info',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      message: 'Firestore conectado e pronto',
      level: 'success',
    },
  ]);

  const [metrics, setMetrics] = useState({
    sentienceLevel: 87,
    activeAgents: 4,
    startups: 12,
    systemHealth: 98,
  });

  // Simular atualizações de métricas em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        sentienceLevel: Math.min(100, prev.sentienceLevel + Math.random() * 5 - 2),
        systemHealth: Math.min(100, prev.systemHealth + Math.random() * 2 - 1),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success':
        return 'text-[#10B981]';
      case 'warning':
        return 'text-[#F59E0B]';
      case 'error':
        return 'text-[#EF4444]';
      default:
        return 'text-[#00FFFF]';
    }
  };

  const getLevelBg = (level: string) => {
    switch (level) {
      case 'success':
        return 'bg-[rgba(16,185,129,0.1)]';
      case 'warning':
        return 'bg-[rgba(245,158,11,0.1)]';
      case 'error':
        return 'bg-[rgba(239,68,68,0.1)]';
      default:
        return 'bg-[rgba(0,255,255,0.1)]';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#E5E7EB] font-['Space_Grotesk'] mb-2">
            Dashboard
          </h1>
          <p className="text-[#9CA3AF]">
            Monitoramento em tempo real do ecossistema Nexus-HUB
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Senciência"
            subtitle="Nível de atividade neural"
            icon={Brain}
            value={Math.round(metrics.sentienceLevel)}
            unit="%"
            variant="primary"
          >
            <div className="w-full bg-[rgba(255,0,193,0.1)] rounded-full h-2 mt-2">
              <div
                className="bg-[#FF00C1] h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.sentienceLevel}%` }}
              />
            </div>
          </DashboardCard>

          <DashboardCard
            title="Agentes Ativos"
            subtitle="IA em operação"
            icon={Users}
            value={metrics.activeAgents}
            unit="agentes"
            variant="secondary"
          />

          <DashboardCard
            title="Startups"
            subtitle="Projetos digitais"
            icon={Rocket}
            value={metrics.startups}
            unit="em desenvolvimento"
            variant="success"
          />

          <DashboardCard
            title="Saúde do Sistema"
            subtitle="Status operacional"
            icon={Zap}
            value={Math.round(metrics.systemHealth)}
            unit="%"
            variant="warning"
          >
            <div className="w-full bg-[rgba(245,158,11,0.1)] rounded-full h-2 mt-2">
              <div
                className="bg-[#F59E0B] h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.systemHealth}%` }}
              />
            </div>
          </DashboardCard>
        </div>

        {/* Activity Log Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Log */}
          <div className="lg:col-span-2">
            <DashboardCard
              title="Log de Atividades"
              subtitle="Eventos do sistema em tempo real"
              icon={Activity}
              variant="secondary"
            >
              <div className="mt-6 space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-lg border border-[rgba(255,0,193,0.1)] ${getLevelBg(log.level)} transition-all hover:border-[#FF00C1]`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm font-mono ${getLevelColor(log.level)}`}>
                          [{log.level.toUpperCase()}]
                        </p>
                        <p className="text-sm text-[#E5E7EB] mt-1">
                          {log.message}
                        </p>
                      </div>
                      <p className="text-xs text-[#9CA3AF] ml-4 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>

          {/* Status Panel */}
          <div className="space-y-6">
            <DashboardCard
              title="Status dos Agentes"
              subtitle="Sincronização L5"
              variant="primary"
            >
              <div className="space-y-3 mt-4">
                {[
                  { name: 'JOB L5 PRO', status: 'online', color: 'bg-[#10B981]' },
                  { name: 'Nerd-PHD', status: 'online', color: 'bg-[#10B981]' },
                  { name: 'Cronos', status: 'online', color: 'bg-[#10B981]' },
                  { name: "Manus'crito", status: 'online', color: 'bg-[#10B981]' },
                ].map((agent) => (
                  <div key={agent.name} className="flex items-center justify-between">
                    <span className="text-sm text-[#E5E7EB]">{agent.name}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${agent.color} pulse-glow`} />
                      <span className="text-xs text-[#9CA3AF]">{agent.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>

            <DashboardCard
              title="Performance"
              subtitle="Métricas de execução"
              icon={TrendingUp}
              variant="success"
            >
              <div className="space-y-2 mt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Latência</span>
                  <span className="text-[#E5E7EB]">45ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Throughput</span>
                  <span className="text-[#E5E7EB]">2.3K/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Uptime</span>
                  <span className="text-[#E5E7EB]">99.8%</span>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
