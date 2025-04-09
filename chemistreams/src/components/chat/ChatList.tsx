"use client"

import { DEFAULT_PFP } from "@/lib/constants/client"
import { ChatBoxProps } from "@/lib/types/props"
import NewChat from "./ChatList/NewChat"
import ChatBox from "./ChatList/ChatBox"
import { useState } from "react"

export default function ChatList() {
    const [newChatText, setNewChatText] = useState<string>("")

    const [currentChat, setCurrentChat] = useState<ChatBoxProps | undefined>()
    const [chatList, setChatList] = useState<{
        id: string | number,
        pfp: string,
        online: boolean,
        name: string,
        timestamp: string,
        lastChat: string
    }[]>([
        {
            id: 0,
            pfp: DEFAULT_PFP,
            online: true,
            name: "John Doe",
            timestamp: "03:42",
            lastChat: "How are you?"
        },
        {
            id: 1,
            pfp: DEFAULT_PFP,
            online: true,
            name: "Donald Trump",
            timestamp: "11:09",
            lastChat: "He's fired!"
        },
        {
            id: 2,
            pfp: DEFAULT_PFP,
            online: false,
            name: "Sabrina Carpenter",
            timestamp: "01:17",
            lastChat: "jeffrey dahmer rizz"
        }
    ])

    function handleNewCurrent(newCurrent: ChatBoxProps) {
        setCurrentChat(newCurrent)
    }

    return (
        <section className="bg-opacity-0 md:h-full md:w-[27.5%] md:p-4 md:space-y-4">
            <NewChat text={newChatText} onChange={setNewChatText} />

            <ul className="md:w-full md:h-auto md:space-y-4 md:flex md:flex-col">
                {
                    chatList.map((chat) => {
                        return <ChatBox key={chat.id} id={chat.id} pfp={chat.pfp} isCurrent={currentChat?.id === chat.id} online={chat.online} name={chat.name} timestamp={chat.timestamp} lastChat={chat.lastChat} onClick={handleNewCurrent} />
                    })
                }
            </ul>
        </section>
    )
}