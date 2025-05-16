import { getDrive, getNextAvailableDrive } from "./orchestrator"
import { google } from "googleapis"
import { Readable } from "stream"
import { DriveFileType, DriveItem, DriveMimeType, DriveSpaceId } from "../types/server"
import { GenericError } from "../types/client"
import { CUSTOM_ERROR } from "../constants/client"
import { getFileExt } from "../utils/general"

export async function upload(file: File): Promise<DriveItem | GenericError> {
    const driveSpace = getNextAvailableDrive()

    if (!driveSpace)
        return { code: CUSTOM_ERROR, message: "DRIVE SPACE DOES NOT EXIST" } as GenericError

    try {
        const body = Readable.from(Buffer.from(await file.arrayBuffer()))
        const drive = google.drive({ version: "v3", auth: driveSpace.auth })

        const res = await drive.files.create({
            fields: "id, webViewLink",
            requestBody: {
                name: file.name
            },
            media: {
                mimeType: file.type,
                body: body
            },
        })

        if (!res.data.id)
            return { code: CUSTOM_ERROR, message: "FILE ID DOES NOT EXIST" } as GenericError

        await drive.permissions.create({
            fileId: res.data.id,
            requestBody: {
                role: "reader",
                type: "anyone"
            }
        })

        return {
            id: res.data.id,
            space: driveSpace.space,
            mime: file.type as DriveMimeType,
            type: getFileExt(file) as DriveFileType
        } as DriveItem
    }
    catch (error) {
        return { code: CUSTOM_ERROR, message: "Failed to upload file." } as GenericError
    }
}

export async function remove(space: DriveSpaceId, fileId: string): Promise<boolean> {
    const driveSpace = getDrive(space)

    if (!driveSpace)
        return false

    try {
        const drive = google.drive({ version: "v3", auth: driveSpace.auth })

        const res = await drive.files.delete({
            fileId: fileId
        })

        return true
    }
    catch (error) {
        console.log(error)
        return false
    }
}
