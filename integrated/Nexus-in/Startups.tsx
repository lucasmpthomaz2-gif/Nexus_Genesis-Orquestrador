import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Loader2, TrendingUp } from "lucide-react";

export default function Startups() {
  const { data: ranking, isLoading: rankingLoading, refetch: refetchRanking } = trpc.startups.getRanking.useQuery();
  const { data: startups, isLoading: startupsLoading } = trpc.startups.list.useQuery({ limit: 50 });

  // WebSocket listener
  useWebSocket((event) => {
    if (event.type === "startup:metrics:updated") {
      refetchRanking();
    }
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      development: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      launched: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      scaling: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      mature: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      archived: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[status] || colors.planning;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Ranking de Startups</h1>

      {/* Ranking */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Ranking Geral</h2>
        {rankingLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : ranking && ranking.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Posição</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Startup ID</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Score Geral</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Receita</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Crescimento</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Qualidade</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Market Fit</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((metric, idx) => (
                  <tr key={metric.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-foreground font-semibold">#{metric.rank || idx + 1}</td>
                    <td className="py-3 px-4 text-foreground">Startup #{metric.startupId}</td>
                    <td className="py-3 px-4 text-right text-foreground font-semibold">{metric.overallScore}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{metric.revenue}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{metric.userGrowth}%</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{metric.productQuality}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{metric.marketFit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhum ranking disponível</p>
        )}
      </Card>

      {/* Startups */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Todas as Startups</h2>
        {startupsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : startups && startups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {startups.map((startup) => (
              <Card key={startup.id} className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{startup.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{startup.description}</p>
                    </div>
                    {startup.isCore && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Core
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(startup.status)}>
                        {startup.status.charAt(0).toUpperCase() + startup.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Geração:</span>
                      <span className="text-sm font-semibold text-foreground">{startup.generation}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tração:</span>
                      <span className="text-sm font-semibold text-foreground">{startup.traction}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Reputação:</span>
                      <span className="text-sm font-semibold text-foreground">{startup.reputation}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      Receita: ${startup.revenue.toLocaleString()}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma startup disponível</p>
          </div>
        )}
      </div>
    </div>
  );
}
