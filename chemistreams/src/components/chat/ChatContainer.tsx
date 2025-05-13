"use client"

import { MouseEvent, useCallback, useContext, useMemo, useState } from "react"
import { useDatabaseErrorHandler } from "@/lib/hooks/useDatabaseErrorHandler"
import { DataSnapshot, onDisconnect, ref, set } from "firebase/database"
import { LogOut, PaintBucket, Trash2, UserPen } from "lucide-react"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { ChatMetaData, GenericError } from "@/lib/types/client"
import { AuthContext } from "@/lib/context/AuthContext"
import { ToolbarButtonProps } from "@/lib/types/props"
import { UseListenerConfig } from "@/lib/types/hooks"
import { DB_USERS } from "@/lib/constants/routes"
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
    const [statusValueErrorCallback, setStatusValueErrorCallback] = useDatabaseErrorHandler("CHATCONTAINER_STATUS_CHANGE_ERROR")

    const buttons: ToolbarButtonProps[] = [
        {
            Icon: UserPen,
            callback: handleProfileEdit
        },
        {
            Icon: PaintBucket,
            callback: () => {}
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
    
    const connectionReference = useMemo(() => {
        return ref(rt, ".info/connected")
    }, [user.uid])

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
            <Toolbar buttons={buttons} />
            <ChatList current={currentChat} onClick={setCurrentChat} />
            {
                currentChat ? 
                <ChatView current={currentChat} /> : 
                <section className="border-l border-dark-grey flex-shrink-0 md:h-full md:w-[65%] md:flex md:flex-col md:justify-center md:items-center" style={{zIndex: 10}}>
                    <p className="text-light-grey font-jbm text-xl">Add or Select a Chat</p>
                </section>
            }
            <ProfileEditor show={showProfileEditor} />
        </main>
    )
}
