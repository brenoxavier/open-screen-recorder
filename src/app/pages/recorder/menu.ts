import { Menu } from "electron"

export function setRecorderMenu(): Menu {
  return Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Settings',
          submenu: [
            {
              label: 'Google Account'
            }
          ]
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
