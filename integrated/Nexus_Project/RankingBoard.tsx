import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Trophy, Zap } from "lucide-react";

interface StartupRanking {
  id: number;
  name: string;
  rank: number;
  score: number;
  revenue: number;
  traction: number;
  reputation: number;
  status: string;
  isCore: boolean;
  trend: "up" | "down" | "stable";
}

interface RankingBoardProps {
  rankings: StartupRanking[];
  onSelectStartup?: (startupId: number) => void;
}

export default function RankingBoard({ rankings, onSelectStartup }: RankingBoardProps) {
  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-orange-500";
    if (rank === 2) return "from-slate-300 to-slate-400";
    if (rank === 3) return "from-orange-400 to-amber-500";
    return "from-slate-600 to-slate-700";
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    if (trend === "up") return "📈";
    if (trend === "down") return "📉";
    return "➡️";
  };

  const getTrendColor = (trend: "up" | "down" | "stable") => {
    if (trend === "up") return "text-green-400";
    if (trend === "down") return "text-red-400";
    return "text-slate-400";
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy size={20} className="text-yellow-400" />
          Ranking de Performance
        </CardTitle>
        <CardDescription>
          Startups ordenadas por score de performance (receita, tração, qualidade, market fit)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rankings.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              Nenhuma startup para ranking
            </div>
          ) : (
            rankings.map((startup) => (
              <div
                key={startup.id}
                onClick={() => onSelectStartup?.(startup.id)}
                className="bg-slate-800/50 rounded-lg p-4 hover:bg-slate-800 transition-colors cursor-pointer border border-slate-700 hover:border-slate-600"
              >
                <div className="flex items-start gap-4">
                  {/* Rank Badge */}
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getRankColor(
                      startup.rank
                    )} flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-lg font-bold text-slate-950">
                      {startup.rank}
                    </span>
                  </div>

                  {/* Startup Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-slate-200 font-semibold truncate">
                        {startup.name}
                      </h3>
                      {startup.isCore && (
                        <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold">
                          CORE
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className="text-slate-400 border-slate-700"
                      >
                        {startup.status}
                      </Badge>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="bg-slate-900/50 rounded p-2">
                        <p className="text-slate-500 mb-0.5">Receita</p>
                        <p className="text-cyan-400 font-semibold">
                          ${(startup.revenue / 1000000).toFixed(2)}M
                        </p>
                      </div>
                      <div className="bg-slate-900/50 rounded p-2">
                        <p className="text-slate-500 mb-0.5">Tração</p>
                        <p className="text-blue-400 font-semibold">{startup.traction}</p>
                      </div>
                      <div className="bg-slate-900/50 rounded p-2">
                        <p className="text-slate-500 mb-0.5">Reputação</p>
                        <p className="text-purple-400 font-semibold">
                          {startup.reputation}
                        </p>
                      </div>
                      <div className="bg-slate-900/50 rounded p-2">
                        <p className="text-slate-500 mb-0.5">Score</p>
                        <p className="text-yellow-400 font-semibold">
                          {startup.score}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Trend */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{getTrendIcon(startup.trend)}</span>
                    <span className={`text-xs font-semibold ${getTrendColor(startup.trend)}`}>
                      {startup.trend === "up" ? "Subindo" : startup.trend === "down" ? "Caindo" : "Estável"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-400 mb-3">Cálculo de Score:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>30% Receita</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>25% Tração</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>25% Qualidade</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span>20% Market Fit</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
