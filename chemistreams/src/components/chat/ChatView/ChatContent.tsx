"use client"

import { useContext, useEffect, useRef, useState } from "react"
import { ChatMessage, ChatMetaData } from "@/lib/types/client"
import { AuthContext } from "@/lib/context/AuthContext"
import { dateToFormat } from "@/lib/utils/client"

interface ChatMessageItem {
    incoming: boolean
    message: ChatMessage
}

interface ChatProps {
    current: ChatMetaData
    messages: ChatMessage[]
}

function Message({ incoming = false, message } : ChatMessageItem) {
    const tailwindContainer: string = `w-full p-2 flex items-center justify-start ${incoming ? "flex-row" : "flex-row-reverse"}`
    const tailwindMessage: string = `${incoming ? "bg-dark-grey" : "bg-green"} max-w-[47.5%] text-dark-white px-4 py-1 rounded-2xl font-jbm`
    const tailwindTimestamp: string = `w-[52.5%] flex flex-row ${incoming ? "justify-start" : "justify-end"} px-6 font-roboto text-light-grey opacity-0 hover:opacity-100`

    return (
        <li className={tailwindContainer}>
            <p className={tailwindMessage}>{message.content}</p>
            <p className={tailwindTimestamp}>{`${message.timestamp.getHours()}:${message.timestamp.getMinutes() < 10 ? "0" : ""}${message.timestamp.getMinutes()} (${dateToFormat("MMM DD", message.timestamp)})`}</p>
        </li>
    )
}

export default function ChatContent({ current, messages } : ChatProps) {
    const { user } = useContext(AuthContext)
    const elementRef = useRef<HTMLUListElement>(null)
    const [voluntaryScroll, setVoluntaryScroll] = useState<boolean>(false)

    if (!user)
        return <></>

    // auto-scroll on new message, auto-scroll will disable and re-enable automatically depending on if the user scrolled voluntarily away from the most recent message
    useEffect(() => {
        if (elementRef.current && !voluntaryScroll) {
            elementRef.current.scrollTop = elementRef.current.scrollHeight
        }
    }, [elementRef.current, messages])

    useEffect(() => {
        if (!elementRef.current)
            return

        function handleScroll() {
            // if user has voluntarily scrolled and it wasn't a scroll all the way to the bottom, then set the variable
            if (elementRef!.current!.scrollTop + elementRef!.current!.clientHeight >= elementRef!.current!.scrollHeight - 1) {
                setVoluntaryScroll(false)
            }
            else {
                setVoluntaryScroll(true)
            }
        }

        elementRef.current.addEventListener("scroll", handleScroll)

        return () => {
            elementRef.current?.removeEventListener("scroll", handleScroll)
        }
    }, [])

    return (
        <ul ref={elementRef} className="md:w-full md:h-[75%] overflow-y-scroll">
            {
                messages.map(message => {
                    return <Message key={message.id} incoming={user.uid !== message.sender} message={message} />
                })
            }
        </ul>
    )
}
