import type { MetricSnapshot } from '../services/metrics'

interface PredictionInput {
  cpu: number       // will map from cpuLoad
  memory: number    // will map from ramPercent
  disk: number      // will map from diskUsedPercent
  processes: number // will map from topProcesses.length
}

interface PredictionResult {
  prediction:    'Normal' | 'Anomaly'
  reason:        string
  health_score:  number
  health_label:  'Healthy' | 'Fair' | 'Poor' | 'Critical'
  anomaly_score: number
}

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
      getPrediction: (metrics: PredictionInput) => Promise<PredictionResult>
      onPredictionUpdate: (
        callback: (result: {
          prediction:    string
          reason:        string
          health_score:  number
          health_label:  string
          anomaly_score: number
        }) => void
      ) => () => void
    }
  }
}

export {}