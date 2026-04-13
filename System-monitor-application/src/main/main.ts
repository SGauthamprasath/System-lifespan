import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { spawn, ChildProcess } from 'child_process'
import { collectFastMetrics, collectSlowMetrics } from '../services/metrics'
import { snapshotsDB, warningsDB } from './db'

let win: BrowserWindow | null = null
let mlService: ChildProcess | null = null

// ── ML Service ───────────────────────────────────────────────────────────────

function startMLService() {
  // In development → looks for ml-service.exe in resources folder
  // In production  → looks inside packaged app resources
  const mlServicePath = app.isPackaged
    ? path.join(process.resourcesPath, 'ml-service.exe')
    : path.join(__dirname, '../../resources/ml-service.exe')

  try {
    mlService = spawn(mlServicePath, [], {
      detached: false,
      stdio: 'ignore'
    })

    mlService.on('error', (err) => {
      console.error('ML Service failed to start:', err)
    })

    mlService.on('exit', (code) => {
      console.log(`ML Service exited with code ${code}`)
    })

    console.log('✅ ML Service started on port 8000')
  } catch (err) {
    console.error('Could not start ML service:', err)
  }
}

function stopMLService() {
  if (mlService) {
    mlService.kill()
    mlService = null
    console.log('ML Service stopped')
  }
}

// ── Window ───────────────────────────────────────────────────────────────────

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
  if (window) {
    if (window.isMaximized()) { window.unmaximize() } else { window.maximize() }
  }
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
      void win?.webContents.send('metrics-update', {
        ...fast,
      })
    } catch (err) {
      console.error('Fast tick error:', err)
    }
  }, 1000)

  // Slow tier — every 10s (disk, temp, processes, battery)
    setInterval(async () => {
    try {
      const full = await collectSlowMetrics()
      void win?.webContents.send('metrics-update', full)

      dbTickCount++
      if (dbTickCount % 6 === 0) {
        await snapshotsDB.insert(JSON.parse(JSON.stringify(full)))
        console.log('💾 Saved to DB')
      }

      // Send to ML model every 10s
      try {
        const response = await fetch('http://localhost:8000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cpu:       full.cpuLoad,
            memory:    full.ramPercent,
            disk:      full.diskUsedPercent,
            processes: full.topProcesses.length
          })
        })

        if (response.ok) {
          const prediction = await response.json()
          // Send prediction result to frontend
          void win?.webContents.send('prediction-update', prediction)

          // Save warning to DB if anomaly
          if (prediction.prediction === 'Anomaly') {
            await warningsDB.insert({
              timestamp: Date.now(),
              message:   prediction.reason,
              level:     'warning'
            })
          }
        }
      } catch {
        console.log('ML service not ready yet')
      }

    } catch (err) {
      console.error('Slow tick error:', err)
    }
  }, 10000)
}

// ── ML Prediction IPC ────────────────────────────────────────────────────────

ipcMain.handle('get-prediction', async (_event, metrics) => {
  try {
    const response = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metrics)
    })

    if (!response.ok) throw new Error('ML service error')
    return await response.json()

  } catch (err) {
    console.error('Prediction error:', err)
    return { prediction: 'Unknown', reason: 'ML service not available' }
  }
})

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
  startMLService()    // ← start ML service first
  createWindow()
  startCollection()
})

app.on('window-all-closed', () => {
  stopMLService()     // ← kill ML service when app closes
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('before-quit', () => {
  stopMLService()     // ← also kill on quit
})