// eslint-disable-next-line @typescript-eslint/no-var-requires
const remote = require('@electron/remote/main')

import { BrowserWindow } from "electron"
import { buildRecorderWindowMenu } from "./menu"

declare const RECORDER_WINDOW_WEBPACK_ENTRY: string

export async function createRecorderWindow(): Promise<BrowserWindow> {
  remote.initialize()

  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  const menu = buildRecorderWindowMenu(window)
  
  remote.enable(window.webContents)
  window.setMenu(menu)
  await window.loadURL(RECORDER_WINDOW_WEBPACK_ENTRY)
  return window
}
