import { Mission } from "@/types";
import { CheckCircle2, Clock, AlertCircle, XCircle, Zap } from "lucide-react";

interface MissionTimelineProps {
  missions: Mission[];
}

export function MissionTimeline({ missions }: MissionTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={20} className="text-neon-green" />;
      case "in_progress":
        return <Clock size={20} className="text-yellow-400 animate-spin" />;
      case "failed":
        return <XCircle size={20} className="text-red-500" />;
      default:
        return <AlertCircle size={20} className="text-neon-cyan" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-500 border-red-500/50";
      case "high":
        return "text-neon-pink border-neon-pink/50";
      case "medium":
        return "text-neon-cyan border-neon-cyan/50";
      default:
        return "text-green-400 border-green-400/50";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <div className="card-neon mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Zap size={24} className="text-neon-cyan" />
        <h2 className="neon-subtitle">MISSION_HISTORY</h2>
      </div>

      <div className="timeline-neon space-y-4">
        {missions.length === 0 ? (
          <div className="p-4 text-center text-neon-cyan/60 text-sm">
            Nenhuma missão registrada
          </div>
        ) : (
          missions.map((mission) => (
            <div key={mission.id} className="timeline-item">
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">{getStatusIcon(mission.status)}</div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-neon-cyan font-bold text-sm">{mission.title}</h3>
                      {mission.description && (
                        <p className="text-neon-cyan/70 text-xs mt-1">{mission.description}</p>
                      )}
                    </div>
                    <div className={`flex-shrink-0 px-2 py-1 border rounded text-xs font-bold whitespace-nowrap ${getPriorityColor(mission.priority)}`}>
                      {mission.priority.toUpperCase()}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-neon-cyan/60 font-mono mt-2">
                    <span>Status: {mission.status.toUpperCase()}</span>
                    <span>Reward: {mission.reward} ◆</span>
                    <span>Created: {formatDate(mission.createdAt)}</span>
                    {mission.completedAt && (
                      <span>Completed: {formatDate(mission.completedAt)}</span>
                    )}
                  </div>

                  {mission.result && (
                    <div className="mt-2 p-2 bg-neon-cyan/5 border border-neon-cyan/20 rounded text-xs text-neon-cyan">
                      <span className="font-bold">Result:</span> {mission.result}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
