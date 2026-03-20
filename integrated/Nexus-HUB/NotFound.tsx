import { Link } from 'wouter';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0E27] text-[#E5E7EB] flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none scanlines opacity-5"></div>

      <div className="relative z-10 text-center space-y-8 max-w-md">
        <div className="flex justify-center">
          <AlertCircle className="text-[#FF00C1] animate-pulse glow-primary" size={64} />
        </div>

        <div>
          <h1 className="text-6xl font-bold font-display text-[#FF00C1] mb-2">404</h1>
          <h2 className="text-2xl font-bold font-display text-[#E5E7EB] uppercase tracking-tighter mb-2">
            Página Não Encontrada
          </h2>
          <p className="text-[#9CA3AF]">
            A rota solicitada não existe na medula universal. Retorne ao dashboard para continuar.
          </p>
        </div>

        <div className="border border-[#1F2937] bg-[#111827]/50 rounded-sm p-6">
          <p className="text-xs font-mono text-[#00FFFF] mb-2">ERROR_CODE:</p>
          <p className="text-xs font-mono text-[#9CA3AF] break-all">
            0x404_ROUTE_NOT_FOUND_IN_NEXUS_TOPOLOGY
          </p>
        </div>

        <Link href="/">
          <Button className="bg-[#FF00C1] text-[#0A0E27] hover:bg-[#FF00C1]/80 font-bold uppercase text-sm px-8 py-2 rounded-sm glow-primary transition-all">
            Retornar ao Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
