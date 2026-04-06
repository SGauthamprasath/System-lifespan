let electron = require("electron");
//#region src/main/preload.ts
electron.contextBridge.exposeInMainWorld("electron", { windowControls: {
	minimize: () => electron.ipcRenderer.send("window-minimize"),
	maximize: () => electron.ipcRenderer.send("window-maximize"),
	close: () => electron.ipcRenderer.send("window-close")
} });
//#endregion
