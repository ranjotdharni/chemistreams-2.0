"use client"

import { ChatMetaData, DirectChatMetaData, GroupChatMetaData, GroupMember } from "@/lib/types/client"
import { useDatabaseErrorHandler } from "@/lib/hooks/useDatabaseErrorHandler"
import { DB_GROUPS, DB_METADATA, DB_USERS } from "@/lib/constants/routes"
import { useState, useContext, useMemo, useCallback } from "react"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { ref, DataSnapshot, get } from "firebase/database"
import { AuthContext } from "@/lib/context/AuthContext"
import { UseListenerConfig } from "@/lib/types/hooks"
import useListener from "@/lib/hooks/useListener"
import { ChatListProps } from "@/lib/types/props"
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

                const groupMemberIds = await get(ref(rt, `${DB_GROUPS}/${chatId}`))
                const groupMembers: GroupMember[] = await Promise.all(Object.keys(groupMemberIds.val()).map(async (uid) => {
                    const memberDataSnapshot: DataSnapshot = await get(ref(rt, `${DB_USERS}/${uid}`))
                    const memberData: any = memberDataSnapshot.val()
                    return {
                        id: uid,
                        name: memberData.name,
                        username: memberData.username,
                        pfp: memberData.pfp
                    } as GroupMember
                }))

                newChat = {
                    id: chatId,
                    creator: metadata.creator,
                    isGroup: true,
                    name: metadata.alias,
                    members: groupMembers
                } as GroupChatMetaData
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
                    creator: metadata.creator,
                    to: recipientSnapshot.key,
                    pfp: recipient.pfp,
                    username: recipient.username,
                    name: recipient.name,
                    status: recipient.bio
                } as DirectChatMetaData
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
        <section className="bg-black flex-shrink-0 md:h-full md:w-[27.5%] md:p-4 md:space-y-4" style={{zIndex: current ? 10 : 20}}>
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
