"use client"

import { FormEvent, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { FileVideo, ImageIcon, LucideIcon, SendIcon, AudioLines } from "lucide-react"
import { DataSnapshot, push, ref, serverTimestamp, set } from "firebase/database"
import { useDatabaseErrorHandler } from "@/lib/hooks/useDatabaseErrorHandler"
import { DirectChatMetaData, GroupChatMetaData } from "@/lib/types/client"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { DB_MESSAGES, DB_USERS } from "@/lib/constants/routes"
import { MESSAGE_TYPE_CODE } from "@/lib/constants/server"
import { AuthContext } from "@/lib/context/AuthContext"
import { UseListenerConfig } from "@/lib/types/hooks"
import { ChatFooterProps } from "@/lib/types/props"
import useListener from "@/lib/hooks/useListener"
import { rt } from "@/lib/auth/firebase"

const CLEAR_TYPING_MS: number = 3000

interface FooterButtonProps {
    isDisabled: boolean
    Icon: LucideIcon
    onClick: () => void
}

function TypingListener({ uid, display, isGroup, disable } : { uid: string, display: string, isGroup: boolean, disable?: true }) {
    const [typingStatusValueErrorCallback, setTypingStatusValueErrorCallback] = useDatabaseErrorHandler("DIRECTCHATFOOTER_TYPINGSTATUS_CHANGE_ERROR")
    const [isTyping, setIsTyping] = useState<boolean>(false)

    const typingReference = useMemo(() => {
        return ref(rt, `${DB_USERS}/${uid}/typing`)
    }, [uid])

    const handleTypingStatusChange = useCallback(async (snapshot: DataSnapshot) => {
        if (snapshot.val() === null || snapshot.val() === undefined)
            return

        setIsTyping(snapshot.val())
    }, [uid])

    const typingStatusListenerConfig: UseListenerConfig = useMemo(() => {
        return {
            value: {
                callback: handleTypingStatusChange,
                errorCallback: typingStatusValueErrorCallback
            }
        }
    }, [uid])

    useListener(typingReference, typingStatusListenerConfig)

    return (
        isTyping && 
        <p className="font-jbm max-h-[100%]">{`${display} is typing${isGroup ? "," : "..."}`}</p>
    )
}

function FooterButton({ isDisabled, Icon, onClick } : FooterButtonProps) {

    return (
        <button disabled={isDisabled} className="text-light-grey hover:text-green md:w-[30%] md:h-full hover:cursor-pointer">
            <Icon />
        </button>
    )
}

function GroupChatFooter({ current, buttons } : { current?: GroupChatMetaData, buttons: FooterButtonProps[] }) {
    const { user } = useContext(AuthContext)

    if (!user)
        return <></>

    const UIControl = useContext(InterfaceContext)

    const [message, setMessage] = useState<string>("")
    const [isTyping, setIsTyping] = useState<boolean>(false)

    const inputRef = useRef<HTMLInputElement>(null)

    async function send(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!user || !current)
            return

        const trimmedMessage: string = message.trim()

        if (trimmedMessage.length === 0) {
            if (message !== "")
                setMessage("")
            return
        }

        const messageData = {
            sender: user.uid,
            type: MESSAGE_TYPE_CODE,
            content: trimmedMessage,
            timestamp: serverTimestamp()
        }

        try {
            await push(ref(rt, `${DB_MESSAGES}/${current.id}`), messageData)
        }
        catch {
            UIControl.setText("Failed To Send Message.")
            return
        }

        setMessage("")
    }

    useEffect(() => {
        if (!inputRef.current || !user || !current)
            return

        let timeoutId: NodeJS.Timeout | string | number | undefined

        const startTimeout: () => Promise<NodeJS.Timeout | string | number | undefined> = async () => {
            if (timeoutId)
                clearTimeout(timeoutId)

            return setTimeout(async () => {
                timeoutId = undefined
                // set typing status
                await set(ref(rt, `${DB_USERS}/${user.uid}/typing`), "")
                setIsTyping(false)
            }, CLEAR_TYPING_MS)
        }

        const stopTimeout = () => {
            if (timeoutId)
                clearTimeout(timeoutId)
        }

        const updateTyping = (is_typing: boolean) => {
            if (is_typing)
                return is_typing

            // set typing status
            set(ref(rt, `${DB_USERS}/${user.uid}/typing`), current.id)
            return true 
        }

        const onTyping = async () => {
            setIsTyping(updateTyping)
            timeoutId = await startTimeout()
        }

        inputRef.current.addEventListener("keypress", onTyping)

        return () => {
            stopTimeout()
            inputRef.current?.removeEventListener("keypress", onTyping)
            set(ref(rt, `${DB_USERS}/${user.uid}/typing`), "")
        }

    }, [inputRef.current])

    return (
        <footer className="md:w-full md:h-[15%] md:p-4 md:space-y-2 md:flex md:flex-col md:justify-end">
            <div className="md:w-full md:h-[40%] md:px-2 md:flex md:flex-row md:items-end text-green md:text-[0.75em]">
                {
                    current &&
                    current.members.map((member) => {
                        return ( 
                            member.id !== user.uid &&
                            <TypingListener key={`MEMBER_TYPING_STATUS_${member.id}`} uid={member.id} display={member.name} isGroup={true} />
                        )
                    })
                }
            </div>
            <div className="md:w-full md:h-[60%] md:p-1 md:flex md:flex-row md:justify-evenly md:items-center">
                <div className="md:w-[12.5%] md:h-full md:flex md:flex-row md:justify-end md:space-x-2 md:py-2">
                    {
                        buttons.map((button, index) => {
                            return <FooterButton key={`FOOTER_ATTACH_BUTTON_${index}`} isDisabled={button.isDisabled} Icon={button.Icon} onClick={button.onClick} />
                        })
                    }
                </div>
                <form onSubmit={send} className="md:w-[87.5%] md:h-full md:flex md:flex-row md:justify-between md:items-center">
                    <input ref={inputRef} value={message} onChange={e => setMessage(e.target.value)} disabled={current === undefined} placeholder="Send Message..." className="bg-dark-grey md:w-[93%] md:h-full md:px-4 md:rounded-4xl outline-none font-jbm text-dark-white" />
                    <button type="submit" disabled={current === undefined} className="md:w-[6%] md:aspect-square text-light-grey hover:text-green hover:cursor-pointer">
                        <SendIcon className="md:w-full md:h-full md:p-2" />
                    </button>
                </form>
            </div>
        </footer>
    )
}

