const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path');

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
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  if (isDev) mainWindow.webContents.openDevTools();
}

//
// initialize app
//

app.whenReady().then(() => {
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