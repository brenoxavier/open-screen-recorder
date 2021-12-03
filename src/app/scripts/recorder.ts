
import { DesktopCapturerSource } from 'electron'
import { Menu } from '@electron/remote'
import { getAvailableVideoSources, streamVideoSource } from './capture'

import '../styles/global.css'
import '../styles/recorder.css'

const videoPreviewElement = document.querySelector<HTMLVideoElement>('#video-preview')
const selectSourceElement = document.querySelector<HTMLButtonElement>('#select-source')
const toggleAudioElement = document.querySelector<HTMLInputElement>('#toggle-audio')

let currentVideoSource: DesktopCapturerSource
let stream: MediaStream

selectSourceElement.addEventListener('click', async () => {
  const sources = await getAvailableVideoSources();

  const menu = Menu.buildFromTemplate(
    sources.map(source => {
      if (currentVideoSource.id !== source.id) {
        return {
          label: source.name,
          click: () => selectVideoSource(source)
        }
      }
    })
  )

  menu.popup()
})

async function selectVideoSource(source: DesktopCapturerSource) {
  selectSourceElement.innerText = source.name

  stream = await streamVideoSource(source, {
    audio: toggleAudioElement.checked
  })

  currentVideoSource = source
  videoPreviewElement.srcObject = stream
  videoPreviewElement.play()
}

document.addEventListener('DOMContentLoaded', async () => {
  const [source] = await getAvailableVideoSources()
  await selectVideoSource(source)
})
