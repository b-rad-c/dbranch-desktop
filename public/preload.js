const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('dBranch', {
  handleNavigate: (callback) => ipcRenderer.on('navigate', callback)
})