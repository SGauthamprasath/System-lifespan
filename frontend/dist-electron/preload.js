import { contextBridge, ipcRenderer } from "electron";
//#region src/main/preload.ts
contextBridge.exposeInMainWorld("electron", { windowControls: {
	minimize: () => ipcRenderer.send("window-minimize"),
	maximize: () => ipcRenderer.send("window-maximize"),
	close: () => ipcRenderer.send("window-close")
} });
//#endregion