function DirectChatFooter({ current, buttons } : { current?: DirectChatMetaData, buttons: FooterButtonProps[] }) {
    const { user } = useContext(AuthContext)

    if (!user)
        return <></>

    const UIControl = useContext(InterfaceContext)

    const [message, setMessage] = useState<string>("")
    const [isTyping, setIsTyping] = useState<boolean>(false)

    const inputRef = useRef<HTMLInputElement>(null)

    async function send(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!user || !current)
            return

        const trimmedMessage: string = message.trim()

        if (trimmedMessage.length === 0) {
            if (message !== "")
                setMessage("")
            return
        }

        const messageData = {
            sender: user.uid,
            type: MESSAGE_TYPE_CODE,
            content: trimmedMessage,
            timestamp: serverTimestamp()
        }

        try {
            await push(ref(rt, `${DB_MESSAGES}/${current.id}`), messageData)
        }
        catch {
            UIControl.setText("Failed To Send Message.")
            return
        }

        setMessage("")
    }

    useEffect(() => {
        if (!inputRef.current || !user || !current)
            return

        let timeoutId: NodeJS.Timeout | string | number | undefined

        const startTimeout: () => Promise<NodeJS.Timeout | string | number | undefined> = async () => {
            if (timeoutId)
                clearTimeout(timeoutId)

            return setTimeout(async () => {
                timeoutId = undefined
                // set typing status
                await set(ref(rt, `${DB_USERS}/${user.uid}/typing`), "")
                setIsTyping(false)
            }, CLEAR_TYPING_MS)
        }

        const stopTimeout = () => {
            if (timeoutId)
                clearTimeout(timeoutId)
        }

        const updateTyping = (is_typing: boolean) => {
            if (is_typing)
                return is_typing

            // set typing status
            set(ref(rt, `${DB_USERS}/${user.uid}/typing`), current.id)
            return true 
        }

        const onTyping = async () => {
            setIsTyping(updateTyping)
            timeoutId = await startTimeout()
        }

        inputRef.current.addEventListener("keypress", onTyping)

        return () => {
            stopTimeout()
            inputRef.current?.removeEventListener("keypress", onTyping)
            set(ref(rt, `${DB_USERS}/${user.uid}/typing`), "")
        }

    }, [inputRef.current])

    return (
        <footer className="md:w-full md:h-[15%] md:p-4 md:space-y-2 md:flex md:flex-col md:justify-end">
            <span className="md:w-full md:h-[40%] md:px-2 md:flex md:flex-row md:items-end text-green md:text-[0.75em]">
                {
                    current && 
                    <TypingListener key={`MEMBER_TYPING_STATUS_${current.to !== user.uid ? current.to : current.creator}`} uid={current.to !== user.uid ? current.to : current.creator} display={current.to !== user.uid ? current.name : ""} isGroup={false} />
                }
            </span>
            <div className="md:w-full md:h-[90%] md:p-1 md:flex md:flex-row md:justify-evenly md:items-center">
                <div className="md:w-[12.5%] md:h-full md:flex md:flex-row md:justify-end md:space-x-2 md:py-2">
                    {
                        buttons.map((button, index) => {
                            return <FooterButton key={`FOOTER_ATTACH_BUTTON_${index}`} isDisabled={button.isDisabled} Icon={button.Icon} onClick={button.onClick} />
                        })
                    }
                </div>
                <form onSubmit={send} className="md:w-[87.5%] md:h-full md:py-1 md:flex md:flex-row md:justify-between md:items-center">
                    <input ref={inputRef} value={message} onChange={e => setMessage(e.target.value)} disabled={current === undefined} placeholder="Send Message..." className="bg-dark-grey md:w-[93%] md:h-full md:px-4 md:rounded-4xl outline-none font-jbm text-dark-white" />
                    <button type="submit" disabled={current === undefined} className="md:w-[6%] md:aspect-square text-light-grey hover:text-green hover:cursor-pointer">
                        <SendIcon className="md:w-full md:h-full md:p-2" />
                    </button>
                </form>
            </div>
        </footer>
    )
}

export default function ChatFooter({ current } : ChatFooterProps) {
    if (!current)
        return <></>

    const attachButtons: FooterButtonProps[] = [
        {
            isDisabled: current === undefined,
            Icon: ImageIcon,
            onClick: () => {
                // upload image
            }
        },
        {
            isDisabled: current === undefined,
            Icon: FileVideo,
            onClick: () => {
                // upload video
            }
        },
        {
            isDisabled: current === undefined,
            Icon: AudioLines,
            onClick: () => {
                // upload audio
            }
        }
    ]

    return (
        (current as GroupChatMetaData).isGroup ? 
        <GroupChatFooter current={current as GroupChatMetaData} buttons={attachButtons} /> : 
        <DirectChatFooter current={current as DirectChatMetaData} buttons={attachButtons} />
    )
}
