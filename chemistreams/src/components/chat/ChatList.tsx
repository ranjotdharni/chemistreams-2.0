"use client"

import { ChatListProps } from "@/lib/types/props"
import NewChat from "./ChatList/NewChat"
import ChatBox from "./ChatList/ChatBox"

export default function ChatList({ current, chats, onClick } : ChatListProps) {

    return (
        <section className="bg-black flex-shrink-0 h-full w-[85%] md:w-[27.5%] p-4 md:space-y-4" style={{zIndex: current ? 10 : 20}}>
            <NewChat />

            <ul className="py-2 w-full h-[95%] space-y-4 flex flex-col" style={{overflowY: "scroll", zIndex: current ? 10 : 20}}>
                {
                    chats.map((chat) => {
                        return <ChatBox key={chat.id} metadata={chat} isCurrent={current?.id === chat.id} onClick={onClick} />
                    })
                }
            </ul>
        </section>
    )
}
