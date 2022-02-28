const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('dBranch', {
  handleNavigateTo: (callback) => ipcRenderer.on('navigate-to', callback)
})