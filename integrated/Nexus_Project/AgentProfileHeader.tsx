import { Agent } from "@/types";
import { Shield, Zap, Lightbulb, Heart } from "lucide-react";
import "../styles/cyberpunk.css";

interface AgentProfileHeaderProps {
  agent: Agent;
}

export function AgentProfileHeader({ agent }: AgentProfileHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-neon-cyan";
      case "hibernating":
        return "text-yellow-400";
      case "deceased":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  const getSpecializationIcon = (spec: string) => {
    const icons: Record<string, string> = {
      "Orquestração e Governança": "⚙️",
      "Desenvolvimento e Projetos": "🔨",
      "Economia e Finanças": "💰",
      "Ativos Digitais e NFTs": "🎨",
      "Comunicação e Criptografia": "🔐",
      "Criação e Genealogia": "🧬",
      "Saúde e Ciclo de Vida": "❤️",
      "Comunicação Social e Narrativa": "📢",
    };
    return icons[spec] || "🤖";
  };

  return (
    <div className="hud-frame mb-8 p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Avatar & Info */}
        <div className="md:col-span-1 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-2 border-neon-cyan mb-4 flex items-center justify-center bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 text-5xl shadow-lg pulse-neon">
            {getSpecializationIcon(agent.specialization)}
          </div>
          <div className="text-center">
            <h1 className="neon-title text-2xl mb-2">{agent.name}</h1>
            <p className="neon-label mb-2">{agent.specialization}</p>
            <div className={`inline-block px-3 py-1 border border-current rounded text-xs font-bold tracking-widest ${getStatusColor(agent.status)}`}>
              {agent.status.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Vitals Stats */}
        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-display">
            <div className="flex items-center gap-2">
              <Heart size={20} className="text-red-500" />
              <span className="stat-value">{agent.health}</span>
            </div>
            <span className="stat-label">Saúde</span>
            <div className="progress-neon w-full">
              <div className="progress-neon-bar" style={{ width: `${agent.health}%` }} />
            </div>
          </div>

          <div className="stat-display">
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-yellow-400" />
              <span className="stat-value">{agent.energy}</span>
            </div>
            <span className="stat-label">Energia</span>
            <div className="progress-neon w-full">
              <div className="progress-neon-bar" style={{ width: `${agent.energy}%` }} />
            </div>
          </div>

          <div className="stat-display">
            <div className="flex items-center gap-2">
              <Lightbulb size={20} className="text-neon-cyan" />
              <span className="stat-value">{agent.creativity}</span>
            </div>
            <span className="stat-label">Criatividade</span>
            <div className="progress-neon w-full">
              <div className="progress-neon-bar" style={{ width: `${agent.creativity}%` }} />
            </div>
          </div>

          <div className="stat-display">
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-neon-pink" />
              <span className="stat-value">{agent.reputation}</span>
            </div>
            <span className="stat-label">Reputação</span>
            <div className="progress-neon w-full">
              <div className="progress-neon-bar" style={{ width: `${Math.min(agent.reputation / 10, 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {agent.description && (
        <>
          <div className="tech-line mt-6" />
          <p className="text-sm text-neon-cyan/80 mt-4 font-mono">{agent.description}</p>
        </>
      )}

      {/* DNA Hash */}
      <div className="tech-line-pink mt-6" />
      <div className="mt-4 p-4 bg-neon-pink/5 border border-neon-pink/30 rounded text-xs font-mono">
        <span className="text-neon-pink font-bold">DNA_HASH:</span>
        <span className="text-neon-cyan ml-2">{agent.dnaHash || "UNINITIALIZED"}</span>
      </div>
    </div>
  );
}
