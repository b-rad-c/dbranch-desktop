const { contextBridge, ipcRenderer, shell } = require('electron')

contextBridge.exposeInMainWorld('dBranch', {
  handleNavigateTo: (callback) => ipcRenderer.on('navigate-to', callback),
  listUserDocuments: () => ipcRenderer.invoke('list-user-documents'),
  readUserDocument: (fileName) => ipcRenderer.invoke('read-user-document', fileName),
  writeUserDocument: (fileName, fileContents) => ipcRenderer.invoke('write-user-document', fileName, fileContents),
  openInBrowser: (url) =>  ipcRenderer.invoke('open-in-browser', url),
  copyText: (text) => ipcRenderer.invoke('copy-text', text)
})