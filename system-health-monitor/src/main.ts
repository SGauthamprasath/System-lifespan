import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { collectMetrics } from './services/metrics';
import { snapshotsDB, warningsDB } from './db';

if (started) app.quit();

let mainWindow: BrowserWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  mainWindow.webContents.openDevTools();
};

let secondsCount = 0;

function startCollection() {
  setInterval(async () => {
    try {
      const snapshot = await collectMetrics();
      console.log('📊 Snapshot:', snapshot);

      // Always push live to frontend
      mainWindow?.webContents.send('metrics-update', snapshot);

      // Save to DB every 1 minute (every 12th tick)
      secondsCount++;
      if (secondsCount % 12 === 0) {
        await snapshotsDB.insert(snapshot);
        console.log('💾 Saved to DB');
      }

    } catch (err) {
      console.error('❌ Error:', err);
    }
  }, 5000);
}

// IPC Handlers
ipcMain.handle('get-recent-snapshots', async () => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  return await snapshotsDB.find({ timestamp: { $gt: oneHourAgo } });
});

ipcMain.handle('get-warnings', async () => {
  return await warningsDB.find({}).sort({ timestamp: -1 }).limit(50);
});

app.on('ready', () => {
  createWindow();
  startCollection();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});