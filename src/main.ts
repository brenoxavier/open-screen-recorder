// eslint-disable-next-line @typescript-eslint/no-var-requires
const remote = require('@electron/remote/main')

import { app, dialog } from "electron"
import { createRecorderWindow } from "./app/pages/recorder/recorder-window"
import { english as messages } from "./lang/languages"

try {
  const isPrimary = app.requestSingleInstanceLock()

  if (isPrimary) {
    app.on('ready', async () => {
      const recorderWindow = await createRecorderWindow()
      
      remote.initialize()
      remote.enable(recorderWindow.webContents)
    })

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
  } else {
    app.quit()
  }
} catch (error) {
  dialog.showErrorBox('Screen Recorder', messages.error.unknownError)
  app.quit()
}
