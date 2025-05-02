"use client"

import { useDatabaseErrorHandler } from "@/lib/hooks/useDatabaseErrorHandler"
import { useState, useContext, useMemo, useCallback } from "react"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { DB_METADATA, DB_USERS } from "@/lib/constants/routes"
import { ref, DataSnapshot, get } from "firebase/database"
import { DEFAULT_GROUP_PFP } from "@/lib/constants/client"
import { AuthContext } from "@/lib/context/AuthContext"
import { UseListenerConfig } from "@/lib/types/hooks"
import useListener from "@/lib/hooks/useListener"
import { ChatListProps } from "@/lib/types/props"
import { ChatMetaData } from "@/lib/types/client"
import NewChat from "./ChatList/NewChat"
import ChatBox from "./ChatList/ChatBox"
import { rt } from "@/lib/auth/firebase"

export default function ChatList({ current, onClick } : ChatListProps) {
    const UIControl = useContext(InterfaceContext)
    const { user } = useContext(AuthContext)

    const [chatList, setChatList] = useState<ChatMetaData[]>([])
    const [addedErrorCallback, setAddErrorCallback] = useDatabaseErrorHandler("CHATLIST_CHATS_ADD_ERROR")

    const reference = useMemo(() => {
        return ref(rt, `${DB_USERS}/${user?.uid}/chats`)
    }, [user?.uid])

    const handleNewChat = useCallback(async (snapshot: DataSnapshot) => {
        if (!user)
            return

        const chatId = snapshot.key
        
        if (chatId) {
            const metadataReference = ref(rt, `${DB_METADATA}/${chatId}`)
            const metadataSnapshot = await get(metadataReference)

            if (!metadataSnapshot.exists()) {
                UIControl.setText("Metadata Does Not Exist.", "red")
                return
            }

            const metadata = metadataSnapshot.val()
            let newChat: ChatMetaData

            if (metadata.group) {
                // handle new group chat
                newChat = {
                    id: chatId,
                    isGroup: true,
                    pfp: DEFAULT_GROUP_PFP,
                    online: true,
                    username: "",
                    name: metadata.alias,
                    status: ""
                }
            }
            else {
                let recipientReference

                if (metadata.creator === user.uid) {    // is the creator of the direct chat
                    recipientReference = ref(rt, `${DB_USERS}/${metadata.to}`)
                }
                else {
                    recipientReference = ref(rt, `${DB_USERS}/${metadata.creator}`)
                }

                const recipientSnapshot = await get(recipientReference)
                const recipient = recipientSnapshot.val()

                newChat = {
                    id: chatId,
                    pfp: recipient.pfp,
                    online: true,
                    username: recipient.username,
                    name: recipient.name,
                    status: recipient.bio
                }
            }

            setChatList(list => {
                return [...list, newChat]
            })
        }
    }, [user])

    const listenerConfig: UseListenerConfig = useMemo(() => {
        return {
            added: {
                callback: handleNewChat,
                errorCallback: addedErrorCallback
            }
        }
    }, [handleNewChat, addedErrorCallback])

    useListener(reference, listenerConfig)

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
