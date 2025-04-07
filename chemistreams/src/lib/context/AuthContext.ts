import { AuthContextValue } from "../types/server"
import { createContext, useContext } from "react"

export const AuthContext = createContext<AuthContextValue>({
    user: null
})

export const useAuth = () => useContext(AuthContext)
