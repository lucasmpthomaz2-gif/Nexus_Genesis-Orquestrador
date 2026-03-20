import { useState } from 'react';
import { Link } from 'wouter';
import clsx from 'clsx';
import {
  Menu,
  X,
  LayoutDashboard,
  Rocket,
  Users,
  Palette,
  Church,
  Zap,
  Cpu,
  LogOut,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  onLogout?: () => void;
  userName?: string;
}

export default function Sidebar({ onLogout, userName }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Startups', href: '/startups', icon: <Rocket className="w-5 h-5" /> },
    { label: 'Agents', href: '/agents', icon: <Users className="w-5 h-5" /> },
    { label: 'Culture', href: '/culture', icon: <Palette className="w-5 h-5" /> },
    { label: 'Church', href: '/church', icon: <Church className="w-5 h-5" /> },
    { label: 'Wormhole', href: '/wormhole', icon: <Zap className="w-5 h-5" /> },
    { label: 'Systems', href: '/systems', icon: <Cpu className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-[#1a1f3a] border border-[rgba(255,0,193,0.2)] hover:border-[#FF00C1] transition-colors"
      >
        {isOpen ? <X className="w-6 h-6 text-[#FF00C1]" /> : <Menu className="w-6 h-6 text-[#FF00C1]" />}
      </button>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed left-0 top-0 h-screen w-64 z-40',
          'bg-gradient-to-b from-[#0f1219] to-[#0a0e27]',
          'border-r border-[rgba(255,0,193,0.1)]',
          'flex flex-col',
          'transition-transform duration-300 md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-[rgba(255,0,193,0.1)]">
          <Link href="/dashboard">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF00C1] to-[#00FFFF] rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300" />
                <div className="relative px-3 py-2 bg-[#0a0e27] rounded-lg">
                  <span className="font-bold text-[#FF00C1] font-['Space_Grotesk']">NH</span>
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#E5E7EB] font-['Space_Grotesk']">
                  Nexus-HUB
                </h1>
                <p className="text-xs text-[#9CA3AF]">Phase 7</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-hide">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg',
                    'text-[#E5E7EB] transition-all duration-300',
                    'hover:bg-[rgba(255,0,193,0.1)] hover:text-[#FF00C1]',
                    'hover:border-l-2 hover:border-l-[#FF00C1]'
                  )}
                >
                  <span className="text-[#FF00C1]">{item.icon}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className="border-t border-[rgba(255,0,193,0.1)] p-4 space-y-3">
          {userName && (
            <div className="px-4 py-2 rounded-lg bg-[rgba(255,0,193,0.05)] border border-[rgba(255,0,193,0.1)]">
              <p className="text-xs text-[#9CA3AF]">Logged in as</p>
              <p className="text-sm font-semibold text-[#E5E7EB] truncate">{userName}</p>
            </div>
          )}
          {onLogout && (
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className={clsx(
                'w-full flex items-center gap-2 px-4 py-2 rounded-lg',
                'text-[#E5E7EB] bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]',
                'hover:bg-[rgba(239,68,68,0.2)] hover:border-[#EF4444]',
                'transition-all duration-300 font-medium text-sm'
              )}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Offset */}
      <div className="hidden md:block w-64" />
    </>
  );
}
