import { BrainPulseSignal } from "@/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";

interface BrainPulseChartProps {
  signals: BrainPulseSignal[];
}

export function BrainPulseChart({ signals }: BrainPulseChartProps) {
  // Preparar dados para o gráfico
  const chartData = signals
    .slice()
    .reverse()
    .map((signal, index) => ({
      time: index,
      health: signal.health,
      energy: signal.energy,
      creativity: signal.creativity,
      timestamp: new Date(signal.createdAt).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

  // Calcular médias
  const avgHealth = signals.length > 0 ? Math.round(signals.reduce((sum, s) => sum + s.health, 0) / signals.length) : 0;
  const avgEnergy = signals.length > 0 ? Math.round(signals.reduce((sum, s) => sum + s.energy, 0) / signals.length) : 0;
  const avgCreativity = signals.length > 0 ? Math.round(signals.reduce((sum, s) => sum + s.creativity, 0) / signals.length) : 0;

  return (
    <div className="card-neon mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity size={24} className="text-neon-cyan" />
        <h2 className="neon-subtitle">BRAIN_PULSE_MONITOR</h2>
      </div>

      {signals.length === 0 ? (
        <div className="p-8 text-center text-neon-cyan/60">
          Nenhum sinal vital registrado
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="stat-display">
              <span className="stat-value text-red-500">{avgHealth}</span>
              <span className="stat-label">Saúde Média</span>
            </div>
            <div className="stat-display">
              <span className="stat-value text-yellow-400">{avgEnergy}</span>
              <span className="stat-label">Energia Média</span>
            </div>
            <div className="stat-display">
              <span className="stat-value text-neon-cyan">{avgCreativity}</span>
              <span className="stat-label">Criatividade Média</span>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-neon-cyan/5 border border-neon-cyan/30 rounded p-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 245, 255, 0.1)" />
                <XAxis
                  dataKey="timestamp"
                  stroke="rgba(0, 245, 255, 0.5)"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="rgba(0, 245, 255, 0.5)"
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(10, 14, 39, 0.95)",
                    border: "1px solid rgba(0, 245, 255, 0.5)",
                    borderRadius: "4px",
                  }}
                  labelStyle={{ color: "rgba(0, 245, 255, 0.8)" }}
                />
                <Legend wrapperStyle={{ color: "rgba(0, 245, 255, 0.7)" }} />
                <Line
                  type="monotone"
                  dataKey="health"
                  stroke="#ef4444"
                  dot={false}
                  isAnimationActive={false}
                  strokeWidth={2}
                  name="Saúde"
                />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="#facc15"
                  dot={false}
                  isAnimationActive={false}
                  strokeWidth={2}
                  name="Energia"
                />
                <Line
                  type="monotone"
                  dataKey="creativity"
                  stroke="#00f5ff"
                  dot={false}
                  isAnimationActive={false}
                  strokeWidth={2}
                  name="Criatividade"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Latest Signal */}
          {signals.length > 0 && (
            <div className="p-4 bg-neon-purple/5 border border-neon-purple/30 rounded">
              <div className="text-neon-label mb-3">LATEST_SIGNAL</div>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-neon-cyan">Timestamp:</span>
                  <span className="text-neon-pink">
                    {new Date(signals[0].createdAt).toLocaleString("pt-BR")}
                  </span>
                </div>
                {signals[0].decision && (
                  <div className="flex justify-between">
                    <span className="text-neon-cyan">Decision:</span>
                    <span className="text-neon-purple">{signals[0].decision}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
