import { google, GoogleApis, youtube_v3 } from 'googleapis'
import fs from 'fs'

export function createAuthenticatedInstanceGoogleApis(token: string): GoogleApis {
    const oAuthClient = new google.auth.OAuth2()

    oAuthClient.setCredentials({
        access_token: token
    })

    google.options({
        auth: oAuthClient
    })

    return google
}

export async function uploadVideo(googleApis: GoogleApis, videoPath: string): Promise<string> {
    const size = fs.statSync(videoPath).size

    const params: youtube_v3.Params$Resource$Videos$Insert = {
        part: ['snippet', 'status'],
        requestBody: {
            snippet: {
                title: 'Screen Recorder',
                description: 'Screen Recorder Upload Test',
                tags: ['Screen Recorder']
            },
            status: {
                privacyStatus: 'unlisted'
            }
        },
        media: {
            body: fs.createReadStream(videoPath)
        }
    }

    const { data } = await googleApis.youtube("v3").videos.insert(params, { onUploadProgress: onUploadProgress })
    console.log(data)

    return `https://youtu.be/${data.id}`

    function onUploadProgress(event: any) {
        const progress = Math.round((event.bytesRead / size) * 100)
        console.log(`Progress: ${progress}%`)
    }
}
