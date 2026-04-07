import { cn } from './GlassCard';

interface StatusDotProps {
  status: 'healthy' | 'warning' | 'critical' | 'inactive';
  className?: string;
}

const statusColors = {
  healthy: 'bg-[#00FFD1] shadow-[0_0_8px_#00FFD1]',
  warning: 'bg-[#ffba26] shadow-[0_0_8px_#ffba26]',
  critical: 'bg-[#ffb4ab] shadow-[0_0_8px_#ffb4ab] animate-pulse',
  inactive: 'bg-gray-600',
};

export function StatusDot({ status, className }: StatusDotProps) {
  return (
    <div
      className={cn(
        'w-2 h-2 rounded-full',
        statusColors[status],
        className
      )}
    />
  );
}
