"use client"

import { ref, off, onChildAdded, DataSnapshot } from "firebase/database"
import { createDatabaseErrorHandler } from "@/lib/utils/client"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "@/lib/context/AuthContext"
import { DB_USERS } from "@/lib/constants/routes"
import { ChatListProps } from "@/lib/types/props"
import NewChat from "./ChatList/NewChat"
import ChatBox from "./ChatList/ChatBox"
import { rt } from "@/lib/auth/firebase"

export default function ChatList({ chatList, current, onClick } : ChatListProps) {
    const { user } = useContext(AuthContext)

    const [newChatText, setNewChatText] = useState<string>("")

    useEffect(() => {
        const reference = ref(rt, `${DB_USERS}/${user?.uid}/chats`)

        function handleNewChat(snapshot: DataSnapshot) {
            const data = snapshot.val()
            console.log("New Chat:", data)
        }

        onChildAdded(reference, handleNewChat, createDatabaseErrorHandler("CHATLIST_CHATS_ADD_ERROR"))

        function unsubscribe() {
            off(reference, "child_added", handleNewChat)
            // add any other listeners to be removed for cleanup here
        }

        return unsubscribe
    }, [])

    return (
        <section className="bg-opacity-0 md:h-full md:w-[27.5%] md:p-4 md:space-y-4">
            <NewChat text={newChatText} onChange={setNewChatText} />

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