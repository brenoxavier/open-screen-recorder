import { desktopCapturer } from '@electron/remote'
import { DesktopCapturerSource } from 'electron'

interface SelectSourceOptions {
  audio: boolean
}

export async function getAvailableVideoSources (): Promise<DesktopCapturerSource[]> {
  return await desktopCapturer.getSources({
    types: ['window', 'screen']
  })
}

export async function streamVideoSource (source: DesktopCapturerSource, options: SelectSourceOptions): Promise<MediaStream> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await (<any> navigator.mediaDevices).getUserMedia({
    audio: options.audio,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id
      }
    }
  })
}