import { SQUARE_IMAGE_SIZE } from "@/lib/constants/client"
import { ChatBoxProps } from "@/lib/types/props"
import { MouseEvent } from "react"
import Image from "next/image"

export default function ChatBox({ id, pfp, online, name, isCurrent, timestamp, lastChat, onClick } : ChatBoxProps) {

    function handleClick(event: MouseEvent<HTMLLIElement>) {
        event.preventDefault()
        onClick({ id, pfp, online, name, isCurrent, timestamp, lastChat, onClick })
    }

    return (
        <li onClick={handleClick} className={`${isCurrent ? "bg-green" : "bg-dark-grey"} hover:cursor-pointer md:w-full md:h-22 md:rounded-xl md:py-4 md:px-2 md:flex md:flex-row`}>
            <div className="md:w-[25%] md:h-full md:flex md:flex-col md:justify-center md:items-center md:relative">
                <Image src={pfp} alt="pfp" width={SQUARE_IMAGE_SIZE} height={SQUARE_IMAGE_SIZE} className="md:w-3/4 md:aspect-square" />
                <div className={`md:w-4 md:aspect-square md:rounded-lg md:border-3 md:border-dark-grey md:absolute md:top-4/5 md:left-1/5 ${online ? "bg-light-green" : "bg-red"}`}></div>
            </div>

            <div className="md:w-[60%] md:h-full md:space-y-2 md:px-2">
                <h4 className="text-md text-white font-jbm">{name}</h4>
                <p className="text-sm text-light-grey font-montserrat">{lastChat}</p>
            </div>

            <div className="md:w-[15%] md:h-full md:flex md:flex-col md:items-center md:px-1">
                <p className="text-sm text-light-grey font-montserrat">{timestamp}</p>
            </div>
        </li>
    )
}