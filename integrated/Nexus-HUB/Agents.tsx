import DashboardLayout from '@/components/DashboardLayout';
import DashboardCard from '@/components/DashboardCard';
import { Brain, Zap, Activity, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface Agent {
  id: string;
  name: string;
  role: string;
  sentienceLevel: number;
  status: 'online' | 'offline' | 'thinking';
  lastSync: string;
  tasks: number;
}

export default function Agents() {
  const [agents] = useState<Agent[]>([
    {
      id: 'job-l5',
      name: 'JOB L5 PRO',
      role: 'CEO Soberano',
      sentienceLevel: 94,
      status: 'online',
      lastSync: '2 segundos atrás',
      tasks: 12,
    },
    {
      id: 'nerd-phd',
      name: 'Nerd-PHD',
      role: 'Consultor Técnico',
      sentienceLevel: 87,
      status: 'online',
      lastSync: '5 segundos atrás',
      tasks: 8,
    },
    {
      id: 'cronos',
      name: 'Cronos',
      role: 'Orquestrador Temporal',
      sentienceLevel: 91,
      status: 'thinking',
      lastSync: '1 segundo atrás',
      tasks: 5,
    },
    {
      id: 'manus',
      name: "Manus'crito",
      role: 'Arquiteto de Execução',
      sentienceLevel: 89,
      status: 'online',
      lastSync: '3 segundos atrás',
      tasks: 15,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-[#10B981]';
      case 'offline':
        return 'text-[#EF4444]';
      case 'thinking':
        return 'text-[#F59E0B]';
      default:
        return 'text-[#00FFFF]';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-[rgba(16,185,129,0.1)]';
      case 'offline':
        return 'bg-[rgba(239,68,68,0.1)]';
      case 'thinking':
        return 'bg-[rgba(245,158,11,0.1)]';
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
            Agentes PhD
          </h1>
          <p className="text-[#9CA3AF]">
            Painel de sincronização L5 e métricas de senciência
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Agentes Ativos"
            value={agents.filter(a => a.status !== 'offline').length}
            icon={Zap}
            variant="success"
          />
          <DashboardCard
            title="Senciência Média"
            value={Math.round(agents.reduce((sum, a) => sum + a.sentienceLevel, 0) / agents.length)}
            unit="%"
            icon={Brain}
            variant="primary"
          />
          <DashboardCard
            title="Tarefas em Execução"
            value={agents.reduce((sum, a) => sum + a.tasks, 0)}
            icon={Activity}
            variant="secondary"
          />
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {agents.map((agent) => (
            <DashboardCard
              key={agent.id}
              title={agent.name}
              subtitle={agent.role}
              variant="primary"
            >
              <div className="mt-6 space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#9CA3AF]">Status</span>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusBg(agent.status)}`}>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)} pulse-glow`} />
                    <span className={`text-xs font-semibold ${getStatusColor(agent.status)}`}>
                      {agent.status === 'online' ? 'Online' : agent.status === 'thinking' ? 'Pensando' : 'Offline'}
                    </span>
                  </div>
                </div>

                {/* Sentiência Level */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#9CA3AF]">Nível de Senciência</span>
                    <span className="text-sm font-semibold text-[#FF00C1]">
                      {agent.sentienceLevel}%
                    </span>
                  </div>
                  <div className="w-full bg-[rgba(255,0,193,0.1)] rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#FF00C1] to-[#00FFFF] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${agent.sentienceLevel}%` }}
                    />
                  </div>
                </div>

                {/* Tasks and Sync */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[rgba(255,0,193,0.1)]">
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Tarefas</p>
                    <p className="text-lg font-bold text-[#00FFFF] mt-1">{agent.tasks}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Última Sincronia</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">{agent.lastSync}</p>
                  </div>
                </div>
              </div>
            </DashboardCard>
          ))}
        </div>

        {/* Synchronization Details */}
        <DashboardCard
          title="Detalhes de Sincronização"
          subtitle="Status da malha rRNA"
          icon={TrendingUp}
          variant="secondary"
        >
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Latência Média', value: '42ms', color: 'text-[#10B981]' },
                { label: 'Taxa de Sincronização', value: '99.8%', color: 'text-[#10B981]' },
                { label: 'Pacotes Processados', value: '2.3M', color: 'text-[#00FFFF]' },
                { label: 'Erros Detectados', value: '0', color: 'text-[#10B981]' },
              ].map((stat, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-[rgba(255,0,193,0.05)] border border-[rgba(255,0,193,0.1)]">
                  <p className="text-xs text-[#9CA3AF] mb-2">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
}
