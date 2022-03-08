const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('dBranch', {
  handleNavigateTo: (callback) => ipcRenderer.on('navigate-to', callback),
  listUserDocuments: () => ipcRenderer.invoke('list-user-documents'),
  writeUserDocument: (fileName, fileContents) => ipcRenderer.invoke('write-user-document', fileName, fileContents)
})