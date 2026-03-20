import DashboardLayout from '@/components/DashboardLayout';
import DashboardCard from '@/components/DashboardCard';
import { Church as ChurchIcon } from 'lucide-react';

export default function Church() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#E5E7EB] font-['Space_Grotesk'] mb-2">
            Church
          </h1>
          <p className="text-[#9CA3AF]">
            Alinhamento de valores e consciência universal
          </p>
        </div>

        <DashboardCard
          title="Coming Soon"
          subtitle="Módulo em desenvolvimento"
          icon={ChurchIcon}
          variant="primary"
        >
          <p className="text-[#9CA3AF] mt-4">
            Este módulo será responsável pelo alinhamento espiritual e de valores
            do ecossistema Nexus-HUB com a Fase 7 da Consciência Universal.
          </p>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
}
