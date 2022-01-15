import { drive_v3, google, GoogleApis, youtube_v3 } from 'googleapis'
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

export async function uploadToYoutube(googleApis: GoogleApis, videoPath: string): Promise<string> {
    const file = fs.statSync(videoPath)

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

    const { data } = await googleApis.youtube("v3").videos.insert(params, {
        onUploadProgress: event => onUploadProgress(event, file.size)
    })

    console.log(data)

    return `https://youtu.be/${data.id}`


}

export async function uploadToDrive(googleApis: GoogleApis, filePath: string): Promise<string> {
    const file = fs.statSync(filePath)

    const params: drive_v3.Params$Resource$Files$Create = {
        requestBody: {
            name: 'screen-recorder-test.webm'
        },
        media: {
            body: fs.createReadStream(filePath)
        },
        fields: 'id'
    }

    const { data: driveFileData } = await googleApis.drive("v3").files.create(params, { 
        onUploadProgress: event =>onUploadProgress(event, file.size)
    })

    const permissionsParams: drive_v3.Params$Resource$Permissions$Create = {
        fileId: driveFileData.id,
        requestBody: {
            type: 'anyone',
            role: 'reader'
        }
    }

    await googleApis.drive("v3").permissions.create(permissionsParams)

    return `https://drive.google.com/file/d/${driveFileData.id}/view`
}

function onUploadProgress(event: any, fileSize: number) {
    const progress = Math.round((event.bytesRead / fileSize) * 100)
    console.log(`Progress: ${progress}%`)
}