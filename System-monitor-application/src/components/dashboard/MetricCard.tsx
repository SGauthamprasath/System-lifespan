import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { StatusDot } from '../common/StatusDot';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  type: 'gauge' | 'bar' | 'text';
  percentage?: number;
  metricType?: 'up' | 'down';
}

export function MetricCard({ title, value, unit, status, type, percentage = 0, metricType }: MetricCardProps) {
  let color = '#00FFD1';
  if (status === 'warning') color = '#ffba26';
  if (status === 'critical') color = '#ffb4ab';

  return (
    <GlassCard className="p-4 flex flex-col justify-between h-32 hover:-translate-y-1" glowColor={status === 'healthy' ? 'teal' : status === 'warning' ? 'amber' : 'red'}>
      <div className="flex justify-between items-start">
        <div className="text-gray-400 font-mono text-xs tracking-wider">{title}</div>
        <StatusDot status={status} />
      </div>
      
      <div className="flex items-end justify-between mt-auto">
        <div className="flex items-baseline gap-1">
          {metricType === 'up' && <span className="text-kronos-secondaryLight text-xs">↑</span>}
          {metricType === 'down' && <span className="text-kronos-secondaryLight text-xs">↓</span>}
          <span className="text-2xl font-mono text-white tracking-widest">{value}</span>
          <span className="text-xs font-mono text-gray-500">{unit}</span>
        </div>

        {/* Visualizer */}
        <div className="w-12 h-12 relative flex items-center justify-center">
          {type === 'gauge' && (
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-800"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                strokeWidth="3"
                strokeDasharray={`${percentage}, 100`}
                strokeLinecap="round"
                stroke={color}
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          )}
          {type === 'bar' && (
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mt-6">
              <div 
                className="h-full rounded-full transition-all duration-500" 
                style={{ width: `${percentage}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
              />
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
