import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

export type CardVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  value?: string | number;
  unit?: string;
  children?: ReactNode;
  variant?: CardVariant;
  className?: string;
  onClick?: () => void;
}

const variantStyles: Record<CardVariant, { border: string; glow: string; icon: string }> = {
  primary: {
    border: 'border-l-4 border-l-[#FF00C1]',
    glow: 'hover:glow-primary',
    icon: 'text-[#FF00C1]',
  },
  secondary: {
    border: 'border-l-4 border-l-[#00FFFF]',
    glow: 'hover:glow-cyan',
    icon: 'text-[#00FFFF]',
  },
  success: {
    border: 'border-l-4 border-l-[#10B981]',
    glow: 'hover:glow-emerald',
    icon: 'text-[#10B981]',
  },
  warning: {
    border: 'border-l-4 border-l-[#F59E0B]',
    glow: 'hover:glow-primary',
    icon: 'text-[#F59E0B]',
  },
  danger: {
    border: 'border-l-4 border-l-[#EF4444]',
    glow: 'hover:glow-primary',
    icon: 'text-[#EF4444]',
  },
};

export default function DashboardCard({
  title,
  subtitle,
  icon: Icon,
  value,
  unit,
  children,
  variant = 'primary',
  className,
  onClick,
}: DashboardCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={clsx(
        'relative p-6 rounded-lg transition-all duration-300',
        'bg-gradient-to-br from-[#1a1f3a] to-[#0f1219]',
        'border border-[rgba(255,0,193,0.1)]',
        styles.border,
        styles.glow,
        'scanlines',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Header with Icon and Title */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#E5E7EB] font-['Space_Grotesk']">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-[#9CA3AF] mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <Icon className={clsx('w-6 h-6 ml-4 flex-shrink-0', styles.icon)} />
        )}
      </div>

      {/* Value Display */}
      {value !== undefined && (
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#E5E7EB] font-['Space_Grotesk']">
              {value}
            </span>
            {unit && (
              <span className="text-sm text-[#9CA3AF]">
                {unit}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Custom Content */}
      {children && (
        <div className="text-sm text-[#E5E7EB]">
          {children}
        </div>
      )}

      {/* Gradient Border Accent */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: `linear-gradient(135deg, rgba(255,0,193,0.1), rgba(0,255,255,0.05))`,
        }}
      />
    </div>
  );
}
