const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  handleOpenTab: (callback) => ipcRenderer.on('open-tab', callback)
})