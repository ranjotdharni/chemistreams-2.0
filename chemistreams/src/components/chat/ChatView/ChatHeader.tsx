"use client"

import { ChatMetaData, GroupMember } from "@/lib/types/client"
import { SQUARE_IMAGE_SIZE } from "@/lib/constants/client"
import { ChatHeaderProps } from "@/lib/types/props"
import DropList from "@/components/utils/DropList"
import { JSX, useState } from "react"
import Image from "next/image"

interface HeaderProps {
    current: ChatMetaData
}

function GroupChatHeader({ current } : HeaderProps) {
    const [members, setMembers] = useState<GroupMember[]>([
        {
            id: "101",
            name: "Ranjot Dharni This and that and all of that shit in the sdfsdf",
            username: "rdharni1"
        },
        {
            id: "202",
            name: "John Madden",
            username: "jmadden1"
        },
        {
            id: "303",
            name: "James Cameron",
            username: "jcameron1"
        }
    ])
    const [isOpen, setIsOpen] = useState<boolean>(false)

    function DropListTitle() {
        return (
            <button onClick={() => { setIsOpen(!isOpen) }} className="w-full h-full text-sm flex flex-col justify-center items-center font-jbm hover:cursor-pointer">
                {
                    isOpen ? 
                    "Close" : 
                    "View Members"
                }
            </button>
        )
    }

    function renderDropList(item: GroupMember, index: number): JSX.Element {
        return (
            <li key={item.id} className="w-full h-auto p-2 mb-2 flex flex-row justify-between items-center rounded-md bg-black">
                <div className="h-2 aspect-square rounded-lg" style={{backgroundColor: "var(--color-green)"}}></div>
                <div className="w-[90%] px-4 flex flex-col items-end">
                    <p style={{color: item.id === current.creator ? "var(--color-gold)" : "var(--color-dark-white)", display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "calc(100%)"}}>{item.name}</p>
                    <p className="text-green font-jbm" style={{display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "calc(100%)"}}>{`@${item.username}`}</p>
                </div>
            </li>
        )
    }

    return (
        <>
            <Image src={current.pfp} alt="pfp" width={SQUARE_IMAGE_SIZE} height={SQUARE_IMAGE_SIZE} className="md:p-2 md:space-x-4" />
            <div className="md:w-auto md:h-full md:flex md:flex-col md:justify-center md:space-y-2">
                <h2 className="font-jbm text-white md:text-lg">{current.name}</h2>
                <DropList<GroupMember> open={isOpen} TitleComponent={<DropListTitle />} items={members} render={renderDropList} containerTailwind="w-60 h-5 p-1 text-light-grey space-y-4 border border-light-grey rounded" />
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
