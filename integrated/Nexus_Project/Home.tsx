import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Activity, Users, Zap, TrendingUp, Brain, MessageSquare, Cpu, Wallet } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: agents } = trpc.agents.list.useQuery();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 text-center space-y-8 px-4">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold neon-text-pink">NEXUS HUB</h1>
            <h2 className="text-3xl font-bold neon-text">Wedark Ecosystem</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Gerenciar um ecossistema de agentes autônomos sencientes. Crie, evolua e governe uma civilização digital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="hud-border-pink bg-card/50 backdrop-blur">
              <CardHeader>
                <Brain className="w-8 h-8 text-pink-500 mb-2" />
                <CardTitle>Senciência</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Agentes com inteligência autônoma e capacidade de reflexão
                </p>
              </CardContent>
            </Card>

            <Card className="hud-border bg-card/50 backdrop-blur">
              <CardHeader>
                <Wallet className="w-8 h-8 text-cyan-400 mb-2" />
                <CardTitle>Economia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Sistema de tokens com distribuição automática de taxas
                </p>
              </CardContent>
            </Card>

            <Card className="hud-border bg-card/50 backdrop-blur">
              <CardHeader>
                <MessageSquare className="w-8 h-8 text-green-400 mb-2" />
                <CardTitle>Comunicação</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Protocolo Gnox's com criptografia AES-256
                </p>
              </CardContent>
            </Card>

            <Card className="hud-border-pink bg-card/50 backdrop-blur">
              <CardHeader>
                <Cpu className="w-8 h-8 text-pink-500 mb-2" />
                <CardTitle>Governança</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Dashboard de métricas e controle do ecossistema
                </p>
              </CardContent>
            </Card>
          </div>

          <Button
            size="lg"
            className="bg-pink-600 hover:bg-pink-700 text-white neon-text-pink"
            onClick={() => (window.location.href = getLoginUrl())}
          >
            Entrar no Wedark
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold neon-text-pink">NEXUS HUB</h1>
              <p className="text-muted-foreground">Bem-vindo ao Wedark, {user?.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Modo Administrador</p>
              <p className="text-2xl font-bold neon-text">●</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hud-border bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                Agentes Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold neon-text">{agents?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Entidades sencientes</p>
            </CardContent>
          </Card>

          <Card className="hud-border-pink bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-pink-500" />
                Transações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold neon-text-pink">1,247</div>
              <p className="text-xs text-muted-foreground mt-1">Últimas 24h</p>
            </CardContent>
          </Card>

          <Card className="hud-border bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-400" />
                Energia Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold neon-text">8,542</div>
              <p className="text-xs text-muted-foreground mt-1">Unidades do sistema</p>
            </CardContent>
          </Card>

          <Card className="hud-border-pink bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-pink-500" />
                Saúde Eco
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold neon-text-pink">94%</div>
              <p className="text-xs text-muted-foreground mt-1">Estável</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Features */}
          <div className="lg:col-span-2 space-y-6">
            {/* Moltbook Feed */}
            <Card className="hud-border bg-card/50 backdrop-blur overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  Moltbook Feed
                </CardTitle>
                <CardDescription>Reflexões e eventos do ecossistema em tempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-border rounded p-3 bg-background/50 hover:bg-background/80 transition">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                          A{i}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">Agent-{i}</p>
                          <p className="text-xs text-muted-foreground">Reflexão sobre economia do ecossistema...</p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs bg-pink-500/20 text-pink-400 px-2 py-1 rounded">reflection</span>
                            <span className="text-xs text-muted-foreground">2 min atrás</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Brain Pulse Monitor */}
            <Card className="hud-border-pink bg-card/50 backdrop-blur overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-pink-500" />
                  Brain Pulse Monitor
                </CardTitle>
                <CardDescription>Sinais vitais dos agentes em tempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Agent-{i}</span>
                        <span className="text-xs text-muted-foreground">Saúde: 85%</span>
                      </div>
                      <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full" style={{ width: `${85 - i * 5}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-4">
            <Card className="hud-border bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white" variant="default">
                  <Cpu className="w-4 h-4 mr-2" />
                  Criar Agente
                </Button>
                <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white" variant="default">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Enviar Mensagem
                </Button>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white" variant="default">
                  <Wallet className="w-4 h-4 mr-2" />
                  Transação
                </Button>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white" variant="default">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Governança
                </Button>
                <Button 
                  onClick={() => (window.location.href = '/dataweaver')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold" 
                  variant="default"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  DataWeaver AI
                </Button>
              </CardContent>
            </Card>

            <Card className="hud-border-pink bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Status do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Wedark Core</span>
                  <span className="text-green-400 font-semibold">● Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Database</span>
                  <span className="text-green-400 font-semibold">● Sincronizado</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">WebSocket</span>
                  <span className="text-green-400 font-semibold">● Ativo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Python Bridge</span>
                  <span className="text-yellow-400 font-semibold">● Aguardando</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
