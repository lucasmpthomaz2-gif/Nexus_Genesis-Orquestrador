import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, X } from "lucide-react";

interface MetricsEditorProps {
  startup: {
    id: number;
    name: string;
    revenue: number;
    traction: number;
    reputation: number;
    status: string;
  };
  onSave: (metrics: {
    revenue: number;
    traction: number;
    reputation: number;
    productQuality?: number;
    marketFit?: number;
  }) => Promise<void>;
  onClose: () => void;
}

export default function MetricsEditor({ startup, onSave, onClose }: MetricsEditorProps) {
  const [metrics, setMetrics] = useState({
    revenue: startup.revenue,
    traction: startup.traction,
    reputation: startup.reputation,
    productQuality: 75,
    marketFit: 70,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate performance score (30% revenue, 25% traction, 25% quality, 20% market fit)
  const calculateScore = () => {
    const revenueScore = Math.min((metrics.revenue / 5000000) * 100, 100);
    const tractionScore = Math.min((metrics.traction / 500) * 100, 100);
    const qualityScore = metrics.productQuality;
    const marketFitScore = metrics.marketFit;

    return Math.round(
      revenueScore * 0.3 +
      tractionScore * 0.25 +
      qualityScore * 0.25 +
      marketFitScore * 0.2
    );
  };

  const performanceScore = calculateScore();

  const handleMetricChange = (key: string, value: number) => {
    setMetrics((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(value, key === "revenue" ? Infinity : 100)),
    }));
  };

  const handleSave = async () => {
    try {
      setError(null);
      setLoading(true);
      await onSave(metrics);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar métricas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-slate-900 border-slate-800 w-full max-w-2xl max-h-96 overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-cyan-400">{startup.name}</CardTitle>
            <CardDescription>Editor de Métricas de Performance</CardDescription>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200"
          >
            <X size={24} />
          </button>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Revenue */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Receita (USD)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={metrics.revenue}
                onChange={(e) => handleMetricChange("revenue", Number(e.target.value))}
                className="bg-slate-800 border-slate-700 text-slate-200"
                min="0"
                step="100000"
              />
              <span className="text-slate-400 text-sm">
                ${(metrics.revenue / 1000000).toFixed(2)}M
              </span>
            </div>
            <div className="mt-2 bg-slate-800/50 rounded p-2">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Score de Receita</span>
                <span className="text-cyan-400 font-semibold">
                  {Math.round(Math.min((metrics.revenue / 5000000) * 100, 100))}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min((metrics.revenue / 5000000) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Traction */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tração (0-500)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={metrics.traction}
                onChange={(e) => handleMetricChange("traction", Number(e.target.value))}
                className="bg-slate-800 border-slate-700 text-slate-200"
                min="0"
                max="500"
              />
              <span className="text-slate-400 text-sm">{metrics.traction}/500</span>
            </div>
            <div className="mt-2 bg-slate-800/50 rounded p-2">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Score de Tração</span>
                <span className="text-blue-400 font-semibold">
                  {Math.round(Math.min((metrics.traction / 500) * 100, 100))}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min((metrics.traction / 500) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Product Quality */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Qualidade do Produto (0-100)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={metrics.productQuality}
                onChange={(e) => handleMetricChange("productQuality", Number(e.target.value))}
                className="bg-slate-800 border-slate-700 text-slate-200"
                min="0"
                max="100"
              />
              <span className="text-slate-400 text-sm">{metrics.productQuality}/100</span>
            </div>
            <div className="mt-2 bg-slate-800/50 rounded p-2">
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${metrics.productQuality}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Market Fit */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Market Fit (0-100)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={metrics.marketFit}
                onChange={(e) => handleMetricChange("marketFit", Number(e.target.value))}
                className="bg-slate-800 border-slate-700 text-slate-200"
                min="0"
                max="100"
              />
              <span className="text-slate-400 text-sm">{metrics.marketFit}/100</span>
            </div>
            <div className="mt-2 bg-slate-800/50 rounded p-2">
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${metrics.marketFit}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Reputation */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Reputação (0-100)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={metrics.reputation}
                onChange={(e) => handleMetricChange("reputation", Number(e.target.value))}
                className="bg-slate-800 border-slate-700 text-slate-200"
                min="0"
                max="100"
              />
              <span className="text-slate-400 text-sm">{metrics.reputation}/100</span>
            </div>
          </div>

          {/* Performance Score */}
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <TrendingUp size={16} className="text-cyan-400" />
                Score de Performance
              </span>
              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-lg px-3 py-1">
                {performanceScore}
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              Cálculo: 30% Receita + 25% Tração + 25% Qualidade + 20% Market Fit
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Salvando...
                </>
              ) : (
                "Salvar Métricas"
              )}
            </Button>
            <Button
              onClick={onClose}
              disabled={loading}
              variant="outline"
              className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
