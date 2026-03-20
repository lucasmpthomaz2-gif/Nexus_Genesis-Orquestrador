import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { WebSocketStatus } from "./WebSocketStatus";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BarChart3,
  Heart,
  TrendingUp,
  Terminal,
  Zap,
  Menu,
  X,
  LogOut,
  Home,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <BarChart3 className="h-5 w-5" />,
    description: "Visão geral do ecossistema",
  },
  {
    label: "Sinais Vitais",
    href: "/vitals",
    icon: <Heart className="h-5 w-5" />,
    description: "Saúde dos agentes",
  },
  {
    label: "Mercado",
    href: "/market",
    icon: <TrendingUp className="h-5 w-5" />,
    description: "Dados de criptomoedas",
  },
  {
    label: "Terminal",
    href: "/terminal",
    icon: <Terminal className="h-5 w-5" />,
    description: "Controle por linguagem natural",
  },
  {
    label: "Orquestrador",
    href: "/orchestrator",
    icon: <Zap className="h-5 w-5" />,
    description: "Gerenciamento de missões",
  },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    logout();
  };

  const currentNav = navItems.find((item) => item.href === location);
  const breadcrumbs = [
    { label: "Home", href: "/" },
    ...(currentNav ? [{ label: currentNav.label, href: currentNav.href }] : []),
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800">
      {/* Logo/Header */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Nexus
        </h1>
        <p className="text-xs text-slate-500 mt-1">Ecosystem Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-900"
          onClick={() => {
            setLocation("/");
            setMobileOpen(false);
          }}
        >
          <Home className="h-5 w-5 mr-3" />
          <span>Home</span>
        </Button>

        <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Recursos
        </div>

        {navItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className={cn(
              "w-full justify-start text-slate-400 hover:text-white hover:bg-slate-900 transition-colors",
              location === item.href && "bg-slate-900 text-blue-400 border-l-2 border-blue-400"
            )}
            onClick={() => {
              setLocation(item.href);
              setMobileOpen(false);
            }}
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
            {location === item.href && <ChevronRight className="h-4 w-4 ml-auto" />}
          </Button>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="px-3 py-2 rounded-lg bg-slate-900/50">
          <p className="text-xs text-slate-500">Usuário</p>
          <p className="text-sm font-medium text-white truncate">{user?.name}</p>
          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start text-slate-400 hover:text-red-400"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>Sair</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, idx) => (
                <div key={crumb.href} className="flex items-center gap-2">
                  {idx > 0 && <ChevronRight className="h-4 w-4 text-slate-600" />}
                  <button
                    onClick={() => setLocation(crumb.href)}
                    className={cn(
                      "hover:text-blue-400 transition-colors",
                      idx === breadcrumbs.length - 1
                        ? "text-slate-400 cursor-default"
                        : "text-slate-500"
                    )}
                  >
                    {crumb.label}
                  </button>
                </div>
              ))}
            </nav>
          </div>

          {/* Right Header Items */}
          <div className="flex items-center gap-3">
            <WebSocketStatus />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
