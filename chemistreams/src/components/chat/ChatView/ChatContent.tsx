"use client"

import { ChatMessage, ChatMetaData, DirectChatMetaData, GroupChatMetaData, GroupMember } from "@/lib/types/client"
import { useContext, useEffect, useRef, useState } from "react"
import { SQUARE_IMAGE_SIZE } from "@/lib/constants/client"
import { AuthContext } from "@/lib/context/AuthContext"
import { dateToFormat } from "@/lib/utils/client"
import Image from "next/image"

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
        <ul ref={elementRef} className="md:w-full md:h-[70%] p-1 overflow-y-scroll">
            {
                messages.map((message, index) => {
                    const incoming: boolean = message.sender !== user.uid
                    const chat: GroupChatMetaData = current as GroupChatMetaData
                    const sender: GroupMember | DirectChatMetaData = chat.isGroup ? chat.members.find(m => m.id === message.sender) || current as DirectChatMetaData : current as DirectChatMetaData
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
                                <div className="w-full pt-2 flex items-center justify-start flex-row space-x-2" >
                                    <div className="h-12 aspect-square">
                                        <Image src={sender.pfp.link} alt={`$MESSAGE_SENDER_PFP`} width={SQUARE_IMAGE_SIZE} height={SQUARE_IMAGE_SIZE} className="w-full h-full" />
                                    </div>
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
