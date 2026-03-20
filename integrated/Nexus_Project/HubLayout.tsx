import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Zap, 
  Wallet, 
  TrendingUp, 
  BookOpen, 
  Share2, 
  Shield,
  Menu,
  X,
  LogOut,
  Crown
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: <LayoutDashboard size={20} /> },
  { label: "Conselho", href: "/council", icon: <Crown size={20} /> },
  { label: "Startups", href: "/startups", icon: <Zap size={20} /> },
  { label: "Tesouraria", href: "/treasury", icon: <Wallet size={20} /> },
  { label: "Market Oracle", href: "/market", icon: <TrendingUp size={20} /> },
  { label: "Arbitragem", href: "/arbitrage", icon: <Share2 size={20} /> },
  { label: "Soul Vault", href: "/soul-vault", icon: <BookOpen size={20} /> },
  { label: "Moltbook", href: "/moltbook", icon: <Users size={20} /> },
  { label: "Auditoria", href: "/audit", icon: <Shield size={20} /> },
];

export default function HubLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Crown size={24} className="text-slate-950" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                NEXUS-HUB
              </h1>
              <p className="text-xs text-slate-500">Governança Descentralizada</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  location === item.href
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                {item.icon}
                <span className="hidden xl:inline">{item.label}</span>
              </a>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-slate-950 font-bold">
                  {user.name?.charAt(0) || "U"}
                </div>
                <span className="text-slate-300">{user.name}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              className="text-slate-400 hover:text-slate-200"
            >
              <LogOut size={18} />
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-slate-400 hover:text-slate-200"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-900">
            <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    location === item.href
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/50 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          <p>© 2026 NEXUS-HUB. Plataforma de Governança Descentralizada para Ecossistemas de IA.</p>
        </div>
      </footer>
    </div>
  );
}
