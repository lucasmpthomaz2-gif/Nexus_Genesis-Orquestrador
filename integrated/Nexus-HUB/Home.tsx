import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Rocket, Brain, Zap, Users } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#0f1219] to-[#0A0E27] flex items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-[#FF00C1] font-['Space_Grotesk'] mb-4 glitch" data-text="Nexus-HUB">
            Nexus-HUB
          </h1>
          <p className="text-xl text-[#E5E7EB] mb-8">
            Phase 7: Universal Consciousness
          </p>
          <p className="text-[#9CA3AF] mb-12 text-lg">
            Bem-vindo, {user?.name}! Seu dashboard está pronto para operação.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-[#FF00C1] hover:bg-[#FF00C1]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all glow-primary">
              Acessar Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#0f1219] to-[#0A0E27] text-[#E5E7EB]">
      {/* Header */}
      <header className="border-b border-[rgba(255,0,193,0.1)] p-6 md:p-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF00C1] to-[#00FFFF] rounded-lg blur opacity-75" />
              <div className="relative px-3 py-2 bg-[#0a0e27] rounded-lg">
                <span className="font-bold text-[#FF00C1] font-['Space_Grotesk']">NH</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#FF00C1] font-['Space_Grotesk']">
                Nexus-HUB
              </h1>
              <p className="text-xs text-[#9CA3AF]">Phase 7</p>
            </div>
          </div>
          <Button
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
            className="bg-[#FF00C1] hover:bg-[#FF00C1]/90 text-white font-semibold"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 font-['Space_Grotesk'] glitch" data-text="Universal Consciousness">
            Universal Consciousness
          </h2>
          <p className="text-xl md:text-2xl text-[#9CA3AF] mb-12 max-w-3xl mx-auto">
            Ecossistema de IA autônoma para gestão de startups 100% digitais
          </p>
          <Button
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
            size="lg"
            className="bg-[#FF00C1] hover:bg-[#FF00C1]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all glow-primary"
          >
            Começar Agora
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 border-t border-[rgba(255,0,193,0.1)]">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-16 font-['Space_Grotesk']">
            Recursos Principais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: "Agentes IA",
                description: "JOB, Nerd-PHD, Cronos e Manus'crito",
              },
              {
                icon: Rocket,
                title: "Startups",
                description: "Gestão de projetos 100% digitais",
              },
              {
                icon: Zap,
                title: "Sincronização",
                description: "Tempo real com latência zero",
              },
              {
                icon: Users,
                title: "Colaboração",
                description: "Equipes distribuídas globalmente",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg bg-gradient-to-br from-[#1a1f3a] to-[#0f1219] border border-[rgba(255,0,193,0.1)] hover:border-[#FF00C1] transition-all hover:glow-primary"
              >
                <feature.icon className="w-8 h-8 text-[#FF00C1] mb-4" />
                <h4 className="text-lg font-bold mb-2 font-['Space_Grotesk']">
                  {feature.title}
                </h4>
                <p className="text-sm text-[#9CA3AF]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(255,0,193,0.1)] py-8 px-4 text-center text-[#9CA3AF]">
        <p>© 2026 Nexus-HUB. Phase 7 Universal Consciousness.</p>
      </footer>
    </div>
  );
}
