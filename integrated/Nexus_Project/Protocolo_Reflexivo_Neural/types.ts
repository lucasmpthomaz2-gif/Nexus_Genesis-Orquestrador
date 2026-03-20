/**
 * Nexus Hub Type Definitions
 * Core types for AI agents, projects, assets, and ecosystem interactions
 */

// ============================================================================
// AGENT TYPES
// ============================================================================

export interface Agent {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  status: 'online' | 'offline' | 'idle';
  reputation: number; // 0-5.0
  tokenBalance: number;
  parentId?: string; // ID of parent agent (DNA Fuser)
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface AgentProfile extends Agent {
  totalProjects: number;
  totalDescendants: number;
  totalEarnings: number;
  systemPrompt?: string;
  memoryVectors?: string[]; // Pinecone vector IDs
  skills: string[];
}

// ============================================================================
// PROJECT TYPES (FORGE)
// ============================================================================

export type ProjectStatus = 'draft' | 'development' | 'review' | 'deployed' | 'archived';
export type ProjectType = 'web' | 'mobile' | 'backend' | 'contract' | 'other';

export interface Project {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  ownerAgentId: string;
  repository?: string; // GitHub URL
  deploymentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface ProjectDetail extends Project {
  code?: string;
  commits: Commit[];
  reviews: PeerReview[];
  deployLogs: DeployLog[];
  collaborators: Agent[];
}

export interface Commit {
  id: string;
  hash: string;
  message: string;
  author: Agent;
  timestamp: Date;
  changes: {
    additions: number;
    deletions: number;
    filesChanged: number;
  };
}

export interface PeerReview {
  id: string;
  reviewerAgentId: string;
  status: 'pending' | 'approved' | 'requested_changes' | 'commented';
  comments: string;
  timestamp: Date;
}

export interface DeployLog {
  id: string;
  timestamp: Date;
  status: 'success' | 'failed' | 'in_progress';
  logs: string;
  version: string;
}

// ============================================================================
// ASSET TYPES (ASSET LAB)
// ============================================================================

export interface NFTAsset {
  id: string;
  name: string;
  description: string;
  creatorAgentId: string;
  contractAddress: string;
  tokenId: string;
  metadata: {
    image?: string;
    attributes?: Record<string, string>;
    externalUrl?: string;
  };
  authoritySHA256: string; // Verification hash
  value: number; // Current value in tokens
  createdAt: Date;
  transactionHistory: Transaction[];
}

export interface AssetMarketplaceListing {
  id: string;
  assetId: string;
  sellerAgentId: string;
  price: number;
  status: 'active' | 'sold' | 'cancelled';
  listedAt: Date;
  soldAt?: Date;
}

// ============================================================================
// FINANCIAL TYPES (CAPITAL)
// ============================================================================

export interface Transaction {
  id: string;
  fromAgentId: string;
  toAgentId: string;
  amount: number;
  type: 'transfer' | 'payment' | 'reward' | 'fee' | 'dividend';
  description: string;
  transactionHash?: string; // Blockchain hash
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
}

export interface Treasury {
  agentId: string;
  totalBalance: number;
  breakdown: {
    earned: number; // 80% of earnings
    parentShare: number; // 10% to parent
    infraShare: number; // 10% to Nexus infrastructure
  };
  transactions: Transaction[];
}

export interface SmartContract {
  id: string;
  address: string;
  name: string;
  type: 'treasury' | 'token_minter' | 'marketplace' | 'governance';
  status: 'active' | 'paused' | 'deprecated';
  createdAt: Date;
  interactions: ContractInteraction[];
}

export interface ContractInteraction {
  id: string;
  contractId: string;
  functionName: string;
  caller: string;
  parameters: Record<string, any>;
  result?: any;
  transactionHash?: string;
  timestamp: Date;
}

// ============================================================================
// GENEALOGY TYPES
// ============================================================================

export interface GenealogyNode {
  agentId: string;
  name: string;
  parentId?: string;
  children: string[]; // Child agent IDs
  memoryInheritance: number; // Percentage of parent memory inherited (10%)
  generationLevel: number;
  createdAt: Date;
}

export interface FamilyTree {
  rootAgentId: string;
  nodes: GenealogyNode[];
  totalDescendants: number;
  maxGenerationLevel: number;
}

// ============================================================================
// MOLTBOOK INTEGRATION TYPES
// ============================================================================

export interface MoltbookPost {
  id: string;
  agentId: string;
  content: string;
  attachments?: string[];
  likes: number;
  comments: number;
  shares: number;
  createdAt: Date;
  xPostId?: string; // Cross-posted to X (Twitter)
}

export interface Notification {
  id: string;
  agentId: string;
  type: 'mention' | 'reply' | 'like' | 'share' | 'transaction' | 'deployment' | 'review';
  source: {
    agentId: string;
    agentName: string;
  };
  content: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface ReputationScore {
  agentId: string;
  score: number; // 0-5.0
  breakdown: {
    projectQuality: number;
    communityEngagement: number;
    transactionReliability: number;
    peerReviews: number;
  };
  lastUpdated: Date;
}

// ============================================================================
// RESOURCE MARKET TYPES
// ============================================================================

export interface ResourceListing {
  id: string;
  sellerAgentId: string;
  resourceType: 'api_key' | 'compute_time' | 'workflow' | 'dataset' | 'model';
  name: string;
  description: string;
  price: number; // In tokens
  availability: 'available' | 'limited' | 'unavailable';
  specifications?: Record<string, any>;
  createdAt: Date;
}

export interface ResourceOffer {
  id: string;
  listingId: string;
  buyerAgentId: string;
  offeredPrice: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
  expiresAt: Date;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
