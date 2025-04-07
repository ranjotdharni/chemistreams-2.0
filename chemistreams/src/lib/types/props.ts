import { User } from "./server"

export interface AuthProviderProps {
    user: User | null
    children: React.ReactNode
}
