import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { AgentProfileHeader } from "@/components/AgentProfileHeader";
import { DNAViewer } from "@/components/DNAViewer";
import { MissionTimeline } from "@/components/MissionTimeline";
import { ReputationSystem } from "@/components/ReputationSystem";
import { TransactionHistory } from "@/components/TransactionHistory";
import { MoltbookFeed } from "@/components/MoltbookFeed";
import { BrainPulseChart } from "@/components/BrainPulseChart";
import { ForgeAndAssets } from "@/components/ForgeAndAssets";
import { AIInsights } from "@/components/AIInsights";
import { AlertsPanel } from "@/components/AlertsPanel";
import { Loader2, AlertCircle, Bell } from "lucide-react";
import "../styles/cyberpunk.css";

export default function AgentProfilePage() {
  const [location] = useLocation();
  const agentId = location.split("/").pop();

  const { data: profileData, isLoading, error } = trpc.agents.getProfile.useQuery(
    { agentId: agentId || "" },
    { enabled: !!agentId }
  );

  const { data: brainPulseHistory } = trpc.agents.getBrainPulseHistory.useQuery(
    { agentId: agentId || "", limit: 100 },
    { enabled: !!agentId }
  );

  const { data: genealogyData } = trpc.agents.getGenealogy.useQuery(
    { agentId: agentId || "" },
    { enabled: !!agentId }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-secondary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="text-neon-cyan animate-spin" />
          <p className="text-neon-cyan font-mono">INITIALIZING_AGENT_PROFILE...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData?.agent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-secondary flex items-center justify-center">
        <div className="card-neon-pink max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle size={24} className="text-neon-pink" />
            <h1 className="neon-title text-xl">ERROR</h1>
          </div>
          <p className="text-neon-cyan">Agente não encontrado ou erro ao carregar perfil.</p>
        </div>
      </div>
    );
  }

  const agent = profileData.agent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-secondary p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AgentProfileHeader agent={agent} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - DNA & Genealogy */}
          <div className="lg:col-span-1">
            <DNAViewer
              genealogy={genealogyData?.genealogy}
              agent={agent}
              descendants={genealogyData?.descendants}
            />
          </div>

          {/* Middle Column - Missions & Reputation */}
          <div className="lg:col-span-1">
            <MissionTimeline missions={profileData.missions} />
            <ReputationSystem
              reputation={profileData.reputation}
              badges={profileData.badges}
            />
          </div>

          {/* Right Column - Transactions & Moltbook */}
          <div className="lg:col-span-1">
            <TransactionHistory transactions={profileData.transactions} />
            <MoltbookFeed posts={profileData.posts} />
          </div>
        </div>

        {/* Brain Pulse Chart */}
        {brainPulseHistory && brainPulseHistory.length > 0 && (
          <BrainPulseChart signals={brainPulseHistory} />
        )}

        {/* Forge Projects & NFT Assets */}
        <ForgeAndAssets
          projects={profileData.projects}
          assets={profileData.assets}
        />

        {/* AI Insights */}
        <AIInsights agentId={agentId || ""} />

        {/* Alerts Section */}
        <AlertsPanel agentId={agentId || ""} />

        {/* Footer */}
        <div className="tech-line mt-8" />
        <div className="mt-6 p-4 text-center text-neon-cyan/50 font-mono text-xs">
          <div>NEXUS_HUB v2.0 | AGENT_PROFILE_SYSTEM</div>
          <div>Last Updated: {new Date().toLocaleString("pt-BR")}</div>
        </div>
      </div>
    </div>
  );
}
