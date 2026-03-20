import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function Agents() {
  const { data: agents, isLoading } = trpc.agents.list.useQuery({ limit: 50 });

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      cto: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      cmo: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      cfo: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      cdo: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      ceo: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      legal: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      redteam: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };
    return colors[role] || colors.ceo;
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return "bg-green-500";
    if (health >= 60) return "bg-yellow-500";
    if (health >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Agentes IA Especializados</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      ) : agents && agents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <Card key={agent.id} className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">{agent.specialization}</p>
                  </div>
                  <Badge className={getRoleColor(agent.role)}>
                    {agent.role.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">Saúde</span>
                      <span className="text-sm font-semibold text-foreground">{agent.health}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getHealthColor(agent.health)} transition-all`}
                        style={{ width: `${agent.health}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">Energia</span>
                      <span className="text-sm font-semibold text-foreground">{agent.energy}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all"
                        style={{ width: `${agent.energy}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">Criatividade</span>
                      <span className="text-sm font-semibold text-foreground">{agent.creativity}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-purple-500 transition-all"
                        style={{ width: `${agent.creativity}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Reputação: <span className="font-semibold text-foreground">{agent.reputation}</span>
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum agente disponível</p>
        </div>
      )}
    </div>
  );
}
