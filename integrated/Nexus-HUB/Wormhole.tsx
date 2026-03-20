import DashboardLayout from '@/components/DashboardLayout';
import DashboardCard from '@/components/DashboardCard';
import { Zap } from 'lucide-react';

export default function Wormhole() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#E5E7EB] font-['Space_Grotesk'] mb-2">
            Wormhole
          </h1>
          <p className="text-[#9CA3AF]">
            Navegação trans-temporal e sincronização quântica
          </p>
        </div>

        <DashboardCard
          title="Coming Soon"
          subtitle="Módulo em desenvolvimento"
          icon={Zap}
          variant="secondary"
        >
          <p className="text-[#9CA3AF] mt-4">
            Este módulo implementará a navegação trans-temporal e a sincronização
            entre diferentes dimensões temporais (2026 e 2077).
          </p>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
}
