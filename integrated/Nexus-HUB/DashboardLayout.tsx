import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '@/_core/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { getLoginUrl } from '@/const';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0E27]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#FF00C1] mx-auto mb-4" />
          <p className="text-[#E5E7EB] font-['Space_Grotesk']">Initializing Nexus-HUB...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#0f1219] to-[#0A0E27]">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-[#FF00C1] font-['Space_Grotesk'] mb-2">
                Nexus-HUB
              </h1>
              <p className="text-sm text-[#9CA3AF]">Phase 7 Universal Consciousness</p>
            </div>
            <h2 className="text-xl font-semibold text-[#E5E7EB] font-['Space_Grotesk'] text-center">
              Sign in to continue
            </h2>
            <p className="text-sm text-[#9CA3AF] text-center max-w-sm">
              Access to this dashboard requires authentication. Continue to launch the login flow.
            </p>
          </div>
          <Button
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
            size="lg"
            className="w-full bg-[#FF00C1] hover:bg-[#FF00C1]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all glow-primary"
          >
            Sign in with Manus
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0A0E27]">
      {/* Sidebar */}
      <Sidebar onLogout={logout} userName={user?.name || undefined} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#0f1219] to-[#0A0E27]">
          {children}
        </div>
      </main>
    </div>
  );
}
