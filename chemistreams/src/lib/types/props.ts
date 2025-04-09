import { LucideIcon } from "lucide-react"
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
    id: string | number
    pfp: string
    online: boolean
    isCurrent: boolean
    name: string
    timestamp: string
    lastChat: string
    onClick: (chat: ChatBoxProps) => void
}
