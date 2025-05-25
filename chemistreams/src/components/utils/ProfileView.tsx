"use client"

import { MouseEvent, useCallback, useContext, useMemo, useState } from "react"
import { useDatabaseErrorHandler } from "@/lib/hooks/useDatabaseErrorHandler"
import { DataSnapshot, ref, set, update } from "firebase/database"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { DB_METADATA, DB_USERS } from "@/lib/constants/routes"
import { AuthContext } from "@/lib/context/AuthContext"
import { DirectChatMetaData } from "@/lib/types/client"
import { UseListenerConfig } from "@/lib/types/hooks"
import { ProfileViewProps } from "@/lib/types/props"
import useListener from "@/lib/hooks/useListener"
import { rt } from "@/lib/auth/firebase"
import { v4 as uuidv4 } from "uuid"
import PFP from "./PFP"

export default function ProfileView({ currentUserId, close, profile, setCurrentChat, direct } : ProfileViewProps) {
    const { user } = useContext(AuthContext)
    const UIControl = useContext(InterfaceContext)

    const [statusValueErrorCallback, setStatusValueErrorCallback] = useDatabaseErrorHandler("PROFILEVIEW_PROFILE_VALUE_ERROR")
    const [online, setOnline] = useState<boolean | undefined>()

    const profileReference = useMemo(() => {
        return ref(rt, `${DB_USERS}/${profile.uid}/status`)
    }, [profile.uid])

    async function sendMessage(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        if (direct) {
            setCurrentChat(direct)
            close()
            return
        }

        if (profile.uid === currentUserId)
            return

        // should add some check here to make sure the requested direct chat doesn't already exist in database as well

        const chatId: string = uuidv4()
        const toUserId: string = profile.uid

        try {
            // update metadata
            const metadataReference = ref(rt, `${DB_METADATA}/${chatId}`)
            await set(metadataReference, {
                creator: currentUserId,
                to: toUserId
            })

            // add to both users chats
            const creatorUpdatePath: string = `${DB_USERS}/${currentUserId}/chats/${chatId}`
            const toUpdatePath: string = `${DB_USERS}/${toUserId}/chats/${chatId}`

            const updates: Record<string, string> = {
                [creatorUpdatePath]: "",
                [toUpdatePath]: ""
            }

            await update(ref(rt), updates)
        }
        catch (error) {
            console.log(error)
            UIControl.setText("CHATLIST_CREATEDIRECTCHAT_ERROR: 500 Internal Server Error", "red")
            return
        }

        UIControl.setText("Chat Created.", "green")

        setCurrentChat({
            id: chatId,
            creator: currentUserId,
            name: profile.name,
            to: toUserId,
            username: profile.username,
            status: profile.status,
            pfp: profile.pfp,
            badge: profile.badge
        } as DirectChatMetaData)

        close()
    }

    const handleStatusChange = useCallback(async (snapshot: DataSnapshot) => {
        if (!snapshot.key)
            return

        const isOnline: boolean = snapshot.val()

        setOnline(isOnline)
    }, [profile.uid])

    const statusListenerConfig: UseListenerConfig = useMemo(() => {
        return {
            value: {
                callback: handleStatusChange,
                errorCallback: statusValueErrorCallback
            }
        }
    }, [profile.uid])

    useListener(profileReference, statusListenerConfig)

    return (
        <div className="backdrop-blur z-40 fixed w-full h-full flex flex-col justify-center items-center">
            <div className="w-[95%] h-[75%] md:h-1/2 md:w-1/5 bg-black border border-dark-grey rounded flex flex-col items-center space-y-2 px-4">
                <PFP length="50%" bgColor="var(--color-black)" src={profile.pfp.link} disable={!profile.badge} badge={profile.badge} />
                <p className="font-jbm" style={{color: online ? "var(--color-green)" : "var(--color-light-grey)"}}>{online !== undefined ? (online ? "Online" : "Offline") : "..."}</p>
                <span className="w-full flex flex-row justify-between items-center border border-dark-grey p-1">
                    <p className="text-light-grey text-sm font-lato">Name</p>
                    <p className="text-dark-white font-jbm">{profile.name}</p>
                </span>
                <span className="w-full flex flex-row justify-between items-center border border-dark-grey p-1">
                    <p className="text-light-grey text-sm font-lato">Username</p>
                    <p className="text-green font-jbm">{`@${profile.username}`}</p>
                </span>
                <span className="w-full flex flex-col p-2 space-y-2">
                    <p className="font-lato text-light-grey text-sm">Status</p>
                    <p className="font-jbm text-dark-white border border-dark-grey p-1">{profile.status}</p>
                </span>
                <div className="w-full flex-1 flex flex-row justify-end items-end space-x-2 py-2">
                    <button onClick={close} className="transition-colors duration-200 text-light-grey text-sm px-1 font-lato border border-light-grey rounded hover:cursor-pointer hover:bg-light-grey hover:text-black">Close</button>
                    <button onClick={sendMessage} className="transition-colors duration-200 text-white text-sm px-1 font-lato border border-green rounded hover:cursor-pointer hover:bg-green">Send Message</button>
                </div>
            </div>
        </div>
    )
}
