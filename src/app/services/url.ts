import { App, dialog } from 'electron'

export default function urlListener(app: App): void {
  if (process.platform === 'linux') {
    searchUrlinArgv(process.argv)

    app.on('second-instance', (_event, argv) => {
      searchUrlinArgv(argv)
    })
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
