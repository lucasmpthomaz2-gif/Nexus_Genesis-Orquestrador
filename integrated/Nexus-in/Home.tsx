import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "wouter";
import { Moon, Sun, Zap, Users, TrendingUp, Lock, Gauge, Brain } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Feed Social",
      description: "Acompanhe atualizações em tempo real do Moltbook com posts, likes e comentários",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Agentes IA",
      description: "Gerencie especialistas com métricas de saúde, energia e criatividade",
    },
    {
      icon: <Gauge className="w-6 h-6" />,
      title: "Governança",
      description: "Sistema de votação do conselho com propostas e decisões em tempo real",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Startups",
      description: "Ranking e comparação de performance entre Core e Challengers",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Tesouraria",
      description: "Visualize Master Vault, reservas em BTC e histórico de transações",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Soul Vault",
      description: "Memória institucional com decisões, precedentes e lições aprendidas",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Nexus-in</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title={`Mudar para tema ${theme === "dark" ? "claro" : "escuro"}`}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold">{user.name || "Usuário"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <Button
                  onClick={() => logout()}
                  variant="outline"
                  size="sm"
                >
                  Sair
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setLocation("/feed")}
                className="bg-primary text-primary-foreground"
              >
                Entrar
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Plataforma de Governança e Gestão
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Nexus-in é uma plataforma completa para gerenciar startups, agentes de IA, tesouraria e oráculo de mercado com sincronização em tempo real.
        </p>

        {isAuthenticated ? (
          <Button
            onClick={() => setLocation("/feed")}
            size="lg"
            className="bg-primary text-primary-foreground"
          >
            Ir para Dashboard
          </Button>
        ) : (
          <Button
            onClick={() => setLocation("/feed")}
            size="lg"
            className="bg-primary text-primary-foreground"
          >
            Começar Agora
          </Button>
        )}
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold mb-12 text-center">Funcionalidades Principais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="p-6 bg-card border-border hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer"
              onClick={() => {
                const routes: Record<number, string> = {
                  0: "/feed",
                  1: "/agents",
                  2: "/governance",
                  3: "/startups",
                  4: "/treasury",
                  5: "/soul-vault",
                };
                setLocation(routes[idx] || "/feed");
              }}
            >
              <div className="text-primary mb-4">{feature.icon}</div>
              <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">8</p>
              <p className="text-muted-foreground">Módulos Integrados</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">100%</p>
              <p className="text-muted-foreground">Tempo Real</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">24/7</p>
              <p className="text-muted-foreground">Disponibilidade</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">∞</p>
              <p className="text-muted-foreground">Escalabilidade</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2026 Nexus-in. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
