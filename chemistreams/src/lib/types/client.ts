import { AnimationCode, BadgeCode } from "../constants/client"
import { JSX } from "react"

export interface InterfaceContextValue {
    toggleTheme: () => void
    setText: (text: string, color?: string) => void
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
    timestamp: Date
}

export interface DropListProps<T> {
    open: boolean
    TitleComponent: JSX.Element | JSX.Element[]
    items: T[]
    render: (item: T, index: number) => JSX.Element
    containerTailwind: string
}

export interface GroupMember {
    id: string
    name: string
    username: string
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

export interface PFPProps {
    length: string | number
    useHeight?: boolean
    bgColor: string
    src: string
    online?: boolean
    disable?: boolean
    badge?: {
        badgeCode: BadgeCode,
        animationCode: AnimationCode
    }
}

export interface BadgeEditorProps {
    profile: Profile
    setProfile: (profile: Profile) => void
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
