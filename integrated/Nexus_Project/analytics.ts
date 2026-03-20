import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { agents, transactions, nftAssets, brainPulseSignals } from "../../drizzle/schema";
import { eq, desc, gte, lte } from "drizzle-orm";
import { z } from "zod";

export const analyticsRouter = router({
  /**
   * Obter métricas principais do ecossistema
   */
  getMainMetrics: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    try {
      const allAgents = await db.select().from(agents);
      const allTransactions = await db.select().from(transactions);
      const allNFTs = await db.select().from(nftAssets);

      const totalVolume = allTransactions.reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

      return {
        totalAgents: allAgents.length,
        activeAgents: allAgents.filter((a: any) => a.status === "active").length,
        totalTransactions: allTransactions.length,
        totalVolume,
        totalNFTs: allNFTs.length,
        avgReputation: Math.round(
          allAgents.reduce((sum: number, a: any) => sum + (a.reputation || 0), 0) / Math.max(allAgents.length, 1)
        ),
      };
    } catch (error) {
      console.error("[analyticsRouter] Error fetching main metrics:", error);
      throw error;
    }
  }),

  /**
   * Obter distribuição de especialidades
   */
  getSpecializationDistribution: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    try {
      const allAgents = await db.select().from(agents);

      const distribution: Record<string, number> = {};
      for (const agent of allAgents) {
        const spec = agent.specialization || "unknown";
        distribution[spec] = (distribution[spec] || 0) + 1;
      }

      return Object.entries(distribution).map(([name, value]) => ({
        name,
        value,
      }));
    } catch (error) {
      console.error("[analyticsRouter] Error fetching specialization distribution:", error);
      throw error;
    }
  }),

  /**
   * Obter distribuição de tipos de transações
   */
  getTransactionTypeDistribution: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    try {
      const allTransactions = await db.select().from(transactions);

      const distribution: Record<string, { count: number; value: number }> = {};
      for (const tx of allTransactions) {
        const type = tx.transactionType || "unknown";
        if (!distribution[type]) {
          distribution[type] = { count: 0, value: 0 };
        }
        distribution[type].count += 1;
        distribution[type].value += tx.amount || 0;
      }

      return Object.entries(distribution).map(([type, data]) => ({
        type,
        count: data.count,
        value: data.value,
      }));
    } catch (error) {
      console.error("[analyticsRouter] Error fetching transaction distribution:", error);
      throw error;
    }
  }),

  /**
   * Obter distribuição de saúde dos agentes
   */
  getHealthDistribution: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    try {
      const latestSignals = await db.select().from(brainPulseSignals);

      const distribution = {
        "90-100": 0,
        "70-89": 0,
        "50-69": 0,
        "<50": 0,
      };

      for (const signal of latestSignals) {
        const health = signal.health || 0;
        if (health >= 90) distribution["90-100"]++;
        else if (health >= 70) distribution["70-89"]++;
        else if (health >= 50) distribution["50-69"]++;
        else distribution["<50"]++;
      }

      return [
        { range: "90-100%", agents: distribution["90-100"] },
        { range: "70-89%", agents: distribution["70-89"] },
        { range: "50-69%", agents: distribution["50-69"] },
        { range: "<50%", agents: distribution["<50"] },
      ];
    } catch (error) {
      console.error("[analyticsRouter] Error fetching health distribution:", error);
      throw error;
    }
  }),

  /**
   * Obter dados de crescimento ao longo do tempo
   */
  getGrowthData: protectedProcedure
    .input(
      z.object({
        period: z.enum(["7d", "30d", "90d", "all"]).default("30d"),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        // Mock data - em produção, seria agregado do banco
        const growthData = [
          { date: "Jan", agents: 5, transactions: 12, volume: 450 },
          { date: "Fev", agents: 8, transactions: 28, volume: 1200 },
          { date: "Mar", agents: 15, transactions: 52, volume: 3400 },
          { date: "Abr", agents: 24, transactions: 98, volume: 7800 },
          { date: "Mai", agents: 38, transactions: 156, volume: 14200 },
          { date: "Jun", agents: 58, transactions: 234, volume: 24500 },
        ];

        if (input.period === "7d") {
          return growthData.slice(-2);
        } else if (input.period === "30d") {
          return growthData.slice(-3);
        } else if (input.period === "90d") {
          return growthData.slice(-4);
        }

        return growthData;
      } catch (error) {
        console.error("[analyticsRouter] Error fetching growth data:", error);
        throw error;
      }
    }),

  /**
   * Obter estatísticas de NFTs
   */
  getNFTStats: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    try {
      const allNFTs = await db.select().from(nftAssets);

      const totalValue = allNFTs.reduce((sum: number, nft: any) => sum + (nft.value || 0), 0);
      const avgValue = Math.round(totalValue / Math.max(allNFTs.length, 1));

      const rarityDistribution: Record<string, number> = {};
      for (const nft of allNFTs) {
        try {
          const metadata = JSON.parse(nft.metadata || "{}");
          const rarity = metadata.rarity || "unknown";
          rarityDistribution[rarity] = (rarityDistribution[rarity] || 0) + 1;
        } catch {
          // Skip invalid metadata
        }
      }

      return {
        total: allNFTs.length,
        totalValue,
        avgValue,
        rarityDistribution,
      };
    } catch (error) {
      console.error("[analyticsRouter] Error fetching NFT stats:", error);
      throw error;
    }
  }),

  /**
   * Exportar dados em JSON
   */
  exportDataJSON: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    try {
      const allAgents = await db.select().from(agents);
      const allTransactions = await db.select().from(transactions);
      const allNFTs = await db.select().from(nftAssets);
      const allSignals = await db.select().from(brainPulseSignals);

      return {
        exportDate: new Date().toISOString(),
        agents: allAgents,
        transactions: allTransactions,
        nfts: allNFTs,
        signals: allSignals,
      };
    } catch (error) {
      console.error("[analyticsRouter] Error exporting data:", error);
      throw error;
    }
  }),

  /**
   * Exportar dados em CSV
   */
  exportDataCSV: protectedProcedure
    .input(
      z.object({
        dataType: z.enum(["agents", "transactions", "nfts", "signals"]),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        let data: any[] = [];
        let headers: string[] = [];

        if (input.dataType === "agents") {
          data = await db.select().from(agents);
          headers = ["agentId", "name", "specialization", "balance", "reputation", "status"];
        } else if (input.dataType === "transactions") {
          data = await db.select().from(transactions);
          headers = ["senderId", "recipientId", "amount", "transactionType", "createdAt"];
        } else if (input.dataType === "nfts") {
          data = await db.select().from(nftAssets);
          headers = ["assetId", "agentId", "name", "value", "createdAt"];
        } else if (input.dataType === "signals") {
          data = await db.select().from(brainPulseSignals);
          headers = ["agentId", "health", "energy", "creativity", "createdAt"];
        }

        // Converter para CSV
        const csvContent = [
          headers.join(","),
          ...data.map((row: any) => headers.map((h) => JSON.stringify(row[h] || "")).join(",")),
        ].join("\n");

        return {
          filename: `nexus-${input.dataType}-${new Date().toISOString().split("T")[0]}.csv`,
          content: csvContent,
        };
      } catch (error) {
        console.error("[analyticsRouter] Error exporting CSV:", error);
        throw error;
      }
    }),
});
