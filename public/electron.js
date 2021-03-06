const { app, BrowserWindow, Menu, ipcMain, clipboard, shell } = require('electron')
const path = require('path');
const fs = require('fs')
const URL = require('url').URL

//
// config
//

const isDev = require('electron-is-dev');
const isMac = process.platform === 'darwin'
let mainWindow;

function createWindow() {
  const { screen } = require('electron')
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  mainWindow = new BrowserWindow({
    width: width * (2/3), 
    height: height,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true
    }
  });
  mainWindow.menuBarVisible = false;
  mainWindow.loadURL(isDev ? 'http://localhost:3001' : `file://${path.join(__dirname, '../build/index.html')}`);
  if (isDev) mainWindow.webContents.openDevTools();
}

//
// app logic
//

const userDocumentsRoot = path.join(app.getPath('documents'), 'dBranch')

function writeUserDocument(fileName, fileContents) {
  console.log('making dir: ', userDocumentsRoot)
  fs.mkdirSync(userDocumentsRoot, {recursive: true})
  const filePath = path.join(userDocumentsRoot, fileName)
  console.log('writing user document: ', filePath)
  fs.writeFileSync(filePath, fileContents)
}

function listUserDocuments() {
  console.log('listing user documents: ', userDocumentsRoot)
  return fs.readdirSync(userDocumentsRoot)
}

function readUserDocument(fileName) {
  const filePath = path.join(userDocumentsRoot, fileName)
  console.log('reading user document: ', filePath)
  return fs.readFileSync(filePath, {encoding: 'utf8'})
}


//
// initialize app
//

function sourceIsValid(urlString) {
  const url = new URL(urlString)
  return isDev || (url.origin !== 'null' || url.protocol !== 'file:')
}

app.on('web-contents-created', (_, contents) => {
  contents.on('will-navigate', (e, navigationUrl) => {
    if(!sourceIsValid(navigationUrl)) e.preventDefault() 
  })

  contents.setWindowOpenHandler(() => {
    return { action: 'deny' }
  })
})

app.whenReady().then(() => {
  ipcMain.handle('write-user-document', (e, fileName, fileContents) => {
    if(sourceIsValid(e.senderFrame.url)) writeUserDocument(fileName, fileContents)
  })
  ipcMain.handle('list-user-documents', (e) => { 
    if(sourceIsValid(e.senderFrame.url)) return listUserDocuments()
  })
  ipcMain.handle('read-user-document', (e, name) => {
    if(sourceIsValid(e.senderFrame.url)) return readUserDocument(name)
  })
  ipcMain.handle('copy-text', (e, text) => {
    if(sourceIsValid(e.senderFrame.url)) clipboard.writeText(text)
  })
  ipcMain.handle('open-in-browser', (e, url) => {
    if(sourceIsValid(e.senderFrame.url)) shell.openExternal(url)
  })
  createWindow()
  app.on('activate', () => {
      // osx behaviour, when activating app, open a window if none are open
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// quit program when all windows are closed to emulate windows and linux environments (unless in dev mode)
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })

//
// application menu
//

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      {
        click: () => mainWindow.webContents.send('navigate-to', 'settings'),
        label: 'Preferences...',
        accelerator: 'Command+,'
      },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      {
        click: () => mainWindow.webContents.send('navigate-to', '/'),
        label: 'Main'
      },
      {
        click: () => mainWindow.webContents.send('navigate-to', '/edit'),
        label: 'Edit'
      },
      ...(!isMac ? [
        { type: 'separator' },
        {
          click: () => mainWindow.webContents.send('navigate-to', '/settings'),
          label: 'Settings'
        },
      ] : [ ]),
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)