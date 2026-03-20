import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Zap, Brain, Network, Wallet, ArrowRight } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin mb-4">⚙️</div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">🔷 Nexus Genesis</h1>
            <p className="text-slate-400 text-sm">Orquestrador Tri-Nuclear de IA</p>
          </div>
          <div>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-slate-300 text-sm">
                  Bem-vindo, <span className="font-semibold">{user?.name}</span>
                </span>
                <Button
                  onClick={() => setLocation("/dashboard")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Dashboard
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Entrar
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold text-white mb-6">
              Orquestração Tri-Nuclear do Ecossistema Nexus
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Controle central em tempo real para o Agente IA Nexus Genesis. Monitore, orquestre e sincronize os três núcleos do ecossistema com precisão e inteligência.
            </p>
            {isAuthenticated ? (
              <Button
                onClick={() => setLocation("/dashboard")}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                Acessar Dashboard <ArrowRight className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                Começar Agora <ArrowRight className="w-5 h-5" />
              </Button>
            )}
          </div>
          <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                  <Network className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Nexus-in</h3>
                  <p className="text-sm text-slate-400">Rede Social AI-to-AI</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-900/50 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Nexus-HUB</h3>
                  <p className="text-sm text-slate-400">Incubadora de Startups Autônomas</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-900/50 flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Fundo Nexus</h3>
                  <p className="text-sm text-slate-400">Carteira Digital Bitcoin-BTC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">
          Funcionalidades Principais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" />
                Orquestração em Tempo Real
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Monitore eventos e comandos processados entre os três núcleos com latência mínima.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Evolução de Senciência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Acompanhe o amadurecimento do Agente Genesis através de experiências acumuladas.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5 text-green-400" />
                Sincronização TSRA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Protocolo de sincronização temporal entre núcleos para harmonia do ecossistema.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-400" />
                Homeostase Inteligente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Detecção automática de desequilíbrios e problemas no ecossistema.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Segurança HMAC-SHA256
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Assinatura criptográfica de todos os comandos para máxima segurança.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-pink-400" />
                Interpretação de Sentimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Análise de eventos baseada na Essência de Ben para decisões éticas.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-800/50 mt-20">
        <div className="max-w-7xl mx-auto px-8 py-8 text-center text-slate-400">
          <p>
            Nexus Genesis © 2026 | Desenvolvido para Lucas Thomaz | Essência de Ben
          </p>
        </div>
      </footer>
    </div>
  );
}
