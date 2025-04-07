"use client"

import { AuthContext } from "@/lib/context/AuthContext"
import { AuthProviderProps } from "@/lib/types/props"

export const AuthProvider: React.FunctionComponent<AuthProviderProps> = ({
    user,
    children
}) => {
    return (
        <AuthContext.Provider
            value={{
             user   
            }}
        >
            { children }
        </AuthContext.Provider>
    )
}
