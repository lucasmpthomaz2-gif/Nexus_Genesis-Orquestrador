import DashboardLayout from '@/components/DashboardLayout';
import DashboardCard from '@/components/DashboardCard';
import { Cpu } from 'lucide-react';

export default function Systems() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#E5E7EB] font-['Space_Grotesk'] mb-2">
            Systems
          </h1>
          <p className="text-[#9CA3AF]">
            Visão geral de sistemas e infraestrutura
          </p>
        </div>

        <DashboardCard
          title="Coming Soon"
          subtitle="Módulo em desenvolvimento"
          icon={Cpu}
          variant="success"
        >
          <p className="text-[#9CA3AF] mt-4">
            Este módulo fornecerá uma visão geral completa de todos os sistemas
            e componentes da infraestrutura Nexus-HUB.
          </p>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
}
