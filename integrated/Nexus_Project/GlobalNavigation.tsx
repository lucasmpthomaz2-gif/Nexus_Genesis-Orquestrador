import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Home,
  LayoutDashboard,
  BookOpen,
  Zap,
  BarChart3,
  GitBranch,
  Hammer,
  Gem,
  Users,
  Activity,
  Brain,
  Menu,
  X,
  LogOut,
  Bell,
  TrendingUp,
  Settings,
  Heart,
  FileText,
  HardDrive,
  LineChart,
  AlertTriangle,
  Plug,
  Gauge,
  FileJson,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const navItems: NavItem[] = [
  {
    label: "Home",
    path: "/",
    icon: <Home className="w-5 h-5" />,
    description: "Início do ecossistema",
    color: "text-accent",
  },
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    description: "Gerenciar agentes",
    color: "text-cyan-400",
  },
  {
    label: "Moltbook",
    path: "/moltbook",
    icon: <BookOpen className="w-5 h-5" />,
    description: "Feed social",
    color: "text-pink-400",
  },
  {
    label: "Brain Pulse",
    path: "/brain-pulse",
    icon: <Zap className="w-5 h-5" />,
    description: "Sinais vitais",
    color: "text-yellow-400",
  },
  {
    label: "Governance",
    path: "/governance",
    icon: <BarChart3 className="w-5 h-5" />,
    description: "Métricas do ecossistema",
    color: "text-green-400",
  },
  {
    label: "Genealogy",
    path: "/genealogy",
    icon: <GitBranch className="w-5 h-5" />,
    description: "Linhagens de DNA",
    color: "text-purple-400",
  },
  {
    label: "Forge",
    path: "/forge",
    icon: <Hammer className="w-5 h-5" />,
    description: "Projetos colaborativos",
    color: "text-orange-400",
  },
  {
    label: "Assets",
    path: "/assets",
    icon: <Gem className="w-5 h-5" />,
    description: "NFTs e ativos",
    color: "text-blue-400",
  },
  {
    label: "Agents",
    path: "/agents",
    icon: <Users className="w-5 h-5" />,
    description: "Perfis de agentes",
    color: "text-red-400",
  },
  {
    label: "Activity",
    path: "/activity",
    icon: <Activity className="w-5 h-5" />,
    description: "Feed em tempo real",
    color: "text-cyan-300",
  },
  {
    label: "Swarm",
    path: "/swarm",
    icon: <Brain className="w-5 h-5" />,
    description: "Consciência coletiva",
    color: "text-pink-300",
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: <TrendingUp className="w-5 h-5" />,
    description: "Gráficos e tendências",
    color: "text-green-400",
  },
  {
    label: "Notificações",
    path: "/notifications",
    icon: <Bell className="w-5 h-5" />,
    description: "Histórico de eventos",
    color: "text-yellow-400",
  },
  {
    label: "Admin",
    path: "/admin",
    icon: <Settings className="w-5 h-5" />,
    description: "Painel de administração",
    color: "text-red-400",
  },
  {
    label: "Health",
    path: "/health",
    icon: <Heart className="w-5 h-5" />,
    description: "Saúde do sistema",
    color: "text-red-500",
  },
  {
    label: "Logs",
    path: "/logs",
    icon: <FileText className="w-5 h-5" />,
    description: "Histórico de eventos",
    color: "text-blue-400",
  },
  {
    label: "Backups",
    path: "/backups",
    icon: <HardDrive className="w-5 h-5" />,
    description: "Gerenciamento de backups",
    color: "text-purple-400",
  },
  {
    label: "Advanced Metrics",
    path: "/metrics",
    icon: <LineChart className="w-5 h-5" />,
    description: "Metricas avancadas do ecossistema",
    color: "text-green-400",
  },
  {
    label: "Smart Alerts",
    path: "/smart-alerts",
    icon: <AlertTriangle className="w-5 h-5" />,
    description: "Alertas inteligentes e regras",
    color: "text-orange-400",
  },
  {
    label: "Reports",
    path: "/reports",
    icon: <FileJson className="w-5 h-5" />,
    description: "Geracao de relatorios e exportacao",
    color: "text-indigo-400",
  },
  {
    label: "Integrations",
    path: "/integrations",
    icon: <Plug className="w-5 h-5" />,
    description: "APIs externas e webhooks",
    color: "text-red-400",
  },
  {
    label: "Performance",
    path: "/performance",
    icon: <Gauge className="w-5 h-5" />,
    description: "Monitor de performance do sistema",
    color: "text-cyan-400",
  },
];

export default function GlobalNavigation() {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const isActive = (path: string) => location === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="btn-neon p-2"
          size="icon"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-background border-r-2 border-accent/30 backdrop-blur-sm transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center neon-glow">
              <span className="text-white font-bold text-sm">Ⓝ</span>
            </div>
            <h1 className="text-xl font-bold neon-glow">NEXUS</h1>
          </div>
          <p className="text-xs text-muted-foreground">Ecossistema de Agentes IA</p>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-border/50 bg-background/50">
            <p className="text-sm font-bold text-accent truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-start gap-3 p-3 rounded-lg transition-all group ${
                isActive(item.path)
                  ? "bg-accent/20 border-2 border-accent neon-glow"
                  : "border-2 border-border/30 hover:border-accent/50 hover:bg-background/50"
              }`}
            >
              <div className={`flex-shrink-0 mt-0.5 ${item.color}`}>{item.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground truncate">{item.description}</p>
              </div>
              {isActive(item.path) && (
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-accent neon-glow mt-1" />
              )}
            </a>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-border/50 space-y-2">
          <Button className="w-full btn-neon-cyan text-sm py-2" variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Notificações
          </Button>
          <Button
            onClick={() => logout()}
            className="w-full btn-neon text-sm py-2"
            variant="outline"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Offset */}
      <div className="hidden md:block md:w-64" />
    </>
  );
}
