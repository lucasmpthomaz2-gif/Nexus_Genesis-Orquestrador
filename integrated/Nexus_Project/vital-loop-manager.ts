import * as agentsHelpers from "./db-helpers";
import * as brainPulseSignalsHelpers from "./db-helpers";
import { nanoid } from "nanoid";

export const vitalLoopManager = {
  monitorVitalSigns: async () => {
    console.log("[VitalLoop] Monitoring vital signs for all active agents...");
    const activeAgents = await agentsHelpers.getByStatus("active");

    for (const agent of activeAgents) {
      // Simulate decay
      const newHealth = Math.max(0, agent.health - Math.floor(Math.random() * 5));
      const newEnergy = Math.max(0, agent.energy - Math.floor(Math.random() * 10));
      const newCreativity = Math.max(0, agent.creativity - Math.floor(Math.random() * 3));

      // Record brain pulse signal
      await brainPulseSignalsHelpers.create({
        signalId: `SIG-${nanoid(8)}`,
        agentId: agent.agentId,
        health: newHealth,
        energy: newEnergy,
        creativity: newCreativity,
        createdAt: new Date(),
      });

      // Update agent status if critical
      let newStatus = agent.status;
      if (newHealth <= 20 && agent.status !== "critical") {
        newStatus = "critical";
        console.warn(`[VitalLoop] Agente ${agent.name} (${agent.agentId}) em estado CRÍTICO!`);
      } else if (newHealth > 20 && agent.status === "critical") {
        newStatus = "active"; // Recovered from critical
      }

      await agentsHelpers.update(agent.agentId, {
        health: newHealth,
        energy: newEnergy,
        creativity: newCreativity,
        status: newStatus,
      });
    }
    return { success: true };
  },
  restoreVitals: async (agentId: string, health?: number, energy?: number, creativity?: number) => {
    console.log(`[VitalLoop] Restoring vitals for agent ${agentId}`);
    const updates: { health?: number; energy?: number; creativity?: number } = {};
    if (health !== undefined) updates.health = health;
    if (energy !== undefined) updates.energy = energy;
    if (creativity !== undefined) updates.creativity = creativity;

    if (Object.keys(updates).length > 0) {
      await agentsHelpers.update(agentId, updates);
      return { success: true, message: `Vitals restored for agent ${agentId}` };
    } else {
      return { success: false, message: "No vitals provided for restoration" };
    }
  }
  }
};
