import si from 'systeminformation';

export interface MetricSnapshot {
  timestamp: number;
  cpuLoad: number;
  ramPercent: number;
  cpuTemp: number;
  diskUsedPercent: number;
  netUpload: number;
  netDownload: number;
  topCPUProcess: string;
  batteryPercent: number;
}

export async function collectMetrics(): Promise<MetricSnapshot> {
  const [cpu, mem, temp, disk, network, battery, processes] = await Promise.all([
    si.currentLoad(),
    si.mem(),
    si.cpuTemperature(),
    si.fsSize(),
    si.networkStats(),
    si.battery(),
    si.processes()
  ]);

  const topCPUProcess = processes.list
    .sort((a, b) => b.cpu - a.cpu)[0]?.name || 'unknown';

  return {
    timestamp: Date.now(),
    cpuLoad: parseFloat(cpu.currentLoad.toFixed(2)),
    ramPercent: parseFloat(((mem.used / mem.total) * 100).toFixed(2)),
    cpuTemp: temp.main ?? 0,
    diskUsedPercent: parseFloat(disk[0]?.use?.toFixed(2) ?? '0'),
    netUpload: parseFloat(((network[0]?.tx_sec ?? 0) / 1024 / 1024).toFixed(2)),
    netDownload: parseFloat(((network[0]?.rx_sec ?? 0) / 1024 / 1024).toFixed(2)),
    topCPUProcess,
    batteryPercent: battery.percent ?? 100
  };
}