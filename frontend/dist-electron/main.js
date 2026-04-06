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
//#region src/services/metrics.ts
async function collectMetrics() {
	const [cpu, mem, temp, disk, network, battery, processes] = await Promise.all([
		systeminformation.default.currentLoad(),
		systeminformation.default.mem(),
		systeminformation.default.cpuTemperature(),
		systeminformation.default.fsSize(),
		systeminformation.default.networkStats(),
		systeminformation.default.battery(),
		systeminformation.default.processes()
	]);
	const topCPUProcess = processes.list.sort((a, b) => b.cpu - a.cpu)[0]?.name || "unknown";
	return {
		timestamp: Date.now(),
		cpuLoad: parseFloat(cpu.currentLoad.toFixed(2)),
		ramPercent: parseFloat((mem.used / mem.total * 100).toFixed(2)),
		cpuTemp: temp.main ?? 0,
		diskUsedPercent: parseFloat(disk[0]?.use?.toFixed(2) ?? "0"),
		netUpload: parseFloat(((network[0]?.tx_sec ?? 0) / 1024 / 1024).toFixed(2)),
		netDownload: parseFloat(((network[0]?.rx_sec ?? 0) / 1024 / 1024).toFixed(2)),
		topCPUProcess,
		batteryPercent: battery.percent ?? 100
	};
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
var secondsCount = 0;
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
	setInterval(async () => {
		try {
			const snapshot = await collectMetrics();
			console.log("📊 Snapshot:", snapshot);
			win?.webContents.send("metrics-update", snapshot);
			secondsCount++;
			if (secondsCount % 12 === 0) {
				await snapshotsDB.insert(snapshot);
				console.log("💾 Saved to DB");
			}
		} catch (err) {
			console.error("❌ Error:", err);
		}
	}, 5e3);
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
