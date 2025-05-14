"use client"

import { ChatMetaData, DirectChatMetaData, GenericError, GroupChatMetaData, GroupMember } from "@/lib/types/client"
import { MouseEvent, useCallback, useContext, useMemo, useState } from "react"
import { useDatabaseErrorHandler } from "@/lib/hooks/useDatabaseErrorHandler"
import { DataSnapshot, get, onDisconnect, ref, set } from "firebase/database"
import { DB_GROUPS, DB_METADATA, DB_USERS } from "@/lib/constants/routes"
import { LogOut, PaintBucket, Trash2, UserPen } from "lucide-react"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { AuthContext } from "@/lib/context/AuthContext"
import { ToolbarButtonProps } from "@/lib/types/props"
import { UseListenerConfig } from "@/lib/types/hooks"
import useListener from "@/lib/hooks/useListener"
import { logoutAction } from "@/lib/utils/server"
import ProfileEditor from "./ProfileEditor"
import { notFound } from "next/navigation"
import { rt } from "@/lib/auth/firebase"
import ChatList from "./ChatList"
import ChatView from "./ChatView"
import Toolbar from "./Toolbar"

export default function ChatContainer() {
    const UIControl = useContext(InterfaceContext)
    const { user } = useContext(AuthContext)

    if (!user)
        notFound()

    const statusReference = ref(rt, `${DB_USERS}/${user.uid}/status`)
    const [showProfileEditor, setShowProfileEditor] = useState<boolean>(false)
    const [currentChat, setCurrentChat] = useState<ChatMetaData | undefined>()
    const [chatList, setChatList] = useState<ChatMetaData[]>([])
    const [statusValueErrorCallback, setStatusValueErrorCallback] = useDatabaseErrorHandler("CHATCONTAINER_STATUS_CHANGE_ERROR")
    const [chatAddedErrorCallback, setChatAddErrorCallback] = useDatabaseErrorHandler("CHATCONTAINER_CHAT_ADD_ERROR")

    const buttons: ToolbarButtonProps[] = [
        {
            Icon: UserPen,
            callback: handleProfileEdit
        },
        {
            Icon: PaintBucket,
            callback: () => {
                UIControl.toggleTheme()
            }
        },
        {
            Icon: Trash2,
            callback: () => {}
        },
        {
            Icon: LogOut,
            hoverColor: "red",
            callback: handleLogout
        }
    ]

    const chatListReference = useMemo(() => {
        return ref(rt, `${DB_USERS}/${user?.uid}/chats`)
    }, [user?.uid])
    
    const connectionReference = useMemo(() => {
        return ref(rt, ".info/connected")
    }, [user.uid])

    function handleEditChat(update: ChatMetaData): void {
        const editIndex = chatList.findIndex(c => c.id === update.id)

        if (editIndex === -1)
            return

        setChatList(previous => {
            const updatedChatList = [...previous]
            updatedChatList[editIndex] = update
            return updatedChatList
        })
    }

    function handleProfileEdit(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        setShowProfileEditor(value => {
            return !value
        })
    }

    async function handleLogout(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        const result: void | GenericError = await logoutAction()

        if (result !== undefined && (result as GenericError).code !== undefined) {
            UIControl.setText((result as GenericError).message, "red")
            return
        }
    }

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

    const handleStatusChange = useCallback(async (snapshot: DataSnapshot) => {
        if (snapshot.val() === null || snapshot.val() === undefined)
            return

        const statusReference = ref(rt, `${DB_USERS}/${user.uid}/status`)

        onDisconnect(statusReference).set(false).then(async () => {
            await set(statusReference, true)
            await set(ref(rt, `${DB_USERS}/${user.uid}/typing`), "")
        })

        onDisconnect(ref(rt, `${DB_USERS}/${user.uid}/typing`)).set("")
    }, [user.uid])

    const chatListListenerConfig: UseListenerConfig = useMemo(() => {
        return {
            added: {
                callback: handleNewChat,
                errorCallback: chatAddedErrorCallback
            }
        }
    }, [handleNewChat, chatAddedErrorCallback])

    const statusListenerConfig: UseListenerConfig = useMemo(() => {
        return {
            value: {
                callback: handleStatusChange,
                errorCallback: statusValueErrorCallback
            }
        }
    }, [user.uid])

    useListener(chatListReference, chatListListenerConfig)
    useListener(connectionReference, statusListenerConfig, undefined, async () => { await set(statusReference, false) })

    return (
        <main className="bg-black md:w-[85%] md:h-[85%] md:rounded-2xl md:flex md:flex-row md:overflow-hidden md:shadow-xl">
            <Toolbar buttons={buttons} />
            <ChatList current={currentChat} chats={chatList} onClick={setCurrentChat} />
            {
                currentChat ? 
                <ChatView current={currentChat} editChat={handleEditChat} /> : 
                <section className="border-l border-dark-grey flex-shrink-0 md:h-full md:w-[65%] md:flex md:flex-col md:justify-center md:items-center" style={{zIndex: 10}}>
                    <p className="text-light-grey font-jbm text-xl">Add or Select a Chat</p>
                </section>
            }
            <ProfileEditor show={showProfileEditor} />
        </main>
    )
}
