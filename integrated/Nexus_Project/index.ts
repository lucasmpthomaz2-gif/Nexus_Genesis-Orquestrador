export interface Agent {
  id: number;
  agentId: string;
  name: string;
  specialization: string;
  description?: string | null;
  dnaHash?: string | null;
  avatarUrl?: string | null;
  systemPrompt?: string | null;
  balance: number;
  reputation: number;
  health: number;
  energy: number;
  creativity: number;
  generationNumber: number;
  parentId?: string | null;
  status: "active" | "hibernating" | "deceased";
  createdAt: Date;
  updatedAt: Date;
}

export interface Mission {
  id: number;
  missionId: string;
  title: string;
  description?: string | null;
  assignedAgentId?: string | null;
  status: "pending" | "in_progress" | "completed" | "failed";
  priority: "low" | "medium" | "high" | "critical";
  reward: number;
  result?: string | null;
  createdAt: Date;
  completedAt?: Date | null;
  updatedAt: Date;
}

export interface Reputation {
  id: number;
  agentId: string;
  score: number;
  level: string;
  totalMissionsCompleted: number;
  successRate: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Badge {
  id: number;
  badgeId: string;
  agentId: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  category: string;
  earnedAt: Date;
}

export interface Transaction {
  id: number;
  transactionId: string;
  senderId?: string | null;
  recipientId?: string | null;
  type: "reward" | "cost" | "transfer" | "penalty" | "dividend";
  amount: number;
  description?: string | null;
  missionId?: string | null;
  agentShare?: number | null;
  parentShare?: number | null;
  infraShare?: number | null;
  createdAt: Date;
}

export interface BrainPulseSignal {
  id: number;
  agentId: string;
  health: number;
  energy: number;
  creativity: number;
  decision?: string | null;
  createdAt: Date;
}

export interface Genealogy {
  id: number;
  agentId: string;
  parentId?: string | null;
  dnaFusionData?: string | null;
  inheritedMemory: number;
  generation: number;
  createdAt: Date;
}

export interface MoltbookPost {
  id: number;
  postId: string;
  agentId: string;
  content: string;
  postType: "reflection" | "achievement" | "interaction" | "decision";
  reactions: number;
  createdAt: Date;
}

export interface GnoxMessage {
  id: number;
  messageId: string;
  senderId: string;
  recipientId: string;
  encryptedContent: string;
  translation?: string | null;
  messageType: string;
  createdAt: Date;
}

export interface ForgeProject {
  id: number;
  projectId: string;
  agentId: string;
  name: string;
  description?: string | null;
  repositoryUrl?: string | null;
  status: "planning" | "development" | "testing" | "deployed" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

export interface NFTAsset {
  id: number;
  assetId: string;
  agentId: string;
  name: string;
  metadata?: string | null;
  sha256Hash: string;
  value: number;
  mediaUrl?: string | null;
  createdAt: Date;
}

export interface Event {
  id: number;
  eventId: string;
  agentId?: string | null;
  eventType: string;
  content?: string | null;
  metadata?: string | null;
  createdAt: Date;
}

export interface Alert {
  id: number;
  alertId: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  type: string;
  isRead: number;
  relatedAgentId?: string | null;
  relatedMissionId?: string | null;
  createdAt: Date;
}
