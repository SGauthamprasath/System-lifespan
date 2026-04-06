import React from 'react';
import { LiveGraph } from '../components/metrics/LiveGraph';
import { ProcessTable } from '../components/metrics/ProcessTable';
import { useMetrics } from '../context/MetricsContext';

export function Metrics() {
  const { current, history } = useMetrics();

  const cpu     = current?.cpuLoad         ?? 0
  const ram     = current?.ramPercent      ?? 0
  const netUp   = current?.netUpload       ?? 0
  const netDown = current?.netDownload     ?? 0

  // Derive a pseudo disk I/O value from history variance for the graph.
  // Replace this with a real si.disksIO() call in collectMetrics() when ready.
  const diskIO = history.length > 1
    ? Math.abs(
        (history[history.length - 1]?.diskUsedPercent ?? 0) -
        (history[history.length - 2]?.diskUsedPercent ?? 0)
      ) * 120
    : 0

  return (
    <div className="w-full h-full flex flex-col p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-8 w-full">
        <LiveGraph
          title="CPU USAGE (60s)"
          dataValue={cpu}
          unit="%"
          color="#00FFD1"
        />
        <LiveGraph
          title="RAM USAGE (60s)"
          dataValue={ram}
          unit="%"
          color="#7B61FF"
        />
        <LiveGraph
          title="DISK I/O"
          dataValue={diskIO}
          unit="MB/s"
          color="#ffba26"
        />
        <LiveGraph
          title="NETWORK SPEED (UP/DOWN)"
          dataValue={netUp}
          dataValue2={netDown}
          unit="Mbps"
          color="#00FFD1"
          color2="#7B61FF"
        />
      </div>

      <ProcessTable />
    </div>
  );
}