import { BrowserWindow, Menu } from "electron"

declare const SETTINGS_PAGE_WEBPACK_ENTRY: string

export function buildRecorderWindowMenu(window: BrowserWindow): Menu {
  return Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Settings',
          click: () => window.loadURL(SETTINGS_PAGE_WEBPACK_ENTRY)
        },
        {
          type: 'separator'
        },
        {
          label: 'Exit',
          role: 'close'
        }
      ]
    },
    {
      label: 'Developer Tools',
      role: 'toggleDevTools'
    }
  ])
}
