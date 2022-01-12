import { app, dialog } from "electron"
import { createRecorderWindow } from "./app/pages/recorder/window"
import urlListener from "./app/services/url"
import { english as messages } from "./lang/languages"

try {
  const isPrimary = app.requestSingleInstanceLock()

  if (isPrimary) {
    app.on('ready', async () => {
      const recorderWindow = await createRecorderWindow()
      urlListener(app, recorderWindow)
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
