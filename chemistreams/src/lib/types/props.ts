import { User } from "./server"

export interface AuthProviderProps {
    user: User | null
    children: React.ReactNode
}

export interface LoginPageProps {
    loginAction: (email: string, password: string) => void
}

export interface ToolbarButtonProps {
    icon: string,
    alt: string,
    callback: () => void
}
