import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { collectFastMetrics, collectSlowMetrics } from '../services/metrics'
import { snapshotsDB, warningsDB } from './db'

let win: BrowserWindow | null = null
let secondsCount = 0

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    backgroundColor: '#050508',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

// ── Window Controls ──────────────────────────────────────────────────────────

ipcMain.on('window-minimize', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.minimize()
})

ipcMain.on('window-maximize', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  window?.isMaximized() ? window.unmaximize() : window.maximize()
})

ipcMain.on('window-close', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.close()
})

// ── Metrics Collection ───────────────────────────────────────────────────────

function startCollection() {
  let dbTickCount = 0

  // Fast tier — every 1s (cpu, ram, network only)
  setInterval(async () => {
    try {
      const fast = await collectFastMetrics()
      win?.webContents.send('metrics-update', {
        ...fast,
        // slow fields will be sent on slow ticks — renderer keeps last value
      })
    } catch (err) {
      console.error('Fast tick error:', err)
    }
  }, 1000)

  // Slow tier — every 10s (disk, temp, processes, battery)
  setInterval(async () => {
    try {         // updates the cache inside metrics.ts
      const full = await collectSlowMetrics()    // fast + cached slow merged
      win?.webContents.send('metrics-update', full)

      dbTickCount++
      if (dbTickCount % 6 === 0) {         // save to DB every 60s (6 × 10s)
        await snapshotsDB.insert(full)
        console.log('💾 Saved to DB')
      }
    } catch (err) {
      console.error('Slow tick error:', err)
    }
  }, 10000)
}

// ── IPC Handlers ─────────────────────────────────────────────────────────────

ipcMain.handle('get-recent-snapshots', async () => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000
  return await snapshotsDB.find({ timestamp: { $gt: oneHourAgo } })
})

ipcMain.handle('get-warnings', async () => {
  return await warningsDB.find({}).sort({ timestamp: -1 }).limit(50)
})

// ── App Lifecycle ─────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  createWindow()
  startCollection()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})