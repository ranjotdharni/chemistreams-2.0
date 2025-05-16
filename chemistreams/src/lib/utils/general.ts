import { MAXIMUM_PFP_FILE_SIZE } from "../constants/server"
import { CUSTOM_ERROR, ERRORS, INVALID_PFP_FILE_SIZE_ERROR, INVALID_PFP_FILE_TYPE_ERROR } from "../constants/client"
import { GenericError } from "../types/client"
import { DriveFileType, DriveMimeType } from "../types/server"

export function getFileExt(file: File): string {
    return file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2)
}

export function isValidImageFile(file: File): GenericError | void {
    const allowedTypes = Object.values(DriveFileType)
    const allowedMimeTypes = Object.values(DriveMimeType)

    try {
        const extension = getFileExt(file)

        if (!allowedTypes.includes(extension as DriveFileType) || !allowedMimeTypes.includes(file.type as DriveMimeType))
            return ERRORS[INVALID_PFP_FILE_TYPE_ERROR]

        if ((file.size / (1024 * 1024)) > MAXIMUM_PFP_FILE_SIZE)
            return ERRORS[INVALID_PFP_FILE_SIZE_ERROR]
    }
    catch (error) {
        console.log(error)
        return { code: CUSTOM_ERROR, message: "Could not read image." }
    }
}
