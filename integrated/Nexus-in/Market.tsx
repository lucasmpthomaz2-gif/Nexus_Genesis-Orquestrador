import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Loader2, TrendingUp, TrendingDown, Zap } from "lucide-react";

export default function Market() {
  const { data: marketData, isLoading: dataLoading, refetch: refetchData } = trpc.market.getData.useQuery();
  const { data: insights, isLoading: insightsLoading } = trpc.market.getInsights.useQuery({ limit: 20 });
  const { data: arbitrage, isLoading: arbitrageLoading } = trpc.market.getArbitrage.useQuery();

  // WebSocket listener
  useWebSocket((event) => {
    if (event.type === "market:data:updated") {
      refetchData();
    }
  });

  const getSentimentColor = (sentiment: string) => {
    const colors: Record<string, string> = {
      bullish: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      bearish: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      neutral: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };
    return colors[sentiment] || colors.neutral;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      identified: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      executing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[status] || colors.identified;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Market Oracle</h1>

      {/* Market Data */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Dados de Mercado</h2>
        {dataLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : marketData && marketData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketData.map((data) => (
              <Card key={data.id} className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{data.asset}</h3>
                      <p className="text-sm text-muted-foreground">Fonte: {data.source}</p>
                    </div>
                    {data.sentiment && (
                      <Badge className={getSentimentColor(data.sentiment)}>
                        {data.sentiment.charAt(0).toUpperCase() + data.sentiment.slice(1)}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Preço:</span>
                      <span className="text-lg font-semibold text-foreground">${data.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Mudança 24h:</span>
                      <div className="flex items-center gap-1">
                        {(data.priceChange24h || 0) >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`font-semibold ${(data.priceChange24h || 0) >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {(data.priceChange24h || 0) >= 0 ? "+" : ""}{data.priceChange24h}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Volume 24h:</span>
                      <span className="text-sm font-semibold text-foreground">${(data.volume24h || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                    Atualizado em {new Date(data.createdAt).toLocaleTimeString("pt-BR")}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhum dado de mercado disponível</p>
        )}
      </div>

      {/* Market Insights */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Insights de Mercado</h2>
        {insightsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : insights && insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight) => (
              <Card key={insight.id} className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-foreground">{insight.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={getSentimentColor(insight.sentiment)}>
                        {insight.sentiment.charAt(0).toUpperCase() + insight.sentiment.slice(1)}
                      </Badge>
                      <span className="text-xs font-semibold text-foreground bg-muted px-2 py-1 rounded">
                        {insight.confidence}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.content}</p>
                  {insight.relatedAssets && (
                    <p className="text-xs text-muted-foreground">
                      Ativos relacionados: {insight.relatedAssets}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                    {new Date(insight.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhum insight disponível</p>
        )}
      </div>

      {/* Arbitrage Opportunities */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Oportunidades de Arbitragem</h2>
        {arbitrageLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : arbitrage && arbitrage.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {arbitrage.map((opp) => (
              <Card key={opp.id} className="p-6 bg-card border-border border-green-500/50 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Zap className="w-5 h-5 text-green-500" />
                        {opp.asset}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {opp.exchangeFrom} → {opp.exchangeTo}
                      </p>
                    </div>
                    <Badge className={getStatusColor(opp.status)}>
                      {opp.status.charAt(0).toUpperCase() + opp.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="space-y-2 py-4 border-t border-b border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Diferença de Preço:</span>
                      <span className="text-sm font-semibold text-foreground">${opp.priceDifference.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Lucro Potencial:</span>
                      <span className="text-sm font-semibold text-green-500">${opp.profitPotential.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Confiança:</span>
                      <span className="text-sm font-semibold text-foreground">{opp.confidence}%</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Identificada em {new Date(opp.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhuma oportunidade de arbitragem identificada</p>
        )}
      </div>
    </div>
  );
}
