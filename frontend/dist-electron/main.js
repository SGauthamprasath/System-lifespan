//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let electron = require("electron");
let path = require("path");
path = __toESM(path);
let systeminformation = require("systeminformation");
systeminformation = __toESM(systeminformation);
let nedb_promises = require("nedb-promises");
nedb_promises = __toESM(nedb_promises);
let node_path = require("node:path");
node_path = __toESM(node_path);
async function collectFastMetrics() {
	const [cpu, mem, network] = await Promise.all([
		systeminformation.default.currentLoad(),
		systeminformation.default.mem(),
		systeminformation.default.networkStats()
	]);
	return {
		timestamp: Date.now(),
		cpuLoad: parseFloat(cpu.currentLoad.toFixed(2)),
		ramPercent: parseFloat((mem.used / mem.total * 100).toFixed(2)),
		netUpload: parseFloat(((network[0]?.tx_sec ?? 0) / 1024 / 1024).toFixed(2)),
		netDownload: parseFloat(((network[0]?.rx_sec ?? 0) / 1024 / 1024).toFixed(2))
	};
}
async function collectSlowMetrics() {
	const [temp, disk, battery, processes] = await Promise.all([
		systeminformation.default.cpuTemperature(),
		systeminformation.default.fsSize(),
		systeminformation.default.battery(),
		systeminformation.default.processes()
	]);
	const io = await systeminformation.default.disksIO().catch(() => null);
	temp.main, parseFloat(disk[0]?.use?.toFixed(2) ?? "0"), parseFloat(((io?.rIO_sec ?? 0) / 1024 / 1024).toFixed(2)), parseFloat(((io?.wIO_sec ?? 0) / 1024 / 1024).toFixed(2)), processes.list.filter((p) => p != null && p.pid != null && p.name != null).sort((a, b) => (b.cpu ?? 0) - (a.cpu ?? 0)).slice(0, 5).map((p) => ({
		name: p.name ?? "unknown",
		cpu: parseFloat((p.cpu ?? 0).toFixed(1)),
		pid: p.pid
	})), battery.percent;
}
//#endregion
//#region src/main/db.ts
var userDataPath = electron.app.getPath("userData");
var snapshotsDB = nedb_promises.default.create({
	filename: node_path.default.join(userDataPath, "snapshots.db"),
	autoload: true
});
var warningsDB = nedb_promises.default.create({
	filename: node_path.default.join(userDataPath, "warnings.db"),
	autoload: true
});
nedb_promises.default.create({
	filename: node_path.default.join(userDataPath, "summary.db"),
	autoload: true
});
console.log("✅ DB initialized at", userDataPath);
//#endregion
//#region src/main/main.ts
var win = null;
function createWindow() {
	win = new electron.BrowserWindow({
		width: 1200,
		height: 800,
		frame: false,
		backgroundColor: "#050508",
		webPreferences: {
			preload: path.default.join(__dirname, "preload.js"),
			nodeIntegration: false,
			contextIsolation: true
		}
	});
	if (process.env.VITE_DEV_SERVER_URL) win.loadURL(process.env.VITE_DEV_SERVER_URL);
	else win.loadFile(path.default.join(__dirname, "../dist/index.html"));
}
electron.ipcMain.on("window-minimize", (event) => {
	electron.BrowserWindow.fromWebContents(event.sender)?.minimize();
});
electron.ipcMain.on("window-maximize", (event) => {
	const window = electron.BrowserWindow.fromWebContents(event.sender);
	window?.isMaximized() ? window.unmaximize() : window.maximize();
});
electron.ipcMain.on("window-close", (event) => {
	electron.BrowserWindow.fromWebContents(event.sender)?.close();
});
function startCollection() {
	let dbTickCount = 0;
	setInterval(async () => {
		try {
			const fast = await collectFastMetrics();
			win?.webContents.send("metrics-update", { ...fast });
		} catch (err) {
			console.error("Fast tick error:", err);
		}
	}, 1e3);
	setInterval(async () => {
		try {
			const full = await collectSlowMetrics();
			win?.webContents.send("metrics-update", full);
			dbTickCount++;
			if (dbTickCount % 6 === 0) {
				await snapshotsDB.insert(full);
				console.log("💾 Saved to DB");
			}
		} catch (err) {
			console.error("Slow tick error:", err);
		}
	}, 1e4);
}
electron.ipcMain.handle("get-recent-snapshots", async () => {
	const oneHourAgo = Date.now() - 3600 * 1e3;
	return await snapshotsDB.find({ timestamp: { $gt: oneHourAgo } });
});
electron.ipcMain.handle("get-warnings", async () => {
	return await warningsDB.find({}).sort({ timestamp: -1 }).limit(50);
});
electron.app.whenReady().then(() => {
	createWindow();
	startCollection();
});
electron.app.on("window-all-closed", () => {
	if (process.platform !== "darwin") electron.app.quit();
});
electron.app.on("activate", () => {
	if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
});
//#endregion
