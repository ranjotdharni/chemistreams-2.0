"use client"

import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { InterfaceProviderProps } from "@/lib/types/props"
import useNotify from "@/lib/hooks/useNotify"
import { useState } from "react"

export const InterfaceProvider: React.FunctionComponent<InterfaceProviderProps> = ({
    setText,
    children
}) => {
    const [message, setMessage] = useNotify()

    const defaultColor: string = 'dark-white'
    const [color, setColor] = useState<string>(defaultColor)

    function onMessageChange(message: string, color?: string): void {
        setMessage(message)
        setColor(color ? color : defaultColor)
    }

    return (
        <InterfaceContext.Provider
            value={{
                setText: onMessageChange   
            }}
        >
            <>
                { children }
                <span style={{color: `var(--color-${color})`}} className="w-[85%] h-[7.5%] fixed top-[92.5%] flex flex-col justify-center items-end font-jbm text-sm">
                    { message !== "" && <p className="bg-black p-4 rounded-md">{message}</p> }
                </span>
            </>
        </InterfaceContext.Provider>
    )
}
