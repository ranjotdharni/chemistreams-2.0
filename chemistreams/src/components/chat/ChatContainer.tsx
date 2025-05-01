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
            {
                currentChat ? 
                <ChatView current={currentChat} /> : 
                <section className="border-l border-dark-grey md:h-full md:w-[70%] md:flex md:flex-col md:justify-center md:items-center">
                    <p className="text-light-grey font-jbm text-xl">Add or Select a Chat</p>
                </section>
            }
        </main>
    )
}
