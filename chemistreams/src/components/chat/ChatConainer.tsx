"use client"

import { DEFAULT_PFP } from "@/lib/constants/client"
import { ChatMetaData } from "@/lib/types/client"
import ChatList from "./ChatList"
import ChatView from "./ChatView"
import { useState } from "react"
import Toolbar from "./Toolbar"

export default function ChatContainer() {
    const [currentChat, setCurrentChat] = useState<ChatMetaData | undefined>()
    const [chats, setChats] = useState<ChatMetaData[]>([
        {
            id: 0,
            pfp: DEFAULT_PFP,
            online: true,
            name: "John Doe",
            status: "UI/UX Designer",
            timestamp: "03:42",
            lastChat: "How are you?"
        },
        {
            id: 1,
            pfp: DEFAULT_PFP,
            online: true,
            name: "Donald Trump",
            status: "Just Chillin'",
            timestamp: "11:09",
            lastChat: "He's fired!"
        },
        {
            id: 2,
            pfp: DEFAULT_PFP,
            online: false,
            name: "Sabrina Carpenter",
            status: "Do Not Disturb",
            timestamp: "01:17",
            lastChat: "jeffrey dahmer rizz"
        }
    ])

    return (
        <main className="bg-black md:w-[85%] md:h-[85%] md:rounded-2xl md:flex md:flex-row md:overflow-hidden md:shadow-xl">
            <Toolbar />
            <ChatList chatList={chats} current={currentChat} onClick={setCurrentChat} />
            <ChatView current={currentChat} />
        </main>
    )
}
