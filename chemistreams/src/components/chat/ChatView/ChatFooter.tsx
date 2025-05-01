"use client"

import { FileVideo, ImageIcon, LucideIcon, SendIcon, AudioLines } from "lucide-react"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { push, ref, serverTimestamp } from "firebase/database"
import { MESSAGE_TYPE_CODE } from "@/lib/constants/server"
import { MouseEvent, useContext, useState } from "react"
import { AuthContext } from "@/lib/context/AuthContext"
import { DB_MESSAGES } from "@/lib/constants/routes"
import { ChatFooterProps } from "@/lib/types/props"
import { ChatMetaData } from "@/lib/types/client"
import { rt } from "@/lib/auth/firebase"

interface FooterButtonProps {
    current?: ChatMetaData
    Icon: LucideIcon
    onClick: () => void
}

function FooterButton({ current, Icon, onClick } : FooterButtonProps) {

    return (
        <button disabled={current === undefined} className="text-light-grey hover:text-green md:w-[30%] md:h-full hover:cursor-pointer">
            <Icon />
        </button>
    )
}

export default function ChatFooter({ current } : ChatFooterProps) {
    const { user } = useContext(AuthContext)
    const UIControl = useContext(InterfaceContext)

    const [message, setMessage] = useState<string>("")

    const attachButtons: FooterButtonProps[] = [
        {
            current: current,
            Icon: ImageIcon,
            onClick: () => {
                // upload image
            }
        },
        {
            current: current,
            Icon: FileVideo,
            onClick: () => {
                // upload video
            }
        },
        {
            current: current,
            Icon: AudioLines,
            onClick: () => {
                // upload audio
            }
        }
    ]

    async function send(event: MouseEvent<HTMLButtonElement>) {
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

    return (
        <footer className="md:w-full md:h-[10%] md:flex md:flex-row md:justify-evenly md:items-center md:p-4">
            <div className="md:w-[12.5%] md:h-full md:flex md:flex-row md:justify-end md:space-x-2 md:py-2">
                {
                    attachButtons.map((button, index) => {
                        return <FooterButton key={`FOOTER_ATTACH_BUTTON_${index}`} Icon={button.Icon} onClick={button.onClick} />
                    })
                }
            </div>
            <input value={message} onChange={e => setMessage(e.target.value)} disabled={current === undefined} placeholder="Send Message..." className="bg-dark-grey md:w-[82.5%] md:h-full md:px-4 md:rounded-4xl outline-none font-jbm text-dark-white" />
            <button onClick={send} disabled={current === undefined} className="md:w-[5%] md:aspect-square text-light-grey hover:text-green hover:cursor-pointer">
                <SendIcon className="md:w-full md:h-full md:p-2" />
            </button>
        </footer>
    )
}
