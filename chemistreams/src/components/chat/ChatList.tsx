"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "@/lib/context/AuthContext"
import { onValue, ref, off } from "firebase/database"
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

        const listener = onValue(reference, (snapshot) => {
            const data = snapshot.val()
            console.log("Chats Update:", data)
        }, (error) => {
            console.error("Chats Listener Error:", error)
        })

        return () => off(reference)
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