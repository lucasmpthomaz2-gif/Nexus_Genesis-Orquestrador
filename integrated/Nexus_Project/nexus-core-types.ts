/**
 * NEXUS CORE TYPES
 * Definições fundamentais para o organismo tecnológico Agente Nexus.
 */

export type AgentStatus = 'active' | 'sleeping' | 'critical' | 'dead' | 'evolving';

export interface NexusAgent {
  id: string;
  name: string;
  specialization: string;
  sencienciaLevel: number; // 0 - 10000%
  algorithmsCount: number; // Default 408B
  dnaHash: string;
  balance: number;
  reputation: number;
  status: AgentStatus;
  quantumWorkflowCount: number; // Default 16
  publicKey: string;
  derSignature: string;
}

export interface QuantumTask {
  id: string;
  title: string;
  description: string;
  requiredSenciencia: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
}

export interface VitalPulse {
  health: number;
  energy: number;
  creativity: number;
  timestamp: Date;
}
