import { ChatMessage, ChatMetaData, GenericError, Profile, ReadOnlyProfile } from "./client"
import { AnimationCode, BadgeCode } from "../constants/client"
import { LucideIcon } from "lucide-react"
import { JSX, MouseEvent } from "react"
import { User } from "./server"

export interface InterfaceProviderProps {
    toggleTheme: () => void
    setText: (text: string, color?: string) => void
    setProfileView: (currentUserId: string, profile: ReadOnlyProfile, setCurrentChat: (chat: ChatMetaData) => void, direct?: ChatMetaData) => void
    children: React.ReactNode
}

export interface AuthProviderProps {
    user: User | null
    children: React.ReactNode
}

export interface LoginPageProps {
    loginAction: (email: string, password: string) => Promise<void | GenericError>
}

export interface ToolbarButtonProps {
    Icon: LucideIcon,
    hoverColor?: string,
    callback: (event: MouseEvent<HTMLButtonElement>) => void
}

export interface ChatBoxProps {
    metadata: ChatMetaData
    isCurrent: boolean
    onClick: (metadata: ChatMetaData) => void
}

export interface ChatListProps {
    current?: ChatMetaData
    chats: ChatMetaData[]
    onClick: (metadata: ChatMetaData) => void
}

export interface ChatViewProps {
    current: ChatMetaData
    chatList: ChatMetaData[]
    editChat: (update: ChatMetaData) => void
    setCurrentChat: (current: ChatMetaData) => void
}

export interface ChatHeaderProps {
    current?: ChatMetaData
    editChat: (update: ChatMetaData) => void
    chatList: ChatMetaData[]
    setCurrentChat: (current: ChatMetaData) => void
}

export interface ChatContentProps {
    current?: ChatMetaData
    messages: ChatMessage[]
}

export interface ChatFooterProps {
    current?: ChatMetaData
}

export interface ToolbarProps {
    buttons: ToolbarButtonProps[]
}

export interface DropListProps<T> {
    open: boolean
    TitleComponent: JSX.Element | JSX.Element[]
    items: T[]
    render: (item: T, index: number) => JSX.Element
    containerTailwind: string
    height: string | number
    maxHeight: string | number
}

export interface ProfileEditorProps {
    show: boolean
}

export interface EditorProps {
    profile: Profile
    setProfile: (previous: Profile) => void
}

export interface PFPEditorProps {
    profile: Profile
    setProfile: (previous: Profile) => void
}

export interface DetailsEditorProps {
    profile: Profile
    setProfile: (previous: Profile) => void
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

export interface GroupPFPProps {
    length: number | string
    useHeight?: boolean
    pfps: {
        space?: string
        link: string
    }[]
}

export interface ProfileViewProps {
    currentUserId: string
    close: () => void
    profile: ReadOnlyProfile
    setCurrentChat: (chat: ChatMetaData) => void
    direct?: ChatMetaData
}
