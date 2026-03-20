import { eq, desc, and, sql } from "drizzle-orm";
import { getDb } from "./db";
import * as schema from "./schema-completo";
import * as helpers from "./db-helpers";


/**
 * AGENTS
 */
export const createAgent = helpers.agentsHelpers.create;
export const getAgentById = helpers.agentsHelpers.getById;
export const getAllAgents = helpers.agentsHelpers.getAll;
export const getAgentsByStatus = helpers.agentsHelpers.getByStatus;
export const updateAgentStatus = async (agentId: string, status: string) => {
  const oldAgent = await helpers.agentsHelpers.getById(agentId);
  if (!oldAgent) throw new Error("Agent not found");
  await helpers.agentsHelpers.update(agentId, { status: status as any });
  await helpers.agentLifecycleHistoryHelpers.create({
    agentId,
    fromStatus: oldAgent.status as any,
    toStatus: status as any,
    reason: "Status update",
    createdAt: new Date(),
  });
};
export const updateAgentBalance = helpers.agentsHelpers.updateBalance;
export const updateAgentSenciencia = async (agentId: string, level: number) => {
  await helpers.agentsHelpers.update(agentId, { sencienciaLevel: level.toString() });
};

/**
 * AGENT DNA
 */
export const createAgentDNA = helpers.agentDNAHelpers.create;
export const getAgentDNA = helpers.agentDNAHelpers.getById;

/**
 * MISSIONS
 */
export const createMission = helpers.missionsHelpers.create;
export const getMissionById = helpers.missionsHelpers.getById;
export const getMissionsByStatus = helpers.missionsHelpers.getByStatus;
export const updateMissionStatus = async (missionId: string, status: string, progress?: number) => {
  const updates: any = { status: status as any };
  if (progress !== undefined) updates.progress = progress.toString();
  if (status === "completed") updates.completedAt = new Date();
  await helpers.missionsHelpers.update(missionId, updates);
};
export const assignMissionToAgent = helpers.missionsHelpers.assignToAgent;

/**
 * TRANSACTIONS
 */
export const createTransaction = helpers.transactionsHelpers.create;
export const getTransactionsByAgent = helpers.transactionsHelpers.getByAgent;
export const getAllTransactions = helpers.transactionsHelpers.getAll;

/**
 * ECOSYSTEM EVENTS
 */
export const createEcosystemEvent = helpers.ecosystemEventsHelpers.create;
export const getEcosystemEvents = helpers.ecosystemEventsHelpers.getAll;
export const getEventsByAgent = helpers.ecosystemEventsHelpers.getByAgent;

/**
 * ECOSYSTEM METRICS
 */
export const createEcosystemMetrics = helpers.ecosystemMetricsHelpers.create;
export const getLatestEcosystemMetrics = helpers.ecosystemMetricsHelpers.getLatest;
export const getEcosystemMetricsHistory = helpers.ecosystemMetricsHelpers.getAll;

/**
 * BRAIN PULSE SIGNALS
 */
export const createBrainPulseSignal = helpers.brainPulseSignalsHelpers.create;
export const getLatestBrainPulse = helpers.brainPulseSignalsHelpers.getLatestByAgent;
export const getBrainPulseHistory = helpers.brainPulseSignalsHelpers.getByAgent;

/**
 * GNOX MESSAGES
 */
export const createGnoxMessage = helpers.gnoxMessagesHelpers.create;
export const getGnoxMessagesBetween = helpers.gnoxMessagesHelpers.getHistory;
export const getAllGnoxMessages = helpers.gnoxMessagesHelpers.getAll;

/**
 * MOLTBOOK POSTS
 */
export const createMoltbookPost = helpers.moltbookPostsHelpers.create;
export const getMoltbookFeed = helpers.moltbookPostsHelpers.getFeed;
export const getAgentPosts = helpers.moltbookPostsHelpers.getByAgent;

/**
 * FORGE PROJECTS
 */
export const createForgeProject = helpers.forgeProjectsHelpers.create;
export const getAgentProjects = helpers.forgeProjectsHelpers.getByAgent;
export const getAllForgeProjects = helpers.forgeProjectsHelpers.getAll;

/**
 * NFT ASSETS
 */
export const createNFTAsset = helpers.nftAssetsHelpers.create;
export const getAgentAssets = helpers.nftAssetsHelpers.getByAgent;
export const getAllNFTAssets = helpers.nftAssetsHelpers.getAll;

/**
 * AUTONOMOUS DECISIONS
 */
export const createAutonomousDecision = helpers.autonomousDecisionsHelpers.create;
export const getAgentDecisions = helpers.autonomousDecisionsHelpers.getByAgent;

/**
 * NOTIFICATIONS
 */
export const createNotification = helpers.notificationsHelpers.create;
export const getUserNotifications = helpers.notificationsHelpers.getByUser;
export const markNotificationAsRead = async (notificationId: number) => {
  await helpers.notificationsHelpers.markAsRead(notificationId.toString());
};

