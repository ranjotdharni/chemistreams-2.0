import { ADD_USER_TYPE_CODE, MESSAGE_TYPE_CODE, REMOVE_USER_TYPE_CODE, USER_LEFT_TYPE_CODE } from "@/lib/constants/server"
import { MouseEvent, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { limitToLast, orderByKey, ref, query, DataSnapshot, get, set } from "firebase/database"
import { useDatabaseErrorHandler } from "@/lib/hooks/useDatabaseErrorHandler"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { DB_MESSAGES, DB_USERS } from "@/lib/constants/routes"
import { SQUARE_IMAGE_SIZE } from "@/lib/constants/client"
import { AuthContext } from "@/lib/context/AuthContext"
import { UseListenerConfig } from "@/lib/types/hooks"
import useListener from "@/lib/hooks/useListener"
import { ChatMessage } from "@/lib/types/client"
import { ChatBoxProps } from "@/lib/types/props"
import { rt } from "@/lib/auth/firebase"
import Image from "next/image"

export default function ChatBox({ metadata, isCurrent, onClick } : ChatBoxProps) {
    const UIControl = useContext(InterfaceContext)
    const { user } = useContext(AuthContext)

    const [lastMessageAddedErrorCallback, setLastMessageAddedCallback] = useDatabaseErrorHandler("CHATBOX_MESSAGES_ADD_ERROR")
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
        <li onClick={handleClick} className={`${isCurrent ? "bg-green" : "bg-dark-grey"} hover:cursor-pointer md:w-full md:h-22 md:rounded-xl md:py-4 md:px-2 md:flex md:flex-row`}>
            <div className="md:w-[25%] md:h-full md:flex md:flex-col md:justify-center md:items-center md:relative">
                <Image src={metadata.pfp} alt="pfp" width={SQUARE_IMAGE_SIZE} height={SQUARE_IMAGE_SIZE} className="md:w-3/4 md:aspect-square" />
                <div className={`md:w-4 md:aspect-square md:rounded-lg md:border-3 md:border-dark-grey md:absolute md:top-4/5 md:left-1/5 ${metadata.online ? "bg-light-green" : "bg-red"}`}></div>
            </div>

            <div className="md:w-[60%] md:h-full md:space-y-2 md:px-2">
                <h4 className="text-md text-dark-white font-jbm">{`${metadata.name.slice(0, 15)}${metadata.name.length > 15 ? "..." : ""}`}</h4>
                <p className="text-sm text-light-grey font-montserrat">{`${lastMessage.slice(0, 20)}${lastMessage.length > 20 ? "..." : ""}`}</p>
            </div>

            <div className="md:w-[15%] md:h-full md:flex md:flex-col md:items-center md:space-y-3 md:px-1">
                <p className="text-sm text-light-grey font-montserrat">{lastTimestamp ? `${lastTimestamp.getHours()}:${lastTimestamp.getMinutes() < 10 ? "0" : ""}${lastTimestamp.getMinutes()}` : ""}</p>
                {
                    opened !== undefined &&
                    !opened &&
                    <div className="md:w-2 md:aspect-square md:rounded-xl bg-blue"></div>
                }
            </div>
        </li>
    )
}
