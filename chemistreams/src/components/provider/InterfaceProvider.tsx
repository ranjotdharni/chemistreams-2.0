"use client"

import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { InterfaceProviderProps } from "@/lib/types/props"
import useNotify from "@/lib/hooks/useNotify"
import { useEffect, useState } from "react"

export const InterfaceProvider: React.FunctionComponent<InterfaceProviderProps> = ({
    toggleTheme,
    setText,
    children
}) => {
    const [message, setMessage] = useNotify()

    const defaultColor: string = 'dark-white'
    const [darkTheme, setDarkTheme] = useState<boolean>()
    const [color, setColor] = useState<string>(defaultColor)

    function onMessageChange(message: string, color?: string): void {
        setMessage(message)
        setColor(color ? color : defaultColor)
    }

    function changeTheme() {
        setDarkTheme(previous => !previous)
    }

    useEffect(() => {
        if (darkTheme === undefined) {
            const prefersLightTheme = window.matchMedia("(prefers-color-scheme: light)").matches
            if (prefersLightTheme) {
                document.body.setAttribute("data-theme", "light")
                setDarkTheme(false)
            }
            else {
                document.body.setAttribute("data-theme", "dark")
                setDarkTheme(true)
            }
        }
        else {
            if (darkTheme) {
                document.body.setAttribute("data-theme", "dark")
            }
            else {
                document.body.setAttribute("data-theme", "light")
            }
        }
    }, [darkTheme])

    return (
        <InterfaceContext.Provider
            value={{
                toggleTheme: changeTheme,
                setText: onMessageChange   
            }}
        >
            <>
                { children }
                <span style={{color: `var(--color-${color})`, top: message !== "" ? "92.5%" : "100%"}} className="w-[85%] h-[7.5%] fixed transition-all duration-200 flex flex-col justify-center items-end font-jbm text-sm">
                    { message !== "" && <p className="bg-black p-4 rounded-md">{message}</p> }
                </span>
            </>
        </InterfaceContext.Provider>
    )
}
