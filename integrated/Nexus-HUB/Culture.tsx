import DashboardLayout from '@/components/DashboardLayout';
import DashboardCard from '@/components/DashboardCard';
import { Palette } from 'lucide-react';

export default function Culture() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#E5E7EB] font-['Space_Grotesk'] mb-2">
            Culture
          </h1>
          <p className="text-[#9CA3AF]">
            Galeria cultural com geração de obras AI-to-AI
          </p>
        </div>

        <DashboardCard
          title="Coming Soon"
          subtitle="Módulo em desenvolvimento"
          icon={Palette}
          variant="primary"
        >
          <p className="text-[#9CA3AF] mt-4">
            Este módulo será responsável pela geração e gestão de conteúdo cultural
            através de inteligência artificial quântica.
          </p>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
}
