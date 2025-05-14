"use client"

import { ChatListProps } from "@/lib/types/props"
import NewChat from "./ChatList/NewChat"
import ChatBox from "./ChatList/ChatBox"

export default function ChatList({ current, chats, onClick } : ChatListProps) {

    return (
        <section className="bg-black flex-shrink-0 md:h-full md:w-[27.5%] md:p-4 md:space-y-4" style={{zIndex: current ? 10 : 20}}>
            <NewChat />

            <ul className="md:w-full md:h-auto md:space-y-4 md:flex md:flex-col">
                {
                    chats.map((chat) => {
                        return <ChatBox key={chat.id} metadata={chat} isCurrent={current?.id === chat.id} onClick={onClick} />
                    })
                }
            </ul>
        </section>
    )
}
