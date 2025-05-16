import { JSONClient } from "google-auth-library/build/src/auth/googleauth"
import { Claims } from "next-firebase-auth-edge/lib/auth/claims"
import { GoogleAuth } from "google-auth-library"
import { UserInfo } from "firebase/auth"

export enum DriveMimeType {
    JPEG = "image/jpeg",
    PNG = "image/png", 
    JPG = "image/jpg",
    GIF = "image/gif"
}

export enum DriveFileType {
    JPEG = "jpeg",
    PNG = "png", 
    JPG = "jpg",
    GIF = "gif"
}

export type DriveSpaceId = "s001"

export interface User extends UserInfo {
    emailVerified: boolean
    customClaims: Claims
}

export interface AuthContextValue {
    user: User | null
}

export interface DriveSpaceAccess {
    space: DriveSpaceId
    auth: GoogleAuth<JSONClient>
}

export interface DriveItem {
    space: DriveSpaceId
    type: DriveFileType
    mime: DriveMimeType
    id: string
}
