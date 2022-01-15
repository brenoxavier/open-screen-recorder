import { ipcMain } from 'electron'
import { createAuthenticatedInstanceGoogleApis, uploadToDrive, uploadToYoutube } from './app/services/google'

export interface UploadVideoEventArgs {
    token: string,
    videoPath: string
}

export function startListeners() {
    uploadVideo()

    function uploadVideo() {
        ipcMain.on('upload-video', async (_event, args: UploadVideoEventArgs) => {
            const google = createAuthenticatedInstanceGoogleApis(args.token)
            const videoUrl = await uploadToDrive(google, args.videoPath)
            console.log(videoUrl)
        })
    }
}
