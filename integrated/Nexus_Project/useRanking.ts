import { useMemo } from "react";

interface Startup {
  id: number;
  name: string;
  revenue: number;
  traction: number;
  reputation: number;
  status: string;
  isCore: boolean;
}

interface RankingResult {
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

/**
 * Hook para calcular ranking automático de startups
 * Score = 30% Receita + 25% Tração + 25% Qualidade + 20% Market Fit
 */
export function useRanking(startups: Startup[]): RankingResult[] {
  return useMemo(() => {
    // Calcular scores para cada startup
    const scoredStartups = startups.map((startup) => {
      // Normalizar receita (máximo esperado: $5M)
      const revenueScore = Math.min((startup.revenue / 5000000) * 100, 100);

      // Normalizar tração (máximo esperado: 500)
      const tractionScore = Math.min((startup.traction / 500) * 100, 100);

      // Qualidade do produto (assumir 75 como padrão se não informado)
      const qualityScore = 75;

      // Market fit (assumir 70 como padrão se não informado)
      const marketFitScore = 70;

      // Calcular score ponderado
      const totalScore = Math.round(
        revenueScore * 0.3 +
        tractionScore * 0.25 +
        qualityScore * 0.25 +
        marketFitScore * 0.2
      );

      return {
        ...startup,
        score: totalScore,
      };
    });

    // Ordenar por score (descendente)
    const ranked = scoredStartups
      .sort((a, b) => b.score - a.score)
      .map((startup, index) => ({
        ...startup,
        rank: index + 1,
        trend: "stable" as const, // Pode ser expandido com histórico
      }));

    return ranked;
  }, [startups]);
}

/**
 * Calcula se há mudança de posição (para animações/notificações)
 */
export function useRankingTrend(
  currentRanking: RankingResult[],
  previousRanking?: RankingResult[]
): RankingResult[] {
  return useMemo(() => {
    if (!previousRanking) return currentRanking;

    return currentRanking.map((current) => {
      const previous = previousRanking.find((p) => p.id === current.id);
      if (!previous) return current;

      let trend: "up" | "down" | "stable" = "stable";
      if (current.rank < previous.rank) {
        trend = "up";
      } else if (current.rank > previous.rank) {
        trend = "down";
      }

      return {
        ...current,
        trend,
      };
    });
  }, [currentRanking, previousRanking]);
}

/**
 * Calcula se há mudança de core startup
 */
export function getSuccessorCandidate(ranking: RankingResult[]): RankingResult | null {
  if (ranking.length === 0) return null;

  // O candidato a core é o startup com maior score que não é core
  const nonCoreStartups = ranking.filter((s) => !s.isCore);
  return nonCoreStartups.length > 0 ? nonCoreStartups[0] : null;
}

/**
 * Calcula métricas agregadas do ranking
 */
export function getRankingMetrics(ranking: RankingResult[]) {
  if (ranking.length === 0) {
    return {
      avgScore: 0,
      avgRevenue: 0,
      avgTraction: 0,
      avgReputation: 0,
      totalRevenue: 0,
      topPerformer: null,
    };
  }

  const avgScore = Math.round(
    ranking.reduce((sum, s) => sum + s.score, 0) / ranking.length
  );
  const avgRevenue = Math.round(
    ranking.reduce((sum, s) => sum + s.revenue, 0) / ranking.length
  );
  const avgTraction = Math.round(
    ranking.reduce((sum, s) => sum + s.traction, 0) / ranking.length
  );
  const avgReputation = Math.round(
    ranking.reduce((sum, s) => sum + s.reputation, 0) / ranking.length
  );
  const totalRevenue = ranking.reduce((sum, s) => sum + s.revenue, 0);

  return {
    avgScore,
    avgRevenue,
    avgTraction,
    avgReputation,
    totalRevenue,
    topPerformer: ranking[0] || null,
  };
}
