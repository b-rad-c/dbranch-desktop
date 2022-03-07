const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('dBranch', {
  handleNavigateTo: (callback) => ipcRenderer.on('navigate-to', callback),
  writeUserDocument: (fileName, fileContents) => ipcRenderer.invoke('write-user-document', fileName, fileContents)
})