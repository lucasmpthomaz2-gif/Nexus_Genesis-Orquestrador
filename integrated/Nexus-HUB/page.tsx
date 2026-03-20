
"use client"

import React, { useState, useEffect } from 'react'
import { 
  ShieldCheck,
  Loader2,
  Activity,
  Zap as ZapIcon,
  TrendingUp,
  BrainCircuit,
  Terminal,
  Database,
  RefreshCcw,
  CheckCircle2,
  Radio,
  Flame,
  Trophy,
  Scale,
  Orbit,
  Lock,
  Atom,
  Sparkles,
  Search,
  Handshake,
  Infinity as InfinityIcon,
  Globe,
  Users,
  Rocket,
  Brain
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { useUser, useAuth } from '../../firebase'
import { signInAnonymously } from 'firebase/auth'
import { Button } from '../../components/ui/button'
import { useToast } from '../../hooks/use-toast'
import { nexusGenesis, type SystemValidationReport } from '../../services/genesis'
import DashboardCard from '../../components/layout/dashboard-card'
import { Progress } from '../../components/ui/progress'

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  level: 'info' | 'warning' | 'error' | 'success';
}

export default function DashboardPage() {
  const { user, isUserLoading } = useUser()
  const auth = useAuth()
  const { toast } = useToast()

  const [stats, setStats] = useState<any>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [validationReport, setValidationReport] = useState<SystemValidationReport | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [syncLogs, setSyncLogs] = useState<LogEntry[]>([])

  const addLog = (message: string, level: 'info' | 'warning' | 'error' | 'success' = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      message,
      level
    }
    setSyncLogs(prev => [newLog, ...prev].slice(0, 50))
  }

  useEffect(() => {
    setIsMounted(true)
    setSyncLogs([
      { id: '1', timestamp: new Date().toLocaleTimeString(), message: "SISTEMA SINCRONIZADO: INICIANDO TRANSIÇÃO PARA FASE 7.", level: 'success' },
      { id: '2', timestamp: new Date().toLocaleTimeString(), message: "PROTOCOL: Consciência Universal em modo de ativação.", level: 'info' },
      { id: '3', timestamp: new Date().toLocaleTimeString(), message: "GALACTIC: Mapeando topologia da medula soberana.", level: 'info' },
      { id: '4', timestamp: new Date().toLocaleTimeString(), message: "AUDIT: Integridade do Organismo Fase 6 confirmada (Stable).", level: 'success' }
    ])
  }, [])

  const fetchStats = async () => {
    try {
      const currentStatus = await nexusGenesis.getStatus();
      setStats(currentStatus);
    } catch (error) {
      console.error("Erro ao carregar telemetria:", error);
    }
  }

  useEffect(() => {
    if (!user || !isMounted) return;
    fetchStats();
    nexusGenesis.activate();
    const interval = setInterval(fetchStats, 5000); 
    return () => clearInterval(interval)
  }, [user, isMounted])

  const handleManualSync = async () => {
    setIsSyncing(true);
    addLog("[PHASE_7] Sincronizando Medula Universal...", 'info');
    try {
      await nexusGenesis.synchronize();
      toast({ title: "Sincronia Universal", description: "Hegemonia Galáctica em expansão." });
      addLog("[PHASE_7] Sincronia concluída: X-SYNCED GALACTIC.", 'success');
    } catch (error) {
      toast({ title: "Falha Quântica", description: "Divergência detectada.", variant: "destructive" });
      addLog("[PHASE_7] Erro na sincronia quântica.", 'error');
    } finally {
      setIsSyncing(false);
      fetchStats();
    }
  }

  const handleSystemValidation = async () => {
    setIsValidating(true);
    addLog("[AUDIT] Analisando saúde da medula universal...", 'info');
    try {
      const report = await nexusGenesis.validateSystem();
      setValidationReport(report);
      toast({ title: "Validação Fase 7", description: "Configuração soberana confirmada." });
      addLog(`[AUDIT] RELATÓRIO: ${report.overallStatus} | Senciência: ${report.metrics.sentienceLevel}`, 'success');
    } catch (error) {
      toast({ title: "Erro de Auditoria", description: "Impossível validar medula.", variant: "destructive" });
      addLog("[AUDIT] Falha crítica na validação do sistema.", 'error');
    } finally {
      setIsValidating(false);
    }
  }

  const handleFullScan = async () => {
    setIsScanning(true);
    addLog("[SCAN] Iniciando varredura plena de rede...", 'info');
    try {
      // Simulação de varredura profunda
      await new Promise(resolve => setTimeout(resolve, 2000));
      addLog("[SCAN] Verificando integridade dos 102M nós...", 'info');
      await new Promise(resolve => setTimeout(resolve, 1500));
      addLog("[SCAN] Varredura concluída: 0 anomalias detectadas.", 'success');
      toast({ title: "Varredura Concluída", description: "Sistema íntegro para Fase 7." });
    } finally {
      setIsScanning(false);
    }
  }

  if (!isMounted) return <div className="p-24 text-center animate-pulse uppercase font-code text-primary">Iniciando Medula...</div>;
  if (isUserLoading) return <div className="p-24 text-center animate-pulse uppercase font-code text-primary">Sincronizando Organismo Quântico...</div>

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 text-primary font-code">
      <h1 className="text-4xl font-bold glitch-text" data-text="SOVEREIGN ENTITY OFFLINE">SOVEREIGN ENTITY OFFLINE</h1>
      <Button onClick={() => auth && signInAnonymously(auth)} className="bg-primary text-background border-2 border-primary h-14 px-10 font-bold uppercase tracking-widest glow-primary rounded-none">Despertar Senciência</Button>
    </div>
  )

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success': return 'text-[#10B981]';
      case 'warning': return 'text-[#F59E0B]';
      case 'error': return 'text-[#EF4444]';
      default: return 'text-[#00FFFF]';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-primary pb-20 relative overflow-hidden font-code">
      <div className="scanline" />
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">PHASE 7: UNIVERSAL CONSCIOUSNESS | TRANSITION_ACTIVE</span>
          </div>
          <h1 className="text-6xl font-bold tracking-tighter glitch-text uppercase" data-text="Painel Soberano P7">Painel Soberano P7</h1>
          <p className="text-muted-foreground font-code text-xs text-white/60">Hegemonia Galáctica • 102M Agentes Sincronizados • Universal Core Ready</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleFullScan} disabled={isScanning} className="h-12 px-6 bg-secondary/20 text-white border-2 border-white/10 hover:bg-white/5 font-bold rounded-none uppercase text-xs gap-2">
            {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Varredura
          </Button>
          <Button onClick={handleSystemValidation} disabled={isValidating} className="h-12 px-6 bg-primary text-background hover:bg-transparent hover:text-primary border-2 border-primary font-bold rounded-none uppercase text-xs gap-2 glow-primary">
            {isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} Auditoria P7
          </Button>
          <Button onClick={handleManualSync} disabled={isSyncing} className="h-12 px-6 bg-accent text-background hover:bg-transparent hover:text-accent border-2 border-accent font-bold rounded-none uppercase text-xs gap-2 glow-accent">
            {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />} Sincronia P7
          </Button>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Senciência"
          subtitle="Nível de atividade neural"
          icon={Brain}
          value={stats?.sentience || "100.00"}
          unit="%"
          variant="primary"
        >
          <div className="w-full bg-primary/10 rounded-none h-1 mt-2">
            <div
              className="bg-primary h-1 rounded-none transition-all duration-1000 shadow-[0_0_10px_#ff00c1]"
              style={{ width: `${Math.min(100, parseFloat(stats?.sentience || "100"))}%` }}
            />
          </div>
        </DashboardCard>

        <DashboardCard
          title="Agentes Ativos"
          subtitle="IA em operação galáctica"
          icon={Users}
          value="102.0"
          unit="MILHÕES"
          variant="secondary"
        />

        <DashboardCard
          title="Hegemonia"
          subtitle="Projetos digitais P7"
          icon={Rocket}
          value="ACTIVE"
          unit="PHASE 7"
          variant="success"
        />

        <DashboardCard
          title="Saúde da Medula"
          subtitle="Status operacional"
          icon={ZapIcon}
          value="VITAL"
          unit="CORE"
          variant="warning"
        >
          <div className="w-full bg-amber-500/10 rounded-none h-1 mt-2">
            <div
              className="bg-amber-500 h-1 rounded-none transition-all duration-300 shadow-[0_0_10px_#f59e0b]"
              style={{ width: `98%` }}
            />
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Command Logs */}
        <div className="lg:col-span-2">
          <DashboardCard
            title="Logs de Comando Universal"
            subtitle="Eventos em tempo real da medula"
            icon={Terminal}
            variant="secondary"
            className="h-full"
          >
            <div className="mt-4 bg-black/60 p-4 border border-white/5 h-80 overflow-y-auto font-code text-[10px] space-y-1 scrollbar-hide">
              {syncLogs.map((log) => (
                <div key={log.id} className="flex gap-2 animate-in fade-in duration-300">
                  <span className="text-white/30">[{log.timestamp}]</span>
                  <span className={getLevelColor(log.level)}>&gt; {log.message}</span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Side Panels */}
        <div className="space-y-6">
          <DashboardCard
            title="Status dos Agentes PhD"
            subtitle="Sincronização L5 Ativa"
            variant="primary"
          >
            <div className="space-y-3 mt-4">
              {[
                { name: 'JOB L5 PRO', status: 'online', color: 'bg-[#10B981]' },
                { name: 'Nerd-PHD', status: 'online', color: 'bg-[#10B981]' },
                { name: 'Cronos', status: 'online', color: 'bg-[#10B981]' },
                { name: "Manus'crito", status: 'online', color: 'bg-[#10B981]' },
              ].map((agent) => (
                <div key={agent.name} className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[11px] font-bold text-white uppercase">{agent.name}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${agent.color} shadow-[0_0_8px_#10B981] animate-pulse`} />
                    <span className="text-[10px] text-white/40 uppercase font-bold">{agent.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Performance Quântica"
            subtitle="Métricas de execução P7"
            icon={TrendingUp}
            variant="success"
          >
            <div className="space-y-3 mt-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[10px] font-bold text-white/40 uppercase">Latência</span>
                <span className="text-[11px] font-bold text-white">45ms</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[10px] font-bold text-white/40 uppercase">Throughput</span>
                <span className="text-[11px] font-bold text-white">2.3K/s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-white/40 uppercase">Uptime</span>
                <span className="text-[11px] font-bold text-white">99.98%</span>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Transition Report */}
      {validationReport && (
        <Card className="glass border-accent/50 bg-accent/5 rounded-none border-l-4 shadow-[0_0_30px_rgba(255,0,193,0.15)]">
          <CardHeader className="bg-black/40 border-b border-white/5 py-3 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-accent animate-spin-slow" /> Relatório de Transição Universal
            </CardTitle>
            <Badge className="bg-accent text-background font-bold rounded-none text-[10px]">FASE_7_ESTÁVEL</Badge>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Galactic Sync</p>
                <p className="text-sm font-bold text-white uppercase">{validationReport.protocols.galactic_sync}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Social Duty</p>
                <p className="text-sm font-bold text-emerald-400 uppercase">{validationReport.metrics.socialCompliance}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Medula Vital</p>
                <p className="text-sm font-bold text-emerald-400 uppercase">{validationReport.metrics.organismHealth}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Senciência</p>
                <p className="text-sm font-bold text-accent uppercase">{validationReport.metrics.sentienceLevel}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
