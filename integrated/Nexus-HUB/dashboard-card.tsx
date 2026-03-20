import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

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
    glow: 'hover:shadow-[0_0_20px_rgba(255,0,193,0.4)]',
    icon: 'text-[#FF00C1]',
  },
  secondary: {
    border: 'border-l-4 border-l-[#00FFFF]',
    glow: 'hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]',
    icon: 'text-[#00FFFF]',
  },
  success: {
    border: 'border-l-4 border-l-[#10B981]',
    glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    icon: 'text-[#10B981]',
  },
  warning: {
    border: 'border-l-4 border-l-[#F59E0B]',
    glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    icon: 'text-[#F59E0B]',
  },
  danger: {
    border: 'border-l-4 border-l-[#EF4444]',
    glow: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
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
      className={cn(
        'relative p-6 transition-all duration-300 rounded-none',
        'bg-black/40 backdrop-blur-md',
        'border border-white/10',
        styles.border,
        styles.glow,
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Scanlines Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5 overflow-hidden">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.1)_1px,rgba(255,255,255,0.1)_2px)]" />
      </div>

      {/* Header with Icon and Title */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/70 font-code">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[10px] text-white/40 mt-1 uppercase font-code">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <Icon className={cn('w-4 h-4 ml-4 flex-shrink-0', styles.icon)} />
        )}
      </div>

      {/* Value Display */}
      {value !== undefined && (
        <div className="mb-4 relative z-10">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-headline tracking-tighter">
              {value}
            </span>
            {unit && (
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                {unit}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Custom Content */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}
