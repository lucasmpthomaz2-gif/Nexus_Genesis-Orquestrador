import { useWebSocketMarket, useWebSocketConnection } from "@/contexts/WebSocketContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MarketFeed() {
  const marketData = useWebSocketMarket();
  const { isConnected } = useWebSocketConnection();

  const MarketCard = ({
    symbol,
    price,
    change24h,
    changePercent24h,
    marketCap,
    volume24h,
  }: {
    symbol: string;
    price: number;
    change24h: number;
    changePercent24h: number;
    marketCap?: number;
    volume24h?: number;
  }) => {
    const isPositive = change24h >= 0;

    return (
      <Card className="nexus-card border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg font-bold">{symbol}</CardTitle>
              <CardDescription className="text-xs">Dados de Mercado</CardDescription>
            </div>
            <div className={cn("p-2 rounded-lg", isPositive ? "bg-green-500/10" : "bg-red-500/10")}>
              {isPositive ? (
                <TrendingUp className={cn("h-5 w-5", isPositive ? "text-green-500" : "text-red-500")} />
              ) : (
                <TrendingDown className={cn("h-5 w-5", isPositive ? "text-green-500" : "text-red-500")} />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Price */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Preço Atual</p>
            <p className="text-2xl font-bold text-foreground">
              ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Change */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Mudança 24h</p>
              <p className={cn("text-lg font-semibold", isPositive ? "text-green-500" : "text-red-500")}>
                {isPositive ? "+" : ""}${change24h.toFixed(2)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">% 24h</p>
              <p className={cn("text-lg font-semibold", isPositive ? "text-green-500" : "text-red-500")}>
                {isPositive ? "+" : ""}{changePercent24h.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Market Cap and Volume */}
          {(marketCap || volume24h) && (
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
              {marketCap && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Market Cap</p>
                  <p className="text-sm font-semibold text-foreground">
                    ${(marketCap / 1e9).toFixed(2)}B
                  </p>
                </div>
              )}
              {volume24h && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Volume 24h</p>
                  <p className="text-sm font-semibold text-foreground">
                    ${(volume24h / 1e9).toFixed(2)}B
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Feed de Mercado</h1>
          <p className="text-slate-400">
            Dados de criptomoedas em tempo real
          </p>
        </div>

        {/* Market Overview */}
        <Card className="nexus-card border-border/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              Visão Geral do Mercado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total de Ativos Monitorados</p>
                <p className="text-3xl font-bold text-blue-500">
                  {marketData?.length || 0}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Status de Conexão</p>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-3 w-3 rounded-full animate-pulse",
                      isConnected ? "bg-green-500" : "bg-red-500"
                    )}
                  />
                  <p className="text-lg font-semibold">
                    {isConnected ? "Conectado" : "Desconectado"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Última Atualização</p>
                <p className="text-lg font-semibold">
                  {new Date().toLocaleTimeString("pt-BR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Data Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Criptomoedas Monitoradas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sample market data - replace with real data from WebSocket */}
            <MarketCard
              symbol="BTC"
              price={45230.50}
              change24h={1250.50}
              changePercent24h={2.85}
              marketCap={890e9}
              volume24h={25e9}
            />
            <MarketCard
              symbol="ETH"
              price={2850.75}
              change24h={-125.25}
              changePercent24h={-4.20}
              marketCap={342e9}
              volume24h={15e9}
            />
            <MarketCard
              symbol="ADA"
              price={0.98}
              change24h={0.05}
              changePercent24h={5.35}
              marketCap={35e9}
              volume24h={1.2e9}
            />
            <MarketCard
              symbol="SOL"
              price={198.45}
              change24h={8.75}
              changePercent24h={4.62}
              marketCap={85e9}
              volume24h={3.5e9}
            />
            <MarketCard
              symbol="XRP"
              price={2.15}
              change24h={-0.10}
              changePercent24h={-4.44}
              marketCap={115e9}
              volume24h={2.8e9}
            />
            <MarketCard
              symbol="DOGE"
              price={0.38}
              change24h={0.02}
              changePercent24h={5.56}
              marketCap={55e9}
              volume24h={1.5e9}
            />
          </div>
        </div>

        {/* Market Sentiment */}
        <Card className="nexus-card border-border/50">
          <CardHeader>
            <CardTitle>Análise de Sentimento</CardTitle>
            <CardDescription>Tendências gerais do mercado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-muted-foreground mb-2">Altistas</p>
                <p className="text-2xl font-bold text-green-500">65%</p>
              </div>
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm text-muted-foreground mb-2">Neutros</p>
                <p className="text-2xl font-bold text-yellow-500">25%</p>
              </div>
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-muted-foreground mb-2">Baixistas</p>
                <p className="text-2xl font-bold text-red-500">10%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
