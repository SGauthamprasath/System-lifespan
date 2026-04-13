import si from 'systeminformation'

export interface MetricSnapshot {
  timestamp:      number
  cpuLoad:        number
  ramPercent:     number
  netUpload:      number
  netDownload:    number
  // Slow fields — only updated every 10s, carry last known value between ticks
  cpuTemp:        number
  diskUsedPercent: number
  diskRead:       number   // MB/s  ← real I/O now
  diskWrite:      number   // MB/s
  topProcesses:   { name: string; cpu: number; pid: number }[]
  batteryPercent: number
}

// Cached slow values — updated every 10s, reused on fast ticks
let slowCache = {
  cpuTemp:         0,
  diskUsedPercent: 0,
  diskRead:        0,
  diskWrite:       0,
  topProcesses:    [] as { name: string; cpu: number; pid: number }[],
  batteryPercent:  100,
}

export async function collectFastMetrics(): Promise<Pick<MetricSnapshot,
  'timestamp' | 'cpuLoad' | 'ramPercent' | 'netUpload' | 'netDownload'
>> {
  const [cpu, mem, network] = await Promise.all([
    si.currentLoad(),
    si.mem(),
    si.networkStats(),
  ])

  return {
    timestamp:   Date.now(),
    cpuLoad:     parseFloat(cpu.currentLoad.toFixed(2)),
    ramPercent:  parseFloat(((mem.used / mem.total) * 100).toFixed(2)),
    netUpload:   parseFloat(((network[0]?.tx_sec ?? 0) / 1024 / 1024).toFixed(2)),
    netDownload: parseFloat(((network[0]?.rx_sec ?? 0) / 1024 / 1024).toFixed(2)),
  }
}

export async function collectSlowMetrics(): Promise<MetricSnapshot> {
  const [temp, disk, battery, processes] = await Promise.all([
    si.cpuTemperature(),
    si.fsSize(),
    si.battery(),
    si.processes(),
  ])

  const io = await si.disksIO().catch(() => null)

  slowCache = {
    cpuTemp:         temp.main ?? 0,
    diskUsedPercent: parseFloat(disk[0]?.use?.toFixed(2) ?? '0'),
    diskRead:  parseFloat((((io?.rIO_sec ?? 0) / 1024 / 1024)).toFixed(2)),
    diskWrite: parseFloat((((io?.wIO_sec ?? 0) / 1024 / 1024)).toFixed(2)),
    topProcesses: processes.list
      .filter(p => p != null && p.pid != null && p.name != null)
      .sort((a, b) => (b.cpu ?? 0) - (a.cpu ?? 0))
      .slice(0, 5)
      .map(p => ({
        name:  p.name  ?? 'unknown',
        cpu:   parseFloat((p.cpu ?? 0).toFixed(1)),
        pid:   p.pid,
      })),
    batteryPercent: battery.percent ?? 100,
  }

  // Return full snapshot
  const fast = await collectFastMetrics()
  return { ...fast, ...slowCache }
}

// Merges fast + cached slow into a full snapshot
export async function collectMetrics(): Promise<MetricSnapshot> {
  const fast = await collectFastMetrics()
  return { ...fast, ...slowCache }
}