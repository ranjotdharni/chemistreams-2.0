import { DriveSpaceAccess, DriveSpaceId } from "../types/server"
import { google } from "googleapis"

const DRIVE_COUNT: number = 1
let nextAvailableDriveCode: number = 1

const service001 = new google.auth.GoogleAuth({
    keyFile: `${process.cwd()}/drive/001/space001.json`,
    scopes: ["https://www.googleapis.com/auth/drive"]
})

const spaces: Record<DriveSpaceId, DriveSpaceAccess> = {
    s001: {
        space: "s001",
        auth: service001
    }
}

export function getNextAvailableDrive(): DriveSpaceAccess  {
    const next: DriveSpaceId = `s00${nextAvailableDriveCode}` as DriveSpaceId

    if (nextAvailableDriveCode === DRIVE_COUNT)
        nextAvailableDriveCode = 1
    else
        nextAvailableDriveCode++

    return spaces[next]
}

export function getDrive(space: DriveSpaceId) {
    return spaces[space]
}
