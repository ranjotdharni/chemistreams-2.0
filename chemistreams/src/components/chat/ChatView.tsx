"use client"

import { ADD_USER_TYPE_CODE, MESSAGE_TYPE_CODE, REMOVE_USER_TYPE_CODE, USER_LEFT_TYPE_CODE } from "@/lib/constants/server"
import { useDatabaseErrorHandler } from "@/lib/hooks/useDatabaseErrorHandler"
import { useCallback, useContext, useMemo, useState } from "react"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { AuthContext } from "@/lib/context/AuthContext"
import { DataSnapshot, ref } from "firebase/database"
import { UseListenerConfig } from "@/lib/types/hooks"
import { DB_MESSAGES } from "@/lib/constants/routes"
import { ChatViewProps } from "@/lib/types/props"
import useListener from "@/lib/hooks/useListener"
import ChatContent from "./ChatView/ChatContent"
import { ChatMessage } from "@/lib/types/client"
import ChatFooter from "./ChatView/ChatFooter"
import ChatHeader from "./ChatView/ChatHeader"
import { rt } from "@/lib/auth/firebase"

export default function ChatView({ current, editChat, chatList, setCurrentChat } : ChatViewProps) {
    const UIControl = useContext(InterfaceContext)
    const { user } = useContext(AuthContext)

    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [messagesAddedErrorCallback, setMessagesAddErrorCallback] = useDatabaseErrorHandler("CHATVIEW_MESSAGES_ADD_ERROR")

    const messagesReference = useMemo(() => {
        return ref(rt, `${DB_MESSAGES}/${current.id}`)
    }, [current.id])

    const handleNewMessage = useCallback(async (snapshot: DataSnapshot) => {
        if (!user)
            return

        if (snapshot.key) {
            const messageId: string = snapshot.key
            const rawMessageData = snapshot.val()
            let message: ChatMessage

            if (rawMessageData.type === MESSAGE_TYPE_CODE) {
                message = {
                    id: messageId,
                    sender: rawMessageData.sender,
                    type: rawMessageData.type,
                    content: rawMessageData.content,
                    timestamp: new Date(rawMessageData.timestamp)
                }
            }
            else if (rawMessageData.type === ADD_USER_TYPE_CODE) {
                message = {
                    id: "0101",
                    sender: "0101",
                    type: ADD_USER_TYPE_CODE,
                    timestamp: new Date(rawMessageData.timestamp)
                }
            }
            else if (rawMessageData.type === USER_LEFT_TYPE_CODE) {
                message = {
                    id: "0303",
                    sender: "0303",
                    type: USER_LEFT_TYPE_CODE,
                    timestamp: new Date(rawMessageData.timestamp)
                }
            }
            else if (rawMessageData.type === REMOVE_USER_TYPE_CODE) {
                message = {
                    id: "0202",
                    sender: "0202",
                    type: REMOVE_USER_TYPE_CODE,
                    timestamp: new Date(rawMessageData.timestamp)
                }
            }
            else {
                UIControl.setText("CHATVIEW_HANDLENEWMESSAGE_MESSAGETYPE_ERROR: 500 Internal Server Error", "red")
                return
            }

            setMessages(currentMessages => {
                return [...currentMessages, message]
            })
        }
    }, [current.id])

    const messagesListenerConfig: UseListenerConfig = useMemo(() => {
        return {
            added: {
                callback: handleNewMessage,
                errorCallback: messagesAddedErrorCallback
            }
        }
    }, [current.id])

    // the precondition here will ensure messages are cleared before loading in new ones so there are no duplicates/relics
    useListener(messagesReference, messagesListenerConfig, () => { setMessages([]) })

    return (
        <section className="bg-opacity-0 border-l border-dark-grey flex-shrink-0 md:h-full md:w-[65%]" style={{zIndex: 20}}>
            <ChatHeader current={current} editChat={editChat} chatList={chatList} setCurrentChat={setCurrentChat} />
            <ChatContent messages={messages} current={current} />
            <ChatFooter current={current} />
        </section>
    )
}
