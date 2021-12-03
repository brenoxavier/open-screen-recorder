// eslint-disable-next-line @typescript-eslint/no-var-requires
const remote = require('@electron/remote/main')

import { app, BrowserWindow } from 'electron'

declare const RECORDER_WINDOW_WEBPACK_ENTRY: string

if (require('electron-squirrel-startup')) {
  app.quit()
}

const createWindow = (): void => {
  remote.initialize()

  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    resizable: false,
    fullscreenable: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  remote.enable(mainWindow.webContents)
  mainWindow.loadURL(RECORDER_WINDOW_WEBPACK_ENTRY)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
