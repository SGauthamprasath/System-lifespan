import React from 'react';
import { useMetricsStore } from '../store/metricsStore';
import { LiveGraph } from '../components/metrics/LiveGraph';
import { ProcessTable } from '../components/metrics/ProcessTable';
import { StatusDot } from '../components/common/StatusDot';

export function Metrics() {
  const { cpuUsage, ramUsage, diskSpace, networkUp, networkDown } = useMetricsStore();

  return (
    <div className="w-full h-full flex flex-col p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-8 w-full">
        <LiveGraph 
          title="CPU USAGE (60s)" 
          dataValue={cpuUsage} 
          unit="%" 
          color="#00FFD1"
        />
        <LiveGraph 
          title="RAM USAGE (60s)" 
          dataValue={ramUsage} 
          unit="%" 
          color="#7B61FF"
        />
        <LiveGraph 
          title="DISK I/O" 
          dataValue={(diskSpace % 10) * 12} // Mocking I/O fluctuations
          unit="MB/s" 
          color="#ffba26"
        />
        <LiveGraph 
          title="NETWORK SPEED (UP/DOWN)" 
          dataValue={networkUp}
          dataValue2={networkDown} 
          unit="Mbps" 
          color="#00FFD1"
          color2="#7B61FF"
        />
      </div>

      <ProcessTable />
    </div>
  );
}
