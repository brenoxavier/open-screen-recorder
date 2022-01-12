import { App, dialog, ipcMain } from 'electron'

export default function urlListener(app: App): void {
  switch (process.platform) {
    case 'linux':
      searchUrlinArgv(process.argv)

      app.on('second-instance', (_event, argv) => {
        const url = searchUrlinArgv(argv)
        const token = url.searchParams.get('token')

        saveTokenInRenderedProcess(token)
      })

      break

    case 'darwin':
      app.setAsDefaultProtocolClient('screen-recorder')

      app.on('open-url', (_event, url) => {
        const urlObject = new URL(url)
        const token = urlObject.searchParams.get('token')

        saveTokenInRenderedProcess(token)
      })

      break;
    default:
      break;
  }
}

function searchUrlinArgv(argv: string[]): URL | null {
  argv.forEach(arg => {
    if (/^screen-recorder:\/\/sr\.brenoxavier\.dev\?token=/.test(arg)) {
      dialog.showErrorBox('Screen Recorder', arg)
      return new URL(arg)
    }
  })

  return null
}

function saveTokenInRenderedProcess(url: string) {
  ipcMain.emit('save-token', url)
}
