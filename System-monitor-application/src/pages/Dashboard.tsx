import { HealthScoreRing } from '../components/dashboard/HealthScoreRing';
import { MetricCard } from '../components/dashboard/MetricCard';
import { GlassCard } from '../components/common/GlassCard';
import { useMetrics } from '../context/Usemetrics';

export function Dashboard() {
  const { current } = useMetrics();

  // "current" is null for the first 5 seconds before the first IPC push.
  // Show zeros gracefully rather than crashing or rendering nothing.
  const cpu     = current?.cpuLoad         ?? 0
  const ram     = current?.ramPercent      ?? 0
  const disk    = current?.diskUsedPercent ?? 0
  const netUp   = current?.netUpload       ?? 0
  const netDown = current?.netDownload     ?? 0
  const topProc = current?.topProcesses?.[0]?.name ?? '—'
  const temp    = current?.cpuTemp         ?? 0

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
          value={Math.round(cpu)}
          unit="%"
          percentage={cpu}
          type="gauge"
          status={cpu > 85 ? 'critical' : cpu > 60 ? 'warning' : 'healthy'}
        />
        <MetricCard
          title="RAM USAGE"
          value={Math.round(ram)}
          unit="%"
          percentage={ram}
          type="gauge"
          status={ram > 85 ? 'critical' : ram > 70 ? 'warning' : 'healthy'}
        />
        <MetricCard
          title="DISK USED"
          value={Math.round(disk)}
          unit="%"
          percentage={disk}
          type="bar"
          status={disk > 90 ? 'critical' : disk > 75 ? 'warning' : 'healthy'}
        />
        <MetricCard
          title="NETWORK ↓"
          value={netDown}
          unit="Mbps"
          type="text"
          status="healthy"
        />
        <MetricCard
          title="TOP PROCESS"
          value={topProc}
          unit=""
          type="text"
          status={cpu > 85 ? 'critical' : 'healthy'}
        />
      </div>

      {/* Recent Alerts Strip */}
      <div className="mt-8 mb-4 flex flex-col gap-2">
        <div className="text-xs font-mono text-gray-500 uppercase tracking-widest pl-2">
          Live Stats
        </div>
        <div className="flex gap-4">
          <GlassCard
            hasBrackets={false}
            className="flex-1 p-3 flex border-l-4 border-l-transparent text-sm"
            style={{ borderLeftColor: temp > 85 ? '#ffb4ab' : '#00FFD1' }}
            glowColor={temp > 85 ? 'red' : 'teal'}
          >
            <span className="font-mono">CPU Temp: {temp}°C</span>
          </GlassCard>
          <GlassCard
            hasBrackets={false}
            className="flex-1 p-3 flex border-l-4 border-l-transparent text-sm"
            style={{ borderLeftColor: '#ffba26' }}
            glowColor="amber"
          >
            <span className="font-mono">Upload: {netUp} Mbps</span>
          </GlassCard>
          <GlassCard
            hasBrackets={false}
            className="flex-1 p-3 flex border-l-4 border-l-transparent text-sm"
            style={{ borderLeftColor: '#00FFD1' }}
            glowColor="teal"
          >
            <span className="font-mono">
              {current ? `Last update: ${new Date(current.timestamp).toLocaleTimeString()}` : 'Waiting for data…'}
            </span>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}