import { Loader2, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface AIInsightsProps {
  agentId: string;
}

export function AIInsights({ agentId }: AIInsightsProps) {
  const { data: analysis, isLoading, error } = trpc.analysis.analyzeAgent.useQuery({
    agentId,
  });

  if (isLoading) {
    return (
      <div className="card-neon-pink mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb size={24} className="text-neon-pink animate-pulse" />
          <h2 className="neon-subtitle">AI_INSIGHTS</h2>
        </div>
        <div className="flex items-center justify-center gap-3 p-8">
          <Loader2 size={24} className="text-neon-cyan animate-spin" />
          <span className="text-neon-cyan font-mono">ANALYZING_BEHAVIOR...</span>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="card-neon-pink mb-6">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle size={24} className="text-neon-pink" />
          <h2 className="neon-subtitle">AI_INSIGHTS</h2>
        </div>
        <div className="p-4 text-neon-cyan/60 text-sm">
          Análise não disponível no momento
        </div>
      </div>
    );
  }

  return (
    <div className="card-neon-pink mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb size={24} className="text-neon-pink" />
        <h2 className="neon-subtitle">AI_INSIGHTS</h2>
      </div>

      <div className="space-y-6">
        {/* Behavior Patterns */}
        <div className="p-4 bg-neon-pink/5 border border-neon-pink/30 rounded">
          <div className="text-neon-label mb-3">BEHAVIOR_PATTERNS</div>
          <p className="text-neon-cyan text-sm leading-relaxed">{analysis.behaviorPatterns}</p>
        </div>

        {/* Performance Trends */}
        <div className="p-4 bg-neon-purple/5 border border-neon-purple/30 rounded">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-neon-purple" />
            <span className="neon-label">PERFORMANCE_TRENDS</span>
          </div>
          <p className="text-neon-cyan text-sm leading-relaxed">{analysis.performanceTrends}</p>
        </div>

        {/* Risk Factors */}
        {analysis.riskFactors.length > 0 && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-red-500" />
              <span className="text-red-500 font-bold text-sm">RISK_FACTORS</span>
            </div>
            <ul className="space-y-2">
              {analysis.riskFactors.map((risk, idx) => (
                <li key={idx} className="text-red-400 text-sm flex gap-2">
                  <span className="text-red-500">▸</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Opportunities */}
        {analysis.opportunitiesForGrowth.length > 0 && (
          <div className="p-4 bg-neon-green/10 border border-neon-green/30 rounded">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={16} className="text-neon-green" />
              <span className="text-neon-green font-bold text-sm">GROWTH_OPPORTUNITIES</span>
            </div>
            <ul className="space-y-2">
              {analysis.opportunitiesForGrowth.map((opp, idx) => (
                <li key={idx} className="text-neon-green text-sm flex gap-2">
                  <span className="text-neon-green">▸</span>
                  <span>{opp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {analysis.recommendations.length > 0 && (
          <div className="p-4 bg-neon-cyan/5 border border-neon-cyan/30 rounded">
            <div className="text-neon-label mb-3">STRATEGIC_RECOMMENDATIONS</div>
            <ol className="space-y-2">
              {analysis.recommendations.map((rec, idx) => (
                <li key={idx} className="text-neon-cyan text-sm flex gap-3">
                  <span className="text-neon-pink font-bold flex-shrink-0">{idx + 1}.</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
