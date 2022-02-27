const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('dBranch', {
    toggleSettings: (callback) => ipcRenderer.on('toggle-settings', callback),
    showMainPage: (callback) => ipcRenderer.on('show-main-page', callback),
    showOtherPage: (callback) => ipcRenderer.on('show-other-page', callback)
})