import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  BarChart3,
  Heart,
  TrendingUp,
  Terminal,
  Zap,
  Home,
  Settings,
  LogOut,
  Search,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  action: () => void;
  group: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { logout } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation();

  const commands: CommandItem[] = [
    {
      id: "home",
      label: "Home",
      description: "Ir para a página inicial",
      icon: <Home className="h-4 w-4" />,
      group: "Navegação",
      action: () => {
        setLocation("/");
        setOpen(false);
      },
    },
    {
      id: "dashboard",
      label: "Dashboard",
      description: "Visão geral do ecossistema",
      icon: <BarChart3 className="h-4 w-4" />,
      group: "Navegação",
      action: () => {
        setLocation("/dashboard");
        setOpen(false);
      },
    },
    {
      id: "vitals",
      label: "Sinais Vitais",
      description: "Monitorar saúde dos agentes",
      icon: <Heart className="h-4 w-4" />,
      group: "Navegação",
      action: () => {
        setLocation("/vitals");
        setOpen(false);
      },
    },
    {
      id: "market",
      label: "Feed de Mercado",
      description: "Dados de criptomoedas em tempo real",
      icon: <TrendingUp className="h-4 w-4" />,
      group: "Navegação",
      action: () => {
        setLocation("/market");
        setOpen(false);
      },
    },
    {
      id: "terminal",
      label: "Terminal Gnox",
      description: "Interface de linguagem natural",
      icon: <Terminal className="h-4 w-4" />,
      group: "Navegação",
      action: () => {
        setLocation("/terminal");
        setOpen(false);
      },
    },
    {
      id: "orchestrator",
      label: "Orquestrador",
      description: "Gerenciamento de missões",
      icon: <Zap className="h-4 w-4" />,
      group: "Navegação",
      action: () => {
        setLocation("/orchestrator");
        setOpen(false);
      },
    },
    {
      id: "logout",
      label: "Sair",
      description: "Fazer logout da aplicação",
      icon: <LogOut className="h-4 w-4" />,
      group: "Conta",
      action: async () => {
        await logoutMutation.mutateAsync();
        logout();
        setOpen(false);
      },
    },
  ];

  const groups = Array.from(new Set(commands.map((cmd) => cmd.group)));

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Buscar comandos, páginas..."
          className="text-base"
        />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          {groups.map((group) => (
            <CommandGroup key={group} heading={group}>
              {commands
                .filter((cmd) => cmd.group === group)
                .map((cmd) => (
                  <CommandItem
                    key={cmd.id}
                    value={cmd.id}
                    onSelect={cmd.action}
                    className="cursor-pointer"
                  >
                    {cmd.icon && <span className="mr-2">{cmd.icon}</span>}
                    <div className="flex-1">
                      <div className="font-medium">{cmd.label}</div>
                      {cmd.description && (
                        <div className="text-xs text-muted-foreground">
                          {cmd.description}
                        </div>
                      )}
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>

      {/* Keyboard Hint */}
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-slate-600 transition-colors text-sm text-slate-400 hover:text-slate-300"
      >
        <Search className="h-4 w-4" />
        <span>Cmd+K</span>
      </button>
    </>
  );
}
