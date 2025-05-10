import { SQUARE_IMAGE_SIZE } from "@/lib/constants/client"
import { ChatHeaderProps } from "@/lib/types/props"
import { ChatMetaData } from "@/lib/types/client"
import Image from "next/image"

interface HeaderProps {
    current: ChatMetaData
}

function GroupChatHeader({ current } : HeaderProps) {

    return (
        <>
            <Image src={current.pfp} alt="pfp" width={SQUARE_IMAGE_SIZE} height={SQUARE_IMAGE_SIZE} className="md:p-2 md:space-x-4" />
            <div className="md:w-auto md:h-full md:flex md:flex-col md:justify-center md:space-y-2">
                <h2 className="font-jbm text-white md:text-lg">{current.name}</h2>
                <p className="font-jbm text-light-grey md:text-sm">{current.status}</p>
            </div>
        </>
    )
}

function DirectChatHeader({ current } : HeaderProps) {

    return (
        <>
            <Image src={current.pfp} alt="pfp" width={SQUARE_IMAGE_SIZE} height={SQUARE_IMAGE_SIZE} className="md:p-2 md:space-x-4" />
            <div className="md:w-auto md:h-full md:flex md:flex-col md:justify-center md:space-y-2">
                <h2 className="font-jbm text-white md:text-lg">{current.name}</h2>
                <p className="font-jbm text-light-grey md:text-sm">{current.status}</p>
            </div>
        </>
    )
}

export default function ChatHeader({ current } : ChatHeaderProps) {

    return (
        <header className="md:w-full md:h-[15%] border-b border-dark-grey md:flex md:flex-row md:justify-start md:items-center md:p-4">
            {
                current ?
                (current.isGroup ? <GroupChatHeader current={current} /> : <DirectChatHeader current={current} />) : 
                <></>
            }
        </header>
    )
}
