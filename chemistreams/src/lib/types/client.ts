import { AnimationCode, BadgeCode } from "../constants/client"
import { DriveSpaceId } from "./server"

export interface InterfaceContextValue {
    toggleTheme: () => void
    setText: (text: string, color?: string) => void
    setProfileView: (currentUserId: string, profile: ReadOnlyProfile, setCurrentChat: (chat: ChatMetaData) => void, direct?: ChatMetaData) => void
}

export interface GenericError {
    code: string
    message: string
}

export interface ChatMetaData {
    id: string
    creator: string
    name: string
}

export interface DirectChatMetaData extends ChatMetaData {
    to: string
    username: string
    status: string
    pfp: {
        space?: string
        link: string
    }
    badge?: {
        badgeCode: BadgeCode,
        animationCode: AnimationCode
    }
}

export interface GroupChatMetaData extends ChatMetaData {
    isGroup: true
    members: GroupMember[]
}

export interface ChatMessage {
    id: string
    sender: string
    type: number
    content?: string
    added?: string
    removed?: string
    fileId?: string
    link?: string
    space?: DriveSpaceId
    timestamp: Date
}

export interface GroupMember {
    id: string
    name: string
    username: string
    status: string
    pfp: {
        space?: string
        link: string
    }
    badge?: {
        badgeCode: BadgeCode,
        animationCode: AnimationCode
    }
}

export interface Profile {
    id: string
    name: string
    username: string
    pfp: {
        space?: string
        link: string
    }
    badge?: {
        animationCode: string
        badgeCode: string
    }
    email: string
    status: string
}

export interface Badge {
    code: BadgeCode
    link: string
}

export interface BadgeAnimation {
    code: AnimationCode
    name: string
    animation: string
}

export interface ReadOnlyProfile {
    uid: string
    name: string
    username: string
    status: string
    pfp: {
        space?: string
        link: string
    }
    badge?: {
        badgeCode: BadgeCode,
        animationCode: AnimationCode
    }
}
