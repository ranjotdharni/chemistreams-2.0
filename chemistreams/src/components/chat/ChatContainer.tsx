"use client"

import { ChatMetaData } from "@/lib/types/client"
import ChatList from "./ChatList"
import ChatView from "./ChatView"
import { useCallback, useContext, useMemo, useState } from "react"
import Toolbar from "./Toolbar"
import { rt } from "@/lib/auth/firebase"
import { AuthContext } from "@/lib/context/AuthContext"
import { notFound } from "next/navigation"
import { DataSnapshot, onDisconnect, ref, set } from "firebase/database"
import { useDatabaseErrorHandler } from "@/lib/hooks/useDatabaseErrorHandler"
import { DB_USERS } from "@/lib/constants/routes"
import { UseListenerConfig } from "@/lib/types/hooks"
import useListener from "@/lib/hooks/useListener"

export default function ChatContainer() {
    const { user } = useContext(AuthContext)

    if (!user)
        notFound()

    const statusReference = ref(rt, `${DB_USERS}/${user.uid}/status`)
    const [currentChat, setCurrentChat] = useState<ChatMetaData | undefined>()
    const [statusValueErrorCallback, setStatusValueErrorCallback] = useDatabaseErrorHandler("CHATCONTAINER_STATUS_CHANGE_ERROR")
    
    const connectionReference = useMemo(() => {
        return ref(rt, ".info/connected")
    }, [user.uid])

    const handleStatusChange = useCallback(async (snapshot: DataSnapshot) => {
        if (snapshot.val() === null || snapshot.val() === undefined)
            return

        const statusReference = ref(rt, `${DB_USERS}/${user.uid}/status`)

        await set(statusReference, true)
    }, [user.uid])

    const statusListenerConfig: UseListenerConfig = useMemo(() => {
        return {
            value: {
                callback: handleStatusChange,
                errorCallback: statusValueErrorCallback
            }
        }
    }, [user.uid])

    useListener(connectionReference, statusListenerConfig, undefined, async () => { await set(statusReference, false) })

    return (
        <main className="bg-black md:w-[85%] md:h-[85%] md:rounded-2xl md:flex md:flex-row md:overflow-hidden md:shadow-xl">
            <Toolbar />
            <ChatList current={currentChat} onClick={setCurrentChat} />
            {
                currentChat ? 
                <ChatView current={currentChat} /> : 
                <section className="border-l border-dark-grey md:h-full md:w-[70%] md:flex md:flex-col md:justify-center md:items-center">
                    <p className="text-light-grey font-jbm text-xl">Add or Select a Chat</p>
                </section>
            }
        </main>
    )
}
