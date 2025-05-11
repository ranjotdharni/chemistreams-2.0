"use client"

import { DirectChatMetaData, GroupChatMetaData, GroupMember } from "@/lib/types/client"
import { DEFAULT_GROUP_PFP, SQUARE_IMAGE_SIZE } from "@/lib/constants/client"
import { useDatabaseErrorHandler } from "@/lib/hooks/useDatabaseErrorHandler"
import { JSX, useCallback, useMemo, useState } from "react"
import { UseListenerConfig } from "@/lib/types/hooks"
import { DataSnapshot, ref } from "firebase/database"
import { ChatHeaderProps } from "@/lib/types/props"
import DropList from "@/components/utils/DropList"
import { DB_USERS } from "@/lib/constants/routes"
import useListener from "@/lib/hooks/useListener"
import { rt } from "@/lib/auth/firebase"
import Image from "next/image"

interface DirectHeaderProps {
    current: DirectChatMetaData
}

interface GroupHeaderProps {
    current: GroupChatMetaData
}

function GroupMemberStatusItem(item: GroupMember, isCreator: boolean) {
    const [statusChangedErrorCallback, setStatusChangedErrorCallback] = useDatabaseErrorHandler("GROUPMEMBERSTATUSITEM_STATUS_VALUE_ERROR")
    const [online, setOnline] = useState<boolean>()

    const toStatusReference = useMemo(() => {
        return ref(rt, `${DB_USERS}/${item.id}/status`)
    }, [item.id])

    const handleStatusValue = useCallback(async (snapshot: DataSnapshot) => {
        if (!snapshot.key)
            return

        const isOnline: boolean = snapshot.val()

        setOnline(isOnline)
    }, [item.id])

    const statusListenerConfig: UseListenerConfig = useMemo(() => {
        return {
            value: {
                callback: handleStatusValue,
                errorCallback: statusChangedErrorCallback
            }
        }
    }, [item.id])

    useListener(toStatusReference, statusListenerConfig)

    return (
        <li key={item.id} className="w-full h-auto p-2 mb-2 flex flex-row justify-between items-center rounded-md bg-black">
            <div className="h-2 aspect-square rounded-lg" style={{backgroundColor: online ? "var(--color-green)" : "var(--color-red)"}}></div>
            <div className="w-[90%] px-4 flex flex-col items-end">
                <p style={{color: isCreator ? "var(--color-gold)" : "var(--color-dark-white)", display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "calc(100%)"}}>{item.name}</p>
                <p className="text-green font-jbm" style={{display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "calc(100%)"}}>{`@${item.username}`}</p>
            </div>
        </li>
    )
}

function GroupChatHeader({ current } : GroupHeaderProps) {
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
        return GroupMemberStatusItem(item, item.id === current.creator)
    }

    return (
        <>
            <Image src={DEFAULT_GROUP_PFP} alt="pfp" width={SQUARE_IMAGE_SIZE} height={SQUARE_IMAGE_SIZE} className="md:p-2 md:space-x-4" />
            <div className="md:w-auto md:h-full md:flex md:flex-col md:justify-center md:space-y-2">
                <h2 className="font-jbm text-white md:text-lg">{current.name}</h2>
                <DropList<GroupMember> open={isOpen} TitleComponent={<DropListTitle />} items={current.members} render={renderDropList} containerTailwind="w-60 h-5 p-1 text-light-grey space-y-4 border border-light-grey rounded z-10" />
            </div>
        </>
    )
}

function DirectChatHeader({ current } : DirectHeaderProps) {

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
                ((current as GroupChatMetaData).isGroup ? <GroupChatHeader current={current as GroupChatMetaData} /> : <DirectChatHeader current={current as DirectChatMetaData} />) : 
                <></>
            }
        </header>
    )
}
