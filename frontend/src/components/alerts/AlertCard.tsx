import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react';

interface AlertCardProps {
  id: string;
  title: string;
  description: string;
  status: 'critical' | 'warning' | 'resolved';
  timestamp: string;
  onDismiss: (id: string) => void;
}

export function AlertCard({ id, title, description, status, timestamp, onDismiss }: AlertCardProps) {
  const configs = {
    critical: {
      color: '#ffb4ab',
      icon: ShieldAlert,
      glow: 'red' as const,
      borderClass: 'border-l-[#ffb4ab]'
    },
    warning: {
      color: '#ffba26',
      icon: AlertTriangle,
      glow: 'amber' as const,
      borderClass: 'border-l-[#ffba26]'
    },
    resolved: {
      color: '#00FFD1',
      icon: CheckCircle,
      glow: 'teal' as const,
      borderClass: 'border-l-[#00FFD1]'
    }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <GlassCard 
      glowColor={config.glow} 
      hasBrackets={false}
      className={`p-4 flex items-start gap-4 border-l-4 ${config.borderClass} hover:-translate-x-1 hover:translate-y-[-2px]`}
    >
      <div className="mt-1" style={{ color: config.color, filter: `drop-shadow(0 0 8px ${config.color})` }}>
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <h3 className="text-white font-bold tracking-wide" style={{ textShadow: `0 0 5px ${config.color}40` }}>{title}</h3>
        <p className="text-gray-400 text-sm mt-1">{description}</p>
        <div className="font-mono text-xs text-gray-500 mt-3">{timestamp}</div>
      </div>
      <div>
        <button 
          onClick={() => onDismiss(id)}
          className="border border-white/20 text-white/60 hover:text-white hover:border-white/60 hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all"
        >
          {status === 'resolved' ? 'Dismiss' : 'Resolve'}
        </button>
      </div>
    </GlassCard>
  );
}
