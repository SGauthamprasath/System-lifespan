import { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { List, Search } from 'lucide-react';

export function ProcessTable() {
  const [filter, setFilter] = useState('');
  const processes = [
    { id: 1, name: 'KRONOS_ENGINE_DAEMON', pid: 8421, cpu: 12.4, ram: 4.2, status: 'running', colorClass: 'bg-kronos-primary' },
    { id: 2, name: 'NEURAL_NET_SCRAPER', pid: 1204, cpu: 8.1, ram: 15.8, status: 'active', colorClass: 'bg-kronos-secondary' },
    { id: 3, name: 'IO_BUFFER_OVERFLOW_V3', pid: 9912, cpu: 0.4, ram: 1.1, status: 'idle', colorClass: 'bg-kronos-warning' },
    { id: 4, name: 'LEGACY_CRON_REPLICATOR', pid: 5523, cpu: 22.8, ram: 0.5, status: 'warning', colorClass: 'bg-kronos-critical' },
    { id: 5, name: 'SECURE_SOCKET_TUNNEL', pid: 4430, cpu: 1.2, ram: 2.9, status: 'running', colorClass: 'bg-kronos-primary' },
  ];

  return (
    <GlassCard className="mt-8 border border-kronos-primary/10 p-8 relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 text-white">
          <List className="text-kronos-primary" size={20} />
          <h2 className="font-display text-lg font-bold tracking-tight uppercase">TOP PROCESSES</h2>
        </div>
        <div className="relative group">
          <input 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#1b1b1f] border-b border-white/20 text-xs font-mono py-2 pl-2 pr-8 focus:outline-none focus:border-kronos-primary transition-all w-64 placeholder:opacity-40 text-white" 
            placeholder="FILTER PROCESSES..." 
            type="text"
          />
          <Search className="absolute right-2 top-2 text-white/40" size={14} />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-4 font-display text-[10px] font-bold uppercase tracking-widest text-kronos-primary/60">PROCESS NAME</th>
              <th className="pb-4 font-display text-[10px] font-bold uppercase tracking-widest text-kronos-primary/60 text-center">PID</th>
              <th className="pb-4 font-display text-[10px] font-bold uppercase tracking-widest text-kronos-primary/60 text-center">CPU%</th>
              <th className="pb-4 font-display text-[10px] font-bold uppercase tracking-widest text-kronos-primary/60 text-center">RAM%</th>
              <th className="pb-4 font-display text-[10px] font-bold uppercase tracking-widest text-kronos-primary/60 text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {processes.filter(p => p.name.toLowerCase().includes(filter.toLowerCase())).map((proc) => (
              <tr key={proc.id} className="hover:bg-kronos-primary/5 transition-colors group cursor-pointer">
                <td className="py-4 flex items-center gap-3">
                  <div className={`w-2 h-2 ${proc.colorClass}`}></div>
                  <span className="font-mono text-sm font-medium text-white">{proc.name}</span>
                </td>
                <td className="py-4 font-mono text-sm text-center text-white/60">{proc.pid}</td>
                <td className="py-4 font-mono text-sm text-center text-kronos-primary">{proc.cpu}</td>
                <td className="py-4 font-mono text-sm text-center text-kronos-secondaryLight">{proc.ram}</td>
                <td className="py-4 text-right">
                  <span className={`text-[9px] font-bold font-display px-2 py-0.5 border uppercase tracking-tighter
                    ${proc.status === 'warning' ? 'border-kronos-critical/40 text-kronos-critical bg-kronos-critical/5' : 
                      proc.status === 'idle' ? 'border-kronos-warning/40 text-kronos-warning bg-kronos-warning/5' : 
                      'border-kronos-primary/40 text-kronos-primary bg-kronos-primary/5'}`}>
                    {proc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-between items-center text-[10px] font-mono opacity-40 text-white">
        <span>TOTAL PROCESSES: 142</span>
        <span>AUTO-REFRESH: 500ms</span>
      </div>
    </GlassCard>
  );
}
