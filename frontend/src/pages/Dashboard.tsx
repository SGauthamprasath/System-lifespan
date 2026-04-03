import React from 'react';
import { HealthScoreRing } from '../components/dashboard/HealthScoreRing';
import { MetricCard } from '../components/dashboard/MetricCard';
import { useMetricsStore } from '../store/metricsStore';
import { GlassCard } from '../components/common/GlassCard';

export function Dashboard() {
  const { cpuUsage, ramUsage, diskSpace, networkUp, networkDown, activeProcesses } = useMetricsStore();

  return (
    <div className="w-full h-full flex flex-col pt-8">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <HealthScoreRing />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-5 gap-4 mt-12">
        <MetricCard 
          title="CPU USAGE" 
          value={Math.round(cpuUsage)} 
          unit="%" 
          percentage={cpuUsage}
          type="gauge" 
          status={cpuUsage > 85 ? 'critical' : cpuUsage > 60 ? 'warning' : 'healthy'}
        />
        <MetricCard 
          title="RAM USAGE" 
          value={Math.round(ramUsage)} 
          unit="%" 
          percentage={ramUsage}
          type="gauge" 
          status={ramUsage > 85 ? 'critical' : ramUsage > 70 ? 'warning' : 'healthy'}
        />
        <MetricCard 
          title="DISK SPACE" 
          value={diskSpace} 
          unit="GB" 
          percentage={(diskSpace / 512) * 100}
          type="bar" 
          status={diskSpace > 450 ? 'warning' : 'healthy'}
        />
        <MetricCard 
          title="NETWORK" 
          value={Math.round(networkDown)} 
          unit="Mbps" 
          metricType="down"
          type="text" 
          status="healthy"
        />
        <MetricCard 
          title="PROCESSES" 
          value={activeProcesses} 
          unit="Active" 
          type="text" 
          status="healthy"
        />
      </div>

      {/* Recent Alerts Strip */}
      <div className="mt-8 mb-4 flex flex-col gap-2">
        <div className="text-xs font-mono text-gray-500 uppercase tracking-widest pl-2">Recent Alerts</div>
        <div className="flex gap-4">
          {[
            { id: 1, type: 'warning', text: 'Spike in CPU Usage (PID 482)' },
            { id: 2, type: 'critical', text: 'Network dropped parsing packet' },
            { id: 3, type: 'healthy', text: 'System diagnostics clean' }
          ].map((alert) => (
            <GlassCard key={alert.id} hasBrackets={false} className="flex-1 p-3 flex border-l-4 border-l-transparent text-sm"
              style={{ borderLeftColor: alert.type === 'critical' ? '#ffb4ab' : alert.type === 'warning' ? '#ffba26' : '#00FFD1' }}
              glowColor={alert.type as 'teal' | 'amber' | 'red'}
            >
               <span className="font-mono">{alert.text}</span>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
