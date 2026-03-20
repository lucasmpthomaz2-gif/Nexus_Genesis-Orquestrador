import { cn } from "@/lib/utils";

type Status = "success" | "warning" | "error" | "info" | "pending";

interface StatusBadgeProps {
  status: Status;
  label: string;
  animated?: boolean;
  size?: "sm" | "md" | "lg";
}

const statusConfig = {
  success: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-400",
    dot: "bg-green-500",
  },
  warning: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
    dot: "bg-yellow-500",
  },
  error: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    dot: "bg-red-500",
  },
  info: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    dot: "bg-blue-500",
  },
  pending: {
    bg: "bg-slate-500/10",
    border: "border-slate-500/30",
    text: "text-slate-400",
    dot: "bg-slate-500",
  },
};

const sizeConfig = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base",
};

export function StatusBadge({
  status,
  label,
  animated = false,
  size = "md",
}: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border",
        config.bg,
        config.border,
        config.text,
        sizeConfig[size]
      )}
    >
      <div
        className={cn(
          "h-2 w-2 rounded-full",
          config.dot,
          animated && "animate-pulse"
        )}
      />
      <span className="font-medium">{label}</span>
    </div>
  );
}

interface ProgressBadgeProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
}

export function ProgressBadge({
  value,
  max = 100,
  label,
  showPercent = true,
}: ProgressBadgeProps) {
  const percent = (value / max) * 100;
  const getColor = () => {
    if (percent >= 80) return "from-green-500 to-green-600";
    if (percent >= 50) return "from-blue-500 to-blue-600";
    if (percent >= 20) return "from-yellow-500 to-yellow-600";
    return "from-red-500 to-red-600";
  };

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-slate-300">{label}</p>}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full bg-gradient-to-r transition-all duration-500",
              getColor()
            )}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
        {showPercent && (
          <span className="text-sm font-semibold text-slate-300 min-w-fit">
            {Math.round(percent)}%
          </span>
        )}
      </div>
    </div>
  );
}
