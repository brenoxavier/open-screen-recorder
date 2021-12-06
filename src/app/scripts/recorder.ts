
import { DesktopCapturerSource } from 'electron'
import { Menu, MenuItem } from '@electron/remote'
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
  const menuItems = []

  for (const source of sources) {
    if (source) {
      if (currentVideoSource.id !== source.id) {
        menuItems.push(new MenuItem({
          label: source.name,
          click: () => selectVideoSource(source)
        }))
      }
    }
  }

  Menu.buildFromTemplate(menuItems)
    .popup()
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
