import { useState } from 'react';
import { FilterTabs } from '../components/alerts/FilterTabs';
import { AlertCard } from '../components/alerts/AlertCard';
import { ShieldCheck } from 'lucide-react';

const mockAlerts = [
  { id: '1', title: 'Kernel Panic Prevented', description: 'Anomaly detected in memory allocation. Routine isolated successfully.', status: 'resolved' as const, timestamp: '14:23:01 2026-04-03' },
  { id: '2', title: 'Thermal Threshold Near', description: 'CPU temperature exceeding 85°C. Cooling fan speed increased to maximum.', status: 'warning' as const, timestamp: '14:15:33 2026-04-03' },
  { id: '3', title: 'Unauthorized Execution Attempt', description: 'Blocked untrusted binary svchost.dll in temp directory.', status: 'critical' as const, timestamp: '13:59:12 2026-04-03' },
  { id: '4', title: 'Disk I/O Bottleneck', description: 'Read latency above 500ms on Drive C:', status: 'warning' as const, timestamp: '12:05:00 2026-04-03' },
];

export function Alerts() {
  const [filter, setFilter] = useState('All');
  const [alerts, setAlerts] = useState(mockAlerts);

  const handleDismiss = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'All') return true;
    if (filter === 'Warnings') return alert.status === 'warning';
    if (filter === 'Critical') return alert.status === 'critical';
    if (filter === 'Resolved') return alert.status === 'resolved';
    return true;
  });

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-display text-white">Alerts & Warnings</h2>
        <FilterTabs activeTab={filter} onTabChange={setFilter} />
      </div>

      <div className="flex-1 overflow-y-auto pr-4 space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} {...alert} onDismiss={handleDismiss} />
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-50 space-y-4">
            <ShieldCheck size={64} className="text-kronos-primary drop-shadow-[0_0_15px_rgba(0,255,209,0.5)]" />
            <div className="text-kronos-primary font-mono tracking-widest text-lg">All systems normal. Kronos is watching.</div>
          </div>
        )}
      </div>
    </div>
  );
}
