"use client"

import { ChatMetaData, ReadOnlyProfile } from "@/lib/types/client"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { InterfaceProviderProps } from "@/lib/types/props"
import ProfileView from "../utils/ProfileView"
import useNotify from "@/lib/hooks/useNotify"
import { useEffect, useState } from "react"

export const InterfaceProvider: React.FunctionComponent<InterfaceProviderProps> = ({
    toggleTheme,
    setText,
    setProfileView,
    children
}) => {
    const [message, setMessage] = useNotify()

    const defaultColor: string = 'dark-white'
    const [viewingProfile, setViewingProfile] = useState<{ currentUserId: string, profile: ReadOnlyProfile, setCurrentChat: (chat: ChatMetaData) => void, direct?: ChatMetaData }>()
    const [darkTheme, setDarkTheme] = useState<boolean>()
    const [color, setColor] = useState<string>(defaultColor)

    function onMessageChange(message: string, color?: string): void {
        setMessage(message)
        setColor(color ? color : defaultColor)
    }

    function changeTheme() {
        setDarkTheme(previous => {

            if (previous) { // was dark theme
                document.body.setAttribute("data-theme", "light")
                localStorage.setItem("theme", "light")
            }
            else {  // was light theme
                document.body.setAttribute("data-theme", "dark")
                localStorage.setItem("theme", "dark")
            }

            return !previous
        })
    }

    function showProfile(currentUserId: string, profile: ReadOnlyProfile, setCurrentChat: (chat: ChatMetaData) => void, direct?: ChatMetaData) {
        setViewingProfile({
            currentUserId: currentUserId,
            profile: profile,
            setCurrentChat: setCurrentChat,
            direct: direct
        })
    }

    useEffect(() => {
        const themeChoice = localStorage.getItem("theme")

        if (themeChoice && themeChoice !== "automatic") {
            if (themeChoice === "light") {
                document.body.setAttribute("data-theme", "light")
                setDarkTheme(false)
            }
            else {
                document.body.setAttribute("data-theme", "dark")
                setDarkTheme(true)
            }
        }
        else if (darkTheme === undefined) {
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
                setText: onMessageChange,
                setProfileView: showProfile   
            }}
        >
            <>
                { children }
                { viewingProfile !== undefined && <ProfileView currentUserId={viewingProfile.currentUserId} profile={viewingProfile.profile} setCurrentChat={viewingProfile.setCurrentChat} direct={viewingProfile.direct} close={() => { setViewingProfile(undefined) }} /> }
                <span style={{color: `var(--color-${color})`, top: message !== "" ? "92.5%" : "100%"}} className="w-[85%] h-[7.5%] fixed transition-all duration-200 flex flex-col justify-center items-end font-jbm text-sm">
                    { message !== "" && <p className="bg-black p-4 rounded-md">{message}</p> }
                </span>
            </>
        </InterfaceContext.Provider>
    )
}
