import { ChatMessage, ChatMetaData, GenericError, Profile } from "./client"
import { LucideIcon } from "lucide-react"
import { MouseEvent } from "react"
import { User } from "./server"

export interface InterfaceProviderProps {
    setText: (text: string, color?: string) => void
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
    current?: ChatMetaData,
    onClick: (metadata: ChatMetaData) => void
}

export interface ChatViewProps {
    current: ChatMetaData
}

export interface ChatHeaderProps {
    current?: ChatMetaData
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

export interface ProfileEditorProps {
    show: boolean
}

export interface EditorProps {
    profile: Profile
}

export interface PFPEditorProps {
    initial: string
}

export interface DetailsEditorProps {
    profile: Profile
}
