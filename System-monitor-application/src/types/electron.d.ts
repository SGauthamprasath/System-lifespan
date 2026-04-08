import type { MetricSnapshot } from '../services/metrics'

declare global {
  interface Window {
    electron: {
      windowControls: {
        minimize: () => void
        maximize: () => void
        close:    () => void
      }
      onMetricsUpdate: (callback: (snapshot: MetricSnapshot) => void) => () => void
      getRecentSnapshots: () => Promise<MetricSnapshot[]>
      getWarnings: () => Promise<{ timestamp: number; message: string; level: string }[]>
    }
  }
}

export {}