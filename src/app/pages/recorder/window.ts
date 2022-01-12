import { BrowserWindow } from "electron"
import { setRecorderMenu } from "./menu"

declare const RECORDER_WINDOW_WEBPACK_ENTRY: string

export async function createRecorderWindow(): Promise<BrowserWindow> {
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  setRecorderMenu()
  await window.loadURL(RECORDER_WINDOW_WEBPACK_ENTRY)
  window.webContents.openDevTools()
  return window
}
