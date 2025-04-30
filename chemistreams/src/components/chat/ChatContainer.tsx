"use client"

import { ChatMetaData } from "@/lib/types/client"
import ChatList from "./ChatList"
import ChatView from "./ChatView"
import { useState } from "react"
import Toolbar from "./Toolbar"

export default function ChatContainer() {
    const [currentChat, setCurrentChat] = useState<ChatMetaData | undefined>()

    return (
        <main className="bg-black md:w-[85%] md:h-[85%] md:rounded-2xl md:flex md:flex-row md:overflow-hidden md:shadow-xl">
            <Toolbar />
            <ChatList current={currentChat} onClick={setCurrentChat} />
            <ChatView current={currentChat} />
        </main>
    )
}
