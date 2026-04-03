import { BrowserWindow, app, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
//#region src/main/main.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var win = null;
function createWindow() {
	win = new BrowserWindow({
		width: 1200,
		height: 800,
		frame: false,
		backgroundColor: "#050508",
		webPreferences: {
			preload: path.join(__dirname, "preload.mjs"),
			nodeIntegration: false,
			contextIsolation: true
		}
	});
	if (process.env.VITE_DEV_SERVER_URL) win.loadURL(process.env.VITE_DEV_SERVER_URL);
	else win.loadFile(path.join(__dirname, "../dist/index.html"));
}
ipcMain.on("window-minimize", (event) => {
	BrowserWindow.fromWebContents(event.sender)?.minimize();
});
ipcMain.on("window-maximize", (event) => {
	const window = BrowserWindow.fromWebContents(event.sender);
	if (window?.isMaximized()) window?.unmaximize();
	else window?.maximize();
});
ipcMain.on("window-close", (event) => {
	BrowserWindow.fromWebContents(event.sender)?.close();
});
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
//#endregion
