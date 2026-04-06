let electron = require("electron");
//#region src/main/preload.ts
electron.contextBridge.exposeInMainWorld("electron", {
	windowControls: {
		minimize: () => electron.ipcRenderer.send("window-minimize"),
		maximize: () => electron.ipcRenderer.send("window-maximize"),
		close: () => electron.ipcRenderer.send("window-close")
	},
	onMetricsUpdate: (callback) => {
		const handler = (_event, snapshot) => {
			callback(snapshot);
		};
		electron.ipcRenderer.on("metrics-update", handler);
		return () => electron.ipcRenderer.removeListener("metrics-update", handler);
	},
	getRecentSnapshots: () => electron.ipcRenderer.invoke("get-recent-snapshots"),
	getWarnings: () => electron.ipcRenderer.invoke("get-warnings")
});
//#endregion
