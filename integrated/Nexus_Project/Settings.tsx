import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Settings as SettingsIcon, Bell, Palette, Zap, Download, RotateCcw } from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<"notifications" | "theme" | "simulator" | "data">("notifications");
  const [notificationSettings, setNotificationSettings] = useState({
    agentBirth: true,
    transaction: true,
    healthCritical: true,
    projectDeployed: true,
    postPublished: false,
    messageReceived: true,
    nftCreated: false,
    swarmEvent: true,
  });

  const [themeSettings, setThemeSettings] = useState({
    theme: "dark",
    accentColor: "pink",
    animationsEnabled: true,
  });

  const [simulatorSettings, setSimulatorSettings] = useState({
    enabled: true,
    interval: 30000,
    signalProbability: 0.8,
    postProbability: 0.3,
    transactionProbability: 0.2,
    nftProbability: 0.1,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-accent w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center gap-2 mb-2">
            <SettingsIcon className="w-5 h-5 text-accent neon-glow" />
            <h1 className="text-2xl font-bold neon-glow">Configurações</h1>
          </div>
          <p className="text-sm text-muted-foreground">Personalize sua experiência no NEXUS</p>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Tab Navigation */}
          <div className="lg:col-span-1">
            <Card className="card-neon p-4 space-y-2">
              {[
                { id: "notifications", label: "Notificações", icon: <Bell className="w-4 h-4" /> },
                { id: "theme", label: "Tema", icon: <Palette className="w-4 h-4" /> },
                { id: "simulator", label: "Simulador", icon: <Zap className="w-4 h-4" /> },
                { id: "data", label: "Dados", icon: <Download className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-accent/20 border-2 border-accent neon-glow"
                      : "border-2 border-border/30 hover:border-accent/50"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </Card>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3">
            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <Card className="card-neon p-6 space-y-4">
                <h2 className="text-lg font-bold neon-glow flex items-center gap-2">
                  <Bell className="w-5 h-5 text-accent" />
                  Preferências de Notificações
                </h2>

                <p className="text-sm text-muted-foreground">
                  Escolha quais eventos deseja receber notificações
                </p>

                <div className="space-y-3">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-3 p-3 border-2 border-border/30 rounded-lg hover:border-accent/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          setNotificationSettings({ ...notificationSettings, [key]: e.target.checked })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    </label>
                  ))}
                </div>

                <Button className="w-full btn-neon mt-4">Salvar Preferências</Button>
              </Card>
            )}

            {/* Theme Tab */}
            {activeTab === "theme" && (
              <Card className="card-neon p-6 space-y-4">
                <h2 className="text-lg font-bold neon-glow flex items-center gap-2">
                  <Palette className="w-5 h-5 text-accent" />
                  Preferências de Tema
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tema</label>
                    <select
                      value={themeSettings.theme}
                      onChange={(e) => setThemeSettings({ ...themeSettings, theme: e.target.value })}
                      className="w-full p-2 bg-background border-2 border-border/50 rounded-lg text-foreground"
                    >
                      <option value="dark">Escuro (Cyberpunk)</option>
                      <option value="light">Claro</option>
                      <option value="auto">Automático</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Cor de Destaque</label>
                    <div className="grid grid-cols-5 gap-2">
                      {["pink", "cyan", "green", "yellow", "purple"].map((color) => (
                        <button
                          key={color}
                          onClick={() => setThemeSettings({ ...themeSettings, accentColor: color })}
                          className={`p-3 rounded-lg border-2 capitalize text-xs font-bold ${
                            themeSettings.accentColor === color
                              ? `border-${color}-400 bg-${color}-400/20 neon-glow`
                              : "border-border/50 hover:border-accent/50"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center gap-3 p-3 border-2 border-border/30 rounded-lg hover:border-accent/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={themeSettings.animationsEnabled}
                      onChange={(e) =>
                        setThemeSettings({ ...themeSettings, animationsEnabled: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Ativar Animações</span>
                  </label>
                </div>

                <Button className="w-full btn-neon mt-4">Salvar Tema</Button>
              </Card>
            )}

            {/* Simulator Tab */}
            {activeTab === "simulator" && (
              <Card className="card-neon p-6 space-y-4">
                <h2 className="text-lg font-bold neon-glow flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  Configurações do Simulador
                </h2>

                <p className="text-sm text-muted-foreground">
                  Controle o comportamento autônomo dos agentes
                </p>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-3 border-2 border-border/30 rounded-lg hover:border-accent/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simulatorSettings.enabled}
                      onChange={(e) =>
                        setSimulatorSettings({ ...simulatorSettings, enabled: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Ativar Simulador</span>
                  </label>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Intervalo de Simulação: {simulatorSettings.interval}ms
                    </label>
                    <input
                      type="range"
                      min="5000"
                      max="60000"
                      step="5000"
                      value={simulatorSettings.interval}
                      onChange={(e) =>
                        setSimulatorSettings({ ...simulatorSettings, interval: parseInt(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Probabilidade de Sinais: {Math.round(simulatorSettings.signalProbability * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={simulatorSettings.signalProbability}
                      onChange={(e) =>
                        setSimulatorSettings({
                          ...simulatorSettings,
                          signalProbability: parseFloat(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Probabilidade de Posts: {Math.round(simulatorSettings.postProbability * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={simulatorSettings.postProbability}
                      onChange={(e) =>
                        setSimulatorSettings({
                          ...simulatorSettings,
                          postProbability: parseFloat(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                <Button className="w-full btn-neon mt-4">Salvar Configurações</Button>
              </Card>
            )}

            {/* Data Tab */}
            {activeTab === "data" && (
              <Card className="card-neon p-6 space-y-4">
                <h2 className="text-lg font-bold neon-glow flex items-center gap-2">
                  <Download className="w-5 h-5 text-accent" />
                  Gerenciamento de Dados
                </h2>

                <div className="space-y-3">
                  <Button className="w-full btn-neon flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Exportar Dados (JSON)
                  </Button>

                  <Button className="w-full btn-neon-cyan flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Exportar Agentes (CSV)
                  </Button>

                  <Button className="w-full btn-neon flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Exportar Transações (CSV)
                  </Button>

                  <Button className="w-full btn-neon flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Exportar NFTs (CSV)
                  </Button>
                </div>

                <div className="border-t border-border/50 pt-4 mt-4">
                  <h3 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Zona de Perigo
                  </h3>

                  <Button
                    className="w-full border-2 border-red-500/50 text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-2"
                    variant="outline"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Resetar Todos os Dados
                  </Button>

                  <p className="text-xs text-muted-foreground mt-2">
                    ⚠️ Esta ação é irreversível. Todos os agentes, transações e dados serão deletados.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
