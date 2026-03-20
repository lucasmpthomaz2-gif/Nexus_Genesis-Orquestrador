import DashboardLayout from '@/components/DashboardLayout';
import DashboardCard from '@/components/DashboardCard';
import { Rocket, TrendingUp, Users, Zap } from 'lucide-react';
import { useState } from 'react';

interface Startup {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'developing' | 'paused';
  team: number;
  progress: number;
  revenue?: number;
}

export default function Startups() {
  const [startups] = useState<Startup[]>([
    {
      id: '1',
      name: 'NexusFlow',
      description: 'Plataforma de automação de workflows com IA',
      status: 'active',
      team: 8,
      progress: 85,
      revenue: 125000,
    },
    {
      id: '2',
      name: 'CyberSync',
      description: 'Sistema de sincronização de dados em tempo real',
      status: 'active',
      team: 6,
      progress: 72,
      revenue: 89000,
    },
    {
      id: '3',
      name: 'QuantumVault',
      description: 'Solução de segurança quântica para dados',
      status: 'developing',
      team: 5,
      progress: 45,
    },
    {
      id: '4',
      name: 'NeuralBridge',
      description: 'Interface neural para interação humano-máquina',
      status: 'developing',
      team: 7,
      progress: 58,
    },
    {
      id: '5',
      name: 'EchoNet',
      description: 'Rede descentralizada de comunicação',
      status: 'active',
      team: 9,
      progress: 91,
      revenue: 156000,
    },
    {
      id: '6',
      name: 'PhantomAI',
      description: 'Motor de IA para análise preditiva',
      status: 'developing',
      team: 4,
      progress: 38,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'developing':
        return 'primary';
      case 'paused':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'developing':
        return 'Em Desenvolvimento';
      case 'paused':
        return 'Pausado';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#E5E7EB] font-['Space_Grotesk'] mb-2">
            Startups Digitais
          </h1>
          <p className="text-[#9CA3AF]">
            Gestão de projetos 100% digitais do ecossistema Nexus-HUB
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Total de Startups"
            value={startups.length}
            icon={Rocket}
            variant="primary"
          />
          <DashboardCard
            title="Ativas"
            value={startups.filter(s => s.status === 'active').length}
            icon={Zap}
            variant="success"
          />
          <DashboardCard
            title="Em Desenvolvimento"
            value={startups.filter(s => s.status === 'developing').length}
            icon={TrendingUp}
            variant="secondary"
          />
        </div>

        {/* Startups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((startup) => (
            <DashboardCard
              key={startup.id}
              title={startup.name}
              subtitle={startup.description}
              variant={getStatusColor(startup.status) as any}
              className="cursor-pointer hover:scale-105"
            >
              <div className="mt-6 space-y-4">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#9CA3AF] uppercase">
                    Status
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    startup.status === 'active'
                      ? 'bg-[rgba(16,185,129,0.2)] text-[#10B981]'
                      : 'bg-[rgba(255,0,193,0.2)] text-[#FF00C1]'
                  }`}>
                    {getStatusLabel(startup.status)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#9CA3AF]">Progresso</span>
                    <span className="text-xs font-semibold text-[#E5E7EB]">
                      {startup.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-[rgba(255,0,193,0.1)] rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#FF00C1] to-[#00FFFF] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${startup.progress}%` }}
                    />
                  </div>
                </div>

                {/* Team and Revenue */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[rgba(255,0,193,0.1)]">
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Time</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="w-4 h-4 text-[#00FFFF]" />
                      <span className="text-sm font-semibold text-[#E5E7EB]">
                        {startup.team}
                      </span>
                    </div>
                  </div>
                  {startup.revenue && (
                    <div>
                      <p className="text-xs text-[#9CA3AF]">Receita</p>
                      <p className="text-sm font-semibold text-[#10B981] mt-1">
                        ${(startup.revenue / 1000).toFixed(0)}K
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </DashboardCard>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
