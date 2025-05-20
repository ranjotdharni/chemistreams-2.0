"use client"

import { ChatMessage, ChatMetaData, DirectChatMetaData, GroupChatMetaData, GroupMember } from "@/lib/types/client"
import { AuthContext } from "@/lib/context/AuthContext"
import { useContext, useEffect, useRef } from "react"
import { dateToFormat } from "@/lib/utils/client"
import { notFound } from "next/navigation"
import PFP from "@/components/utils/PFP"

interface ChatMessageItem {
    incoming: boolean
    message: ChatMessage
    messageCurve: string
}

interface ChatProps {
    current: ChatMetaData
    messages: ChatMessage[]
}

function Message({ incoming = false, message, messageCurve } : ChatMessageItem) {
    const tailwindContainer: string = `w-full flex p-[1px] items-center justify-start ${incoming ? "flex-row" : "flex-row-reverse"}`
    const tailwindMessage: string = `${incoming ? "bg-dark-grey" : "bg-green"} max-w-[47.5%] text-dark-white px-4 py-1 ${messageCurve} font-jbm`
    const tailwindTimestamp: string = `w-[52.5%] flex flex-row ${incoming ? "justify-start" : "justify-end"} px-6 font-roboto text-light-grey opacity-0 hover:opacity-100`

    return (
        <div className={tailwindContainer}>
            <p className={tailwindMessage}>{message.content}</p>
            <p className={tailwindTimestamp}>{`${message.timestamp.getHours()}:${message.timestamp.getMinutes() < 10 ? "0" : ""}${message.timestamp.getMinutes()} (${dateToFormat("MMM DD", message.timestamp)})`}</p>
        </div>
    )
}

export default function ChatContent({ current, messages } : ChatProps) {
    const { user } = useContext(AuthContext)
    const elementRef = useRef<HTMLUListElement>(null)
    const voluntaryScrollRef = useRef(false)

    if (!user)
        notFound()

    // auto-scroll on new message, auto-scroll will disable and re-enable automatically depending on if the user scrolled voluntarily away from the most recent message
    useEffect(() => {
        if (elementRef.current && !voluntaryScrollRef.current) {
            elementRef.current.scrollTop = elementRef.current.scrollHeight
        }
    }, [elementRef.current, messages])

    useEffect(() => {
        if (!elementRef.current)
            return

        function handleScroll() {
            const isAtBottom =
                elementRef.current!.scrollTop + elementRef.current!.clientHeight >= elementRef.current!.scrollHeight - 1

            voluntaryScrollRef.current = !isAtBottom
        }

        const ref = elementRef.current
        ref.addEventListener("scroll", handleScroll)

        return () => {
            ref.removeEventListener("scroll", handleScroll)
        }
    }, [])

    return (
        <ul ref={elementRef} className="md:w-full md:h-[70%] p-1 overflow-y-scroll">
            {
                messages.map((message, index) => {
                    const incoming: boolean = message.sender !== user.uid
                    const chat: GroupChatMetaData = current as GroupChatMetaData

                    let sender: GroupMember | undefined

                    if (chat.isGroup) {
                        sender = chat.members.find(m => m.id === message.sender)
                    } 
                    else {
                        sender = current as DirectChatMetaData
                    }

                    // sometimes rendering is faster than data fetching (at least i think this is the issue), either way this line ensures an undefined sender isn't passed 
                    if (!sender)
                        return 

                    const first: boolean = message.sender !== messages[Math.max(index - 1, 0)].sender || index === 0
                    const last: boolean = message.sender !== messages[Math.min(index + 1, messages.length - 1)].sender || index === messages.length - 1

                    let curve: string = ""

                    if (first) {
                        curve = `${incoming ? "rounded-2xl rounded-bl-none" : "rounded-2xl rounded-br-none"}`
                    }
                    else if (last) {
                        curve = `${incoming ? "rounded-2xl rounded-tl-none" : "rounded-2xl rounded-tr-none"}`
                    }
                    else {
                        curve = `${incoming ? "rounded-r-2xl" : "rounded-l-2xl"}`
                    }

                    if (!incoming)
                        return <Message key={message.id} incoming={incoming} message={message} messageCurve={curve} />

                    return (
                        <li key={message.id} className="w-full">
                            {
                                first && 
                                <div className="w-full pt-2 flex flex-row items-center justify-start space-x-2" >
                                    <PFP src={sender.pfp.link || ""} disable={!sender.badge} badge={sender.badge} bgColor="var(--color-black)" length="4em" useHeight />
                                    <p className="text-dark-white text-[1em]">{sender.name}</p>
                                    <p className="text-light-grey text-[0.75em] font-jbm">{`(@${sender.username})`}</p>
                                </div>
                            }
                            <Message incoming={incoming} message={message} messageCurve={curve} />
                        </li>
                    )
                })
            }
        </ul>
    )
}
