import { Genealogy, Agent } from "@/types";
import { Dna, Users } from "lucide-react";

interface DNAViewerProps {
  genealogy?: Genealogy;
  agent: Agent;
  descendants?: Genealogy[];
}

export function DNAViewer({ genealogy, agent, descendants = [] }: DNAViewerProps) {
  return (
    <div className="card-neon-pink mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Dna size={24} className="text-neon-pink" />
        <h2 className="neon-subtitle">DNA GENEALOGY</h2>
      </div>

      <div className="space-y-6">
        {/* DNA Hash */}
        <div className="p-4 bg-neon-pink/5 border border-neon-pink/30 rounded font-mono text-xs">
          <div className="text-neon-pink font-bold mb-2">DNA_SEQUENCE</div>
          <div className="text-neon-cyan break-all">{agent.dnaHash || "UNINITIALIZED"}</div>
        </div>

        {/* Generation Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="stat-display">
            <span className="stat-value">{agent.generationNumber}</span>
            <span className="stat-label">Geração</span>
          </div>
          <div className="stat-display">
            <span className="stat-value">{genealogy?.inheritedMemory || 0}</span>
            <span className="stat-label">Memória Herdada</span>
          </div>
        </div>

        {/* Genealogy Tree */}
        <div className="space-y-4">
          {/* Parent */}
          {genealogy?.parentId && (
            <div className="p-4 border-l-2 border-neon-cyan bg-neon-cyan/5 rounded">
              <div className="text-neon-label mb-2">👨 PARENT_AGENT</div>
              <div className="text-neon-cyan font-mono text-sm">{genealogy.parentId}</div>
            </div>
          )}

          {/* Descendants */}
          {descendants.length > 0 && (
            <div className="p-4 border-l-2 border-neon-purple bg-neon-purple/5 rounded">
              <div className="flex items-center gap-2 mb-3">
                <Users size={16} className="text-neon-purple" />
                <span className="neon-label">DESCENDENTES ({descendants.length})</span>
              </div>
              <div className="space-y-2">
                {descendants.map((desc) => (
                  <div key={desc.id} className="text-neon-cyan font-mono text-xs p-2 bg-neon-purple/10 rounded">
                    {desc.agentId}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!genealogy?.parentId && descendants.length === 0 && (
            <div className="p-4 border border-neon-cyan/30 rounded text-center text-neon-cyan/60 text-sm">
              Agente raiz - Sem genealogia registrada
            </div>
          )}
        </div>

        {/* DNA Fusion Data */}
        {genealogy?.dnaFusionData && (
          <div className="p-4 bg-neon-purple/5 border border-neon-purple/30 rounded font-mono text-xs">
            <div className="text-neon-purple font-bold mb-2">DNA_FUSION_DATA</div>
            <div className="text-neon-cyan break-all max-h-24 overflow-y-auto">{genealogy.dnaFusionData}</div>
          </div>
        )}
      </div>
    </div>
  );
}
