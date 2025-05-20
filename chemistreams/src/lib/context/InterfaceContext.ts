import { InterfaceContextValue } from "../types/client"
import { createContext, useContext } from "react"

export const InterfaceContext = createContext<InterfaceContextValue>({
    toggleTheme: () => {
        
    },
    setText: (text: string, color?: string) => {
        console.log(text)
    },
    setProfileView: () => {
        
    }
})

export const useInterface = () => useContext(InterfaceContext)
