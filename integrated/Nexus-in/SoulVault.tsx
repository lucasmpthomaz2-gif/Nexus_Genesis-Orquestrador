import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Loader2, Search, BookOpen, Lightbulb, Target, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function SoulVault() {
  const { data: entries, isLoading, refetch } = trpc.soulVault.getEntries.useQuery({ limit: 50 });
  const [searchQuery, setSearchQuery] = useState("");

  // WebSocket listener
  useWebSocket((event) => {
    if (event.type === "soul:vault:entry:created") {
      refetch();
    }
  });

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      decision: <Target className="w-4 h-4" />,
      precedent: <BookOpen className="w-4 h-4" />,
      lesson: <Lightbulb className="w-4 h-4" />,
      insight: <AlertCircle className="w-4 h-4" />,
    };
    return icons[type] || <BookOpen className="w-4 h-4" />;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      decision: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      precedent: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      lesson: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      insight: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return colors[type] || colors.decision;
  };

  const getImpactColor = (impact: string | null | undefined) => {
    if (!impact) return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    const colors: Record<string, string> = {
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      medium: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return colors[impact] || colors.medium;
  };

  const filteredEntries = entries?.filter((entry) =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Soul Vault - Memória Institucional</h1>

      {/* Search */}
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por título ou conteúdo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>
      </Card>

      {/* Entries */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : filteredEntries && filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <Card key={entry.id} className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-primary">
                        {getTypeIcon(entry.type)}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{entry.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{entry.content}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getTypeColor(entry.type)}>
                      {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                    </Badge>
                    {entry.impact && (
                      <Badge className={getImpactColor(entry.impact)}>
                        Impacto: {entry.impact.charAt(0).toUpperCase() + entry.impact.slice(1)}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Criada em {new Date(entry.createdAt).toLocaleDateString("pt-BR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    {entry.relatedProposalId && (
                      <span>Proposta Relacionada: #{entry.relatedProposalId}</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery ? "Nenhuma entrada encontrada" : "Nenhuma entrada na memória institucional"}
            </p>
          </div>
        )}
      </div>

      {/* Statistics */}
      {entries && entries.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Estatísticas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{entries.length}</p>
              <p className="text-sm text-muted-foreground">Total de Entradas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {entries.filter((e) => e.type === "decision").length}
              </p>
              <p className="text-sm text-muted-foreground">Decisões</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {entries.filter((e) => e.type === "lesson").length}
              </p>
              <p className="text-sm text-muted-foreground">Lições</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {entries.filter((e) => e.type === "precedent").length}
              </p>
              <p className="text-sm text-muted-foreground">Precedentes</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
