import { contextBridge, ipcRenderer } from 'electron'
import type { MetricSnapshot } from '../services/metrics'

contextBridge.exposeInMainWorld('electron', {

  // ── Window Controls ──────────────────────────────────────────────────────
  windowControls: {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close:    () => ipcRenderer.send('window-close'),
  },

  // ── Live metrics (push from main.ts every 5s) ────────────────────────────
  // Returns an unsubscribe fn — call it in useEffect cleanup to avoid leaks
  onMetricsUpdate: (callback: (snapshot: MetricSnapshot) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, snapshot: MetricSnapshot) => {
      callback(snapshot)
    }
    ipcRenderer.on('metrics-update', handler)
    return () => ipcRenderer.removeListener('metrics-update', handler)
  },

  // ── Historical snapshots (last 1 hour from NeDB) ─────────────────────────
  getRecentSnapshots: (): Promise<MetricSnapshot[]> =>
    ipcRenderer.invoke('get-recent-snapshots'),

  // ── Warnings log ─────────────────────────────────────────────────────────
  getWarnings: (): Promise<{ timestamp: number; message: string; level: string }[]> =>
    ipcRenderer.invoke('get-warnings'),
})