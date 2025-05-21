import { CUSTOM_ERROR, ERRORS, INVALID_FILE_SIZE_ERROR, INVALID_FILE_TYPE_ERROR } from "../constants/client"
import { DriveFileType, DriveMimeType } from "../types/server"
import { GenericError } from "../types/client"

export function getFileExt(file: File): string {
    return file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2)
}

export function isValidFile(file: File, maxSizeMb: number): GenericError | void {
    const allowedTypes = Object.values(DriveFileType)
    const allowedMimeTypes = Object.values(DriveMimeType)

    try {
        const extension = getFileExt(file)

        if (!allowedTypes.includes(extension as DriveFileType) || !allowedMimeTypes.includes(file.type as DriveMimeType))
            return ERRORS[INVALID_FILE_TYPE_ERROR]

        if ((file.size / (1024 * 1024)) > maxSizeMb)
            return ERRORS[INVALID_FILE_SIZE_ERROR]
    }
    catch (error) {
        console.log(error)
        return { code: CUSTOM_ERROR, message: "Could not read file." }
    }
}

export function generateCloudUrl(fileId: string): string {
    return `https://drive.google.com/uc?export=view&id=${fileId}`
}
