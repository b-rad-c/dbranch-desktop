const { contextBridge, ipcRenderer, shell, clipboard } = require('electron')
const path = require('path');

contextBridge.exposeInMainWorld('dBranch', {
  handleNavigateTo: (callback) => ipcRenderer.on('navigate-to', callback),
  listUserDocuments: () => ipcRenderer.invoke('list-user-documents'),
  readUserDocument: (fileName) => ipcRenderer.invoke('read-user-document', fileName),
  writeUserDocument: (fileName, fileContents) => ipcRenderer.invoke('write-user-document', fileName, fileContents),
  openInBrowser: (url) =>  shell.openExternal(url),
  joinPath: path.join,
  copyText: clipboard.writeText
})