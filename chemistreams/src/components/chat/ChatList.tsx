"use client"

import { useDatabaseErrorHandler } from "@/lib/hooks/useDatabaseErrorHandler"
import { AuthContext } from "@/lib/context/AuthContext"
import { ref, DataSnapshot } from "firebase/database"
import useListener from "@/lib/hooks/useListener"
import { DB_USERS } from "@/lib/constants/routes"
import { ChatListProps } from "@/lib/types/props"
import { useState, useContext } from "react"
import NewChat from "./ChatList/NewChat"
import ChatBox from "./ChatList/ChatBox"
import { rt } from "@/lib/auth/firebase"

export default function ChatList({ chatList, current, onClick } : ChatListProps) {
    const { user } = useContext(AuthContext)

    const reference = ref(rt, `${DB_USERS}/${user?.uid}/chats`)

    const [newChatText, setNewChatText] = useState<string>("")
    

    function handleNewChat(snapshot: DataSnapshot) {
        const data = snapshot.val()
        console.log("New Chat:", data)
    } 

    useListener(reference, { added: { callback: handleNewChat, errorCallback: useDatabaseErrorHandler("CHATLIST_CHATS_ADD_ERROR") } })

    return (
        <section className="bg-opacity-0 md:h-full md:w-[27.5%] md:p-4 md:space-y-4">
            <NewChat />

            <ul className="md:w-full md:h-auto md:space-y-4 md:flex md:flex-col">
                {
                    chatList.map((chat) => {
                        return <ChatBox key={chat.id} metadata={chat} isCurrent={current?.id === chat.id} onClick={onClick} />
                    })
                }
            </ul>
        </section>
    )
}
