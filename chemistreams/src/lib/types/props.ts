import { LucideIcon } from "lucide-react"
import { ChatMetaData } from "./client"
import { User } from "./server"

export interface AuthProviderProps {
    user: User | null
    children: React.ReactNode
}

export interface LoginPageProps {
    loginAction: (email: string, password: string) => void
}

export interface ToolbarButtonProps {
    Icon: LucideIcon,
    callback: () => void
}

export interface NewChatProps {
    text: string,
    onChange: (text: string) => void
}

export interface ChatBoxProps {
    metadata: ChatMetaData
    isCurrent: boolean
    onClick: (metadata: ChatMetaData) => void
}

export interface ChatListProps {
    chatList: ChatMetaData[],
    current?: ChatMetaData,
    onClick: (metadata: ChatMetaData) => void
}

export interface ChatViewProps {
    current?: ChatMetaData
}

export interface ChatHeaderProps {
    current?: ChatMetaData
}

export interface ChatContentProps {
    current?: ChatMetaData
}
