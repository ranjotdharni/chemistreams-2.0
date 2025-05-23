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

export function isValidUrl(urlString: string): boolean {
    const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
    '(\\#[-a-z\\d_]*)?$','i') // validate fragment locator
    return !!urlPattern.test(urlString)
}

export function extractYoutubeResources(raw: string): string | GenericError {
    try {
        if (raw.trim() === "")
            return { code: CUSTOM_ERROR, message: "Invalid Link" }

        const rawLink = raw.trim()

        if (!isValidUrl(rawLink))
            return { code: CUSTOM_ERROR, message: "Invalid Link" }

        if (rawLink.includes("v=")) {
            // search bar link
            const paramSplit = rawLink.split("?")

            if (paramSplit.length < 2)
                return { code: CUSTOM_ERROR, message: "Invalid Link" }

            const params = paramSplit[1]
            const paramArray = params.split("&")
            const videoParam = paramArray.find(p => p.includes("v="))

            if (!videoParam)
                return { code: CUSTOM_ERROR, message: "Invalid Link" }

            const resourceArray = videoParam.split("=")

            if (resourceArray.length < 2)
                return { code: CUSTOM_ERROR, message: "Invalid Link" }

            return resourceArray[1]
        }
        else {
            // share link
            const paramSplit = rawLink.split("?")
            const resourceSplit = paramSplit[0].split("/")
            const resource = resourceSplit[resourceSplit.length - 1]
            return resource
        }
    }
    catch (_) {
        return { code: CUSTOM_ERROR, message: "Invalid Link" }
    }
}
