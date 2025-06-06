import { ADD_USER_TYPE_CODE, FILE_TYPE_CODE, MESSAGE_TYPE_CODE, REMOVE_USER_TYPE_CODE, SPOTIFY_EMBED_TYPE_CODE, USER_LEFT_TYPE_CODE, YOUTUBE_EMBED_TYPE_CODE } from "@/lib/constants/server"
import { MouseEvent, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { limitToLast, orderByKey, ref, query, DataSnapshot, get, set } from "firebase/database"
import { ChatMessage, DirectChatMetaData, GroupChatMetaData } from "@/lib/types/client"
import { useDatabaseErrorHandler } from "@/lib/hooks/useDatabaseErrorHandler"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { DB_MESSAGES, DB_USERS } from "@/lib/constants/routes"
import { AuthContext } from "@/lib/context/AuthContext"
import { UseListenerConfig } from "@/lib/types/hooks"
import GroupPFP from "@/components/utils/GroupPFP"
import useListener from "@/lib/hooks/useListener"
import { ChatBoxProps } from "@/lib/types/props"
import { rt } from "@/lib/auth/firebase"
import PFP from "@/components/utils/PFP"

interface DirectChatBoxProps {
    metadata: DirectChatMetaData
    isCurrent: boolean
    lastMessage: string
    lastTimestamp?: Date
    opened?: boolean
    handleClick: (event: MouseEvent<HTMLLIElement>) => void
}

interface GroupChatBoxProps {
    metadata: GroupChatMetaData
    isCurrent: boolean
    lastMessage: string
    lastTimestamp?: Date
    opened?: boolean
    handleClick: (event: MouseEvent<HTMLLIElement>) => void
}

function DirectChatBox({ metadata, isCurrent, lastMessage, lastTimestamp, opened, handleClick } : DirectChatBoxProps) {
    const [statusChangedErrorCallback, setStatusChangedErrorCallback] = useDatabaseErrorHandler("DIRECTCHATBOX_STATUS_VALUE_ERROR")
    const [online, setOnline] = useState<boolean>()

    const toStatusReference = useMemo(() => {
        return ref(rt, `${DB_USERS}/${metadata.to}/status`)
    }, [metadata.id])

    const handleStatusValue = useCallback(async (snapshot: DataSnapshot) => {
        if (!snapshot.key)
            return

        const isOnline: boolean = snapshot.val()

        setOnline(isOnline)
    }, [metadata.id])

    const statusListenerConfig: UseListenerConfig = useMemo(() => {
        return {
            value: {
                callback: handleStatusValue,
                errorCallback: statusChangedErrorCallback
            }
        }
    }, [metadata.id])

    useListener(toStatusReference, statusListenerConfig)

    return (
        <li onClick={handleClick} className={`${isCurrent ? "bg-green" : "bg-dark-grey"} hover:cursor-pointer w-full h-22 rounded-xl py-4 px-2 flex flex-row`}>
            <div className="w-[25%] h-full flex flex-col justify-center items-center relative">
                <PFP src={metadata.pfp.link} length={"90%"} bgColor="var(--color-dark-grey)" online={online} />
            </div>

            <div className="w-[60%] h-full space-y-2 px-2">
                <h4 className="text-md text-dark-white font-jbm">{`${metadata.name.slice(0, 15)}${metadata.name.length > 15 ? "..." : ""}`}</h4>
                <p className="text-sm text-light-grey font-montserrat">{`${lastMessage.slice(0, 20)}${lastMessage.length > 20 ? "..." : ""}`}</p>
            </div>

            <div className="md:w-[15%] md:h-full md:flex md:flex-col md:items-center md:space-y-3 md:px-1">
                <p className="text-sm text-light-grey font-montserrat">{lastTimestamp ? `${lastTimestamp.getHours() === 0 ? 12 : (lastTimestamp.getHours() > 12 ? lastTimestamp.getHours() - 12 : lastTimestamp.getHours())}:${lastTimestamp.getMinutes() < 10 ? "0" : ""}${lastTimestamp.getMinutes()}${lastTimestamp.getHours() > 12 ? "p" : "a"}` : ""}</p>
                {
                    opened !== undefined &&
                    !opened &&
                    <div className="md:w-2 md:aspect-square md:rounded-xl bg-blue"></div>
                }
            </div>
        </li>
    )
}

function GroupChatBox({ metadata, isCurrent, lastMessage, lastTimestamp, opened, handleClick } : GroupChatBoxProps) {
    return (
        <li onClick={handleClick} className={`${isCurrent ? "bg-green" : "bg-dark-grey"} hover:cursor-pointer w-full h-22 rounded-xl py-4 px-2 flex flex-row`}>
            <div className="w-[25%] h-full flex flex-col justify-center items-center relative">
                <GroupPFP pfps={metadata.members.map(m => m.pfp)} length="80%" />
            </div>

            <div className="w-[60%] h-full space-y-2 px-2">
                <h4 className="text-md text-dark-white font-jbm">{`${metadata.name.slice(0, 15)}${metadata.name.length > 15 ? "..." : ""}`}</h4>
                <p className="text-sm text-light-grey font-montserrat">{`${lastMessage.slice(0, 20)}${lastMessage.length > 20 ? "..." : ""}`}</p>
            </div>

            <div className="w-[15%] h-full flex flex-col items-center space-y-3 px-1">
                <p className="text-sm text-light-grey font-montserrat">{lastTimestamp ? `${lastTimestamp.getHours() === 0 ? 12 : (lastTimestamp.getHours() > 12 ? lastTimestamp.getHours() - 12 : lastTimestamp.getHours())}:${lastTimestamp.getMinutes() < 10 ? "0" : ""}${lastTimestamp.getMinutes()}${lastTimestamp.getHours() > 12 ? "p" : "a"}` : ""}</p>
                {
                    opened !== undefined &&
                    !opened &&
                    <div className="w-2 aspect-square rounded-xl bg-blue"></div>
                }
            </div>
        </li>
    )
}

export default function ChatBox({ metadata, isCurrent, onClick } : ChatBoxProps) {
    const UIControl = useContext(InterfaceContext)
    const { user } = useContext(AuthContext)

    const [lastMessageAddedErrorCallback, setLastMessageAddedErrorCallback] = useDatabaseErrorHandler("CHATBOX_MESSAGES_ADD_ERROR")
    const isCurrentRef = useRef(isCurrent)
    const [lastTimestamp, setLastTimestamp] = useState<Date | undefined>()
    const [lastMessage, setLastMessage] = useState<string>("")
    const [opened, setOpened] = useState<boolean | undefined>()

    const lastMessageReference = useMemo(() => {
        const reference = ref(rt, `${DB_MESSAGES}/${metadata.id}`)
        return query(reference, orderByKey(), limitToLast(1))
    }, [metadata.id])

    const handleNewMessage = useCallback(async (snapshot: DataSnapshot) => {
        if (!snapshot.key || !user)
            return

        const message: ChatMessage = snapshot.val()

        if (message.type === MESSAGE_TYPE_CODE) {
            setLastMessage(message.content || "")
            setLastTimestamp(new Date(message.timestamp))
        }
        else if (message.type === FILE_TYPE_CODE) {
            setLastMessage("[Image]")
            setLastTimestamp(new Date(message.timestamp))
        }
        else if (message.type === SPOTIFY_EMBED_TYPE_CODE) {
            setLastMessage(`[Spotify Item]`)
            setLastTimestamp(new Date(message.timestamp))
        }
        else if (message.type === YOUTUBE_EMBED_TYPE_CODE) {
            setLastMessage(`[YouTube Item]`)
            setLastTimestamp(new Date(message.timestamp))
        }
        else if (message.type === ADD_USER_TYPE_CODE) {
            // add user to a chat
        }
        else if (message.type === USER_LEFT_TYPE_CODE) {
            // remove user from a chat (left)
        }
        else if (message.type === REMOVE_USER_TYPE_CODE) {
            // remove user from a chat (kicked)
        }
        else {
            UIControl.setText("CHATBOX_MESSAGES_HANDLENEWMESSAGE_ERROR: 500 Internal Server Error", "red")
            return
        }

        const lastReadReference = ref(rt, `${DB_USERS}/${user.uid}/chats/${metadata.id}`)
        const lastReadSnapshot = await get(lastReadReference)

        if (!lastReadSnapshot.key)
            return

        const lastRead = lastReadSnapshot.val()

        if (snapshot.key === lastRead)
            return

        // must use a ref because parent does not re-render when isCurrent changes, so useCallback will memoize a stale closure otherwise
        if (isCurrentRef.current) {
            // update the lastRead message
            await set(lastReadReference, snapshot.key)

            if (opened === undefined || !opened)
                setOpened(true)
        }
        else {
            if (opened === undefined || opened)
                setOpened(false)
        }
    }, [metadata.id])

    function handleClick(event: MouseEvent<HTMLLIElement>) {
        event.preventDefault()
        onClick(metadata)
    }

    const lastMessageListenerConfig: UseListenerConfig = useMemo(() => {
        return {
            added: {
                callback: handleNewMessage,
                errorCallback: lastMessageAddedErrorCallback
            }
        }
    }, [metadata.id])

    useListener(lastMessageReference, lastMessageListenerConfig)

    useEffect(() => {
        isCurrentRef.current = isCurrent
        if (isCurrent && !opened)
            setOpened(true)
    }, [isCurrent])

    return (
        (metadata as GroupChatMetaData).isGroup ? 
        <GroupChatBox metadata={metadata as GroupChatMetaData} isCurrent={isCurrent} lastMessage={lastMessage} lastTimestamp={lastTimestamp} opened={opened} handleClick={handleClick} /> :
        <DirectChatBox metadata={metadata as DirectChatMetaData} isCurrent={isCurrent} lastMessage={lastMessage} lastTimestamp={lastTimestamp} opened={opened} handleClick={handleClick} />
    )
}
