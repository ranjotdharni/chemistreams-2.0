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
