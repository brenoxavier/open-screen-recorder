/* eslint-disable import/no-unresolved */

import { DesktopCapturerSource, ipcRenderer } from 'electron'
import { app, dialog, Menu, MenuItem, Notification } from '@electron/remote'
import { getAvailableVideoSources, streamVideoSource } from '../../services/capture'
import { writeFile } from 'original-fs'

import '../global.css'
import './page.css'

const videoPreviewElement = document.querySelector<HTMLVideoElement>('#video-preview')
const toggleRecorderElement = document.querySelector<HTMLButtonElement>('#toggle-recorder')
const selectSourceElement = document.querySelector<HTMLButtonElement>('#select-source')
const toggleAudioElement = document.querySelector<HTMLInputElement>('#toggle-audio')

let currentVideoSource: DesktopCapturerSource
let stream: MediaStream
let mediaRecorder: MediaRecorder
let recording = false
let mediaRecordedChunks: BlobPart[] = []

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

toggleRecorderElement.addEventListener('click', () => {
  recording = !recording

  if (recording) {
    toggleRecorderElement.innerText = 'Recording'
    selectSourceElement.disabled = true

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm; codeds=vp9'
    })

    mediaRecorder.ondataavailable = recordingDataAvailable
    mediaRecorder.onstop = saveRecording

    mediaRecorder.start()
  } else {
    toggleRecorderElement.innerText = 'Start Recorder'
    selectSourceElement.disabled = false

    mediaRecorder.stop()
  }
})

async function recordingDataAvailable(event: BlobEvent) {
  mediaRecordedChunks = [event.data]
}

async function saveRecording() {
  const blob = new Blob(mediaRecordedChunks, {
    type: 'video/webm; codecs=vp9'
  })

  const buffer = Buffer.from(await blob.arrayBuffer())

  writeFile(`${app.getPath('videos')}/vid-${Date.now()}.webm`, buffer, () => {
    new Notification({
      title: 'Screen Recorder',
      body: 'Video saved successfully!'
    }).show()
  })
}

document.addEventListener('DOMContentLoaded', async () => {
  const [source] = await getAvailableVideoSources()
  await selectVideoSource(source)
})

ipcRenderer.on('save-token', (_event, args) => {
  localStorage.setItem('token', args)
  
  dialog.showMessageBox({
    title: 'Screen Recorder',
    message: 'Screen Recorder',
    detail: 'Authentication performed successfully!',
    type: 'info'
  })
})
