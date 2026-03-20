import { Reputation, Badge } from "@/types";
import { Trophy, Award, Star } from "lucide-react";

interface ReputationSystemProps {
  reputation?: Reputation;
  badges: Badge[];
}

export function ReputationSystem({ reputation, badges }: ReputationSystemProps) {
  const getLevelColor = (level: string) => {
    const levels: Record<string, string> = {
      novice: "text-gray-400",
      apprentice: "text-green-400",
      adept: "text-neon-cyan",
      expert: "text-neon-purple",
      master: "text-neon-pink",
      legendary: "text-yellow-400",
    };
    return levels[level.toLowerCase()] || "text-neon-cyan";
  };

  const getLevelIcon = (level: string) => {
    const icons: Record<string, string> = {
      novice: "🌱",
      apprentice: "📚",
      adept: "⚡",
      expert: "🔥",
      master: "👑",
      legendary: "✨",
    };
    return icons[level.toLowerCase()] || "⭐";
  };

  return (
    <div className="card-neon-pink mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy size={24} className="text-neon-pink" />
        <h2 className="neon-subtitle">REPUTATION_SYSTEM</h2>
      </div>

      <div className="space-y-6">
        {/* Main Reputation Stats */}
        {reputation ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="stat-display">
              <span className="stat-value">{reputation.score}</span>
              <span className="stat-label">Pontuação</span>
            </div>

            <div className="stat-display">
              <span className={`stat-value text-2xl ${getLevelColor(reputation.level)}`}>
                {getLevelIcon(reputation.level)}
              </span>
              <span className="stat-label">{reputation.level.toUpperCase()}</span>
            </div>

            <div className="stat-display">
              <span className="stat-value">{reputation.totalMissionsCompleted}</span>
              <span className="stat-label">Missões Completas</span>
            </div>

            <div className="stat-display">
              <span className="stat-value">{reputation.successRate}%</span>
              <span className="stat-label">Taxa de Sucesso</span>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-neon-cyan/60 text-sm">
            Reputação não inicializada
          </div>
        )}

        {/* Badges Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Award size={18} className="text-neon-pink" />
            <span className="neon-label">BADGES_EARNED ({badges.length})</span>
          </div>

          {badges.length === 0 ? (
            <div className="p-4 text-center text-neon-cyan/60 text-sm">
              Nenhum badge conquistado ainda
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-3 bg-neon-pink/10 border border-neon-pink/40 rounded text-center hover:border-neon-pink/80 transition-all"
                >
                  <div className="text-2xl mb-2">{badge.icon || "🏆"}</div>
                  <div className="text-neon-pink font-bold text-xs mb-1">{badge.name}</div>
                  <div className="text-neon-cyan/60 text-xs">{badge.category}</div>
                  {badge.description && (
                    <div className="text-neon-cyan/40 text-xs mt-2 line-clamp-2">{badge.description}</div>
                  )}
                  <div className="text-neon-cyan/50 text-xs mt-2 font-mono">
                    {new Date(badge.earnedAt).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reputation Progress */}
        {reputation && (
          <div className="p-4 bg-neon-pink/5 border border-neon-pink/30 rounded">
            <div className="text-neon-label mb-3">NEXT_LEVEL_PROGRESS</div>
            <div className="progress-neon">
              <div
                className="progress-neon-bar"
                style={{ width: `${Math.min((reputation.score % 100) / 100 * 100, 100)}%` }}
              />
            </div>
            <div className="text-xs text-neon-cyan/60 mt-2 font-mono">
              {reputation.score % 100} / 100 pontos para próximo nível
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
