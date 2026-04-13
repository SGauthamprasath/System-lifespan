import { contextBridge, ipcRenderer } from 'electron'
import type { MetricSnapshot } from '../services/metrics'

// ── ML Prediction Types ───────────────────────────────────────────────────────
export interface PredictionInput {
  cpu: number
  memory: number
  disk: number
  processes: number
}

export interface PredictionResult {
  prediction: 'Normal' | 'Anomaly'
  reason: string
}

contextBridge.exposeInMainWorld('electron', {

  windowControls: {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close:    () => ipcRenderer.send('window-close'),
  },

  onMetricsUpdate: (callback: (snapshot: MetricSnapshot) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, snapshot: MetricSnapshot) => {
      callback(snapshot)
    }
    ipcRenderer.on('metrics-update', handler)
    return () => ipcRenderer.removeListener('metrics-update', handler)
  },

  // ── NEW — listen to ML predictions ───────────────────────────────────────
  onPredictionUpdate: (callback: (result: {
  prediction:    string
  reason:        string
  health_score:  number
  health_label:  string
  anomaly_score: number
}) => void) => {
  const handler = (_event: Electron.IpcRendererEvent, result: {
    prediction:    string
    reason:        string
    health_score:  number
    health_label:  string
    anomaly_score: number
  }) => {
    callback(result)
  }
  ipcRenderer.on('prediction-update', handler)
  return () => ipcRenderer.removeListener('prediction-update', handler)
},

  getRecentSnapshots: (): Promise<MetricSnapshot[]> =>
    ipcRenderer.invoke('get-recent-snapshots'),

  getWarnings: () =>
    ipcRenderer.invoke('get-warnings'),

  getPrediction: (metrics: object) =>
    ipcRenderer.invoke('get-prediction', metrics),
})