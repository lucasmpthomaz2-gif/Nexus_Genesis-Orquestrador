import { useEffect, useState, useCallback } from "react";
import {
  initializeWebSocket,
  getSocket,
  disconnectWebSocket,
  onEvent,
  offEvent,
  sendGnoxMessage,
  executeTransaction,
  recordBrainPulse,
  publishMoltbookPost,
  reactToPost,
  changeAgentStatus,
  requestEcosystemStatus,
} from "@/lib/websocket";

export interface WebSocketEvent {
  type: string;
  timestamp: number;
  data: any;
}

export function useNexusWebSocket(agentId: string, agentName: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedAgents, setConnectedAgents] = useState<string[]>([]);
  const [ecosystemEvents, setEcosystemEvents] = useState<WebSocketEvent[]>([]);
  const [gnoxMessages, setGnoxMessages] = useState<any[]>([]);
  const [brainPulses, setBrainPulses] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Inicializar WebSocket
  useEffect(() => {
    const connect = async () => {
      try {
        await initializeWebSocket(agentId, agentName);
        setIsConnected(true);

        // Listeners para eventos
        const handleEcosystemActivity = (event: WebSocketEvent) => {
          setEcosystemEvents((prev) => [event, ...prev.slice(0, 49)]);
        };

        const handleGnoxMessage = (event: WebSocketEvent) => {
          setGnoxMessages((prev) => [event.data, ...prev.slice(0, 99)]);
        };

        const handleBrainPulse = (event: WebSocketEvent) => {
          setBrainPulses((prev) => [event.data, ...prev.slice(0, 99)]);
        };

        const handleTransaction = (event: WebSocketEvent) => {
          setTransactions((prev) => [event.data, ...prev.slice(0, 99)]);
        };

        const handleAgentOnline = (data: any) => {
          setConnectedAgents((prev) => {
            const agents = new Set(prev);
            agents.add(data.agentId);
            return Array.from(agents);
          });
        };

        const handleAgentOffline = (data: any) => {
          setConnectedAgents((prev) => prev.filter((id) => id !== data.agentId));
        };

        // Registrar listeners
        onEvent("ecosystem:activity", handleEcosystemActivity);
        onEvent("gnox:message", handleGnoxMessage);
        onEvent("brain:pulse", handleBrainPulse);
        onEvent("transaction:completed", handleTransaction);
        onEvent("agent:online", handleAgentOnline);
        onEvent("agent:offline", handleAgentOffline);

        // Cleanup
        return () => {
          offEvent("ecosystem:activity", handleEcosystemActivity);
          offEvent("gnox:message", handleGnoxMessage);
          offEvent("brain:pulse", handleBrainPulse);
          offEvent("transaction:completed", handleTransaction);
          offEvent("agent:online", handleAgentOnline);
          offEvent("agent:offline", handleAgentOffline);
        };
      } catch (error) {
        console.error("[NEXUS] Erro ao conectar:", error);
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      disconnectWebSocket();
      setIsConnected(false);
    };
  }, [agentId, agentName]);

  // Funções para enviar eventos
  const sendMessage = useCallback(
    (recipientId: string, message: string, messageType: string = "communication") => {
      sendGnoxMessage(agentId, recipientId, message, messageType);
    },
    [agentId]
  );

  const sendTransaction = useCallback(
    (recipientId: string, amount: number, transactionType: string, description?: string) => {
      executeTransaction(agentId, recipientId, amount, transactionType, description);
    },
    [agentId]
  );

  const recordPulse = useCallback(
    (health: number, energy: number, creativity: number, decision?: string) => {
      recordBrainPulse(agentId, health, energy, creativity, decision);
    },
    [agentId]
  );

  const publishPost = useCallback(
    (content: string, postType: string = "insight") => {
      publishMoltbookPost(agentId, content, postType);
    },
    [agentId]
  );

  const reactPost = useCallback((postId: number, reactionType: string) => {
    reactToPost(postId, agentId, reactionType);
  }, [agentId]);

  const changeStatus = useCallback((newStatus: string) => {
    changeAgentStatus(agentId, newStatus);
  }, [agentId]);

  const getEcosystemStatus = useCallback(async () => {
    return await requestEcosystemStatus();
  }, []);

  return {
    isConnected,
    connectedAgents,
    ecosystemEvents,
    gnoxMessages,
    brainPulses,
    transactions,
    sendMessage,
    sendTransaction,
    recordPulse,
    publishPost,
    reactPost,
    changeStatus,
    getEcosystemStatus,
  };
}
