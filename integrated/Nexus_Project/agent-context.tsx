import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Agent, AgentProfile, Transaction } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AgentContextType {
  // Current agent
  currentAgent: AgentProfile | null;
  isLoading: boolean;
  error: string | null;

  // Agent operations
  setCurrentAgent: (agent: AgentProfile) => Promise<void>;
  updateAgentBalance: (amount: number) => Promise<void>;
  updateAgentReputation: (score: number) => Promise<void>;
  logout: () => Promise<void>;

  // Transaction history
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => Promise<void>;
  fetchTransactions: () => Promise<void>;

  // Descendants
  descendants: Agent[];
  fetchDescendants: () => Promise<void>;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

const AGENT_STORAGE_KEY = '@nexus_hub_agent';
const TRANSACTIONS_STORAGE_KEY = '@nexus_hub_transactions';
const DESCENDANTS_STORAGE_KEY = '@nexus_hub_descendants';

export function AgentProvider({ children }: { children: ReactNode }) {
  const [currentAgent, setCurrentAgentState] = useState<AgentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [descendants, setDescendants] = useState<Agent[]>([]);

  // Initialize agent from storage on mount
  React.useEffect(() => {
    loadAgentFromStorage();
  }, []);

  const loadAgentFromStorage = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(AGENT_STORAGE_KEY);
      if (stored) {
        const agent = JSON.parse(stored) as AgentProfile;
        setCurrentAgentState(agent);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load agent');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setCurrentAgent = useCallback(async (agent: AgentProfile) => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem(AGENT_STORAGE_KEY, JSON.stringify(agent));
      setCurrentAgentState(agent);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set agent');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAgentBalance = useCallback(async (amount: number) => {
    if (!currentAgent) return;
    const updated = {
      ...currentAgent,
      tokenBalance: currentAgent.tokenBalance + amount,
      updatedAt: new Date(),
    };
    await setCurrentAgent(updated);
  }, [currentAgent, setCurrentAgent]);

  const updateAgentReputation = useCallback(async (score: number) => {
    if (!currentAgent) return;
    const updated = {
      ...currentAgent,
      reputation: Math.min(5.0, Math.max(0, score)),
      updatedAt: new Date(),
    };
    await setCurrentAgent(updated);
  }, [currentAgent, setCurrentAgent]);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.multiRemove([
        AGENT_STORAGE_KEY,
        TRANSACTIONS_STORAGE_KEY,
        DESCENDANTS_STORAGE_KEY,
      ]);
      setCurrentAgentState(null);
      setTransactions([]);
      setDescendants([]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to logout');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(TRANSACTIONS_STORAGE_KEY);
      if (stored) {
        const txs = JSON.parse(stored) as Transaction[];
        setTransactions(txs);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTransaction = useCallback(async (transaction: Transaction) => {
    try {
      setIsLoading(true);
      const updated = [transaction, ...transactions];
      await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(updated));
      setTransactions(updated);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add transaction');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [transactions]);

  const fetchDescendants = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(DESCENDANTS_STORAGE_KEY);
      if (stored) {
        const desc = JSON.parse(stored) as Agent[];
        setDescendants(desc);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch descendants');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AgentContextType = {
    currentAgent,
    isLoading,
    error,
    setCurrentAgent,
    updateAgentBalance,
    updateAgentReputation,
    logout,
    transactions,
    addTransaction,
    fetchTransactions,
    descendants,
    fetchDescendants,
  };

  return <AgentContext.Provider value={value}>{children}</AgentContext.Provider>;
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within AgentProvider');
  }
  return context;
}
