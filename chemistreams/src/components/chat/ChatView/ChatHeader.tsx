"use client"

import { ChatMetaData, DirectChatMetaData, GenericError, GroupChatMetaData, GroupMember } from "@/lib/types/client"
import { DEFAULT_GROUP_PFP, SQUARE_IMAGE_SIZE } from "@/lib/constants/client"
import { useDatabaseErrorHandler } from "@/lib/hooks/useDatabaseErrorHandler"
import { FormEvent, JSX, MouseEvent, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { UseListenerConfig } from "@/lib/types/hooks"
import { DataSnapshot, get, ref, set } from "firebase/database"
import { ChatHeaderProps } from "@/lib/types/props"
import DropList from "@/components/utils/DropList"
import { DB_METADATA, DB_USERS } from "@/lib/constants/routes"
import useListener from "@/lib/hooks/useListener"
import { rt } from "@/lib/auth/firebase"
import Image from "next/image"
import { Edit } from "lucide-react"
import { AuthContext } from "@/lib/context/AuthContext"
import { isValidAlias } from "@/lib/utils/client"
import { InterfaceContext } from "@/lib/context/InterfaceContext"

interface DirectHeaderProps {
    current: DirectChatMetaData
}

interface GroupHeaderProps {
    current: GroupChatMetaData
    editChat: (update: ChatMetaData) => void
}

function GroupAliasEditor({ current, editable, editChat } : { current: GroupChatMetaData, editable: boolean, editChat: (update: ChatMetaData) => void }) {
    const { user } = useContext(AuthContext)
    const UIControl = useContext(InterfaceContext)

    const [editorOpen, setEditorOpen] = useState<boolean>(false)
    const [copy, setCopy] = useState<string>(current.name)
    const [text, setText] = useState<string>(current.name)

    async function save(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!user)
            return

        const alias: string = text.trim()

        if (alias === current.name)
            return

        const invalidAlias: GenericError | undefined = isValidAlias(alias)

        if (invalidAlias) {
            UIControl.setText((invalidAlias as GenericError).message, "red")
            return
        }

        const chatOwnerSnapshot = await get(ref(rt, `${DB_METADATA}/${current.id}/creator`))
        const chatOwner = chatOwnerSnapshot.val()

        if (!chatOwner || chatOwner !== user.uid) {
            UIControl.setText("Only chat owner may change group name.", "red")
            return
        }

        await set(ref(rt, `${DB_METADATA}/${current.id}/alias`), alias)

        const updateChat: GroupChatMetaData = {
            ...current,
            name: alias
        }

        setText(alias)
        setCopy(alias)
        editChat(updateChat)
        UIControl.setText("Group name changed.", "green")
    }

    function toggle(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        if (text !== copy)
            setText(copy)

        setEditorOpen(previous => !previous)
    }
    
    return (
        <div className="w-full flex flex-row">
            {
                editorOpen ?
                <form onSubmit={save} className="md:w-[90%] md:flex md:flex-row md:justify-evenly md:items-center">
                    <input value={text} onChange={e => { setText(e.target.value) }} className="font-jbm text-white px-2 focus:text-green w-[85%] outline-none border-b border-dark-white" />
                    <button type="submit" className="w-[10%] h-3/4 rounded text-[0.8em] font-jbm border border-green text-white hover:bg-green hover:cursor-pointer transition-colors duration-200">Save</button>
                </form> :
                <h2 className="font-jbm text-white border border-dark-grey px-2 rounded md:text-lg md:w-[90%]" style={{display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{text}</h2>
            }
            {
                editable ?
                <button onClick={toggle} className="md:h-[90%] md:aspect-square text-light-grey hover:cursor-pointer hover:text-green">
                    <Edit className="p-1 w-full h-full" />
                </button> : 
                <></>
            }
        </div>
    )
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
        <li key={item.id} className="w-full h-auto p-2 mb-2 flex flex-row justify-between items-center rounded-md bg-black" style={{borderBottom: "solid 1px var(--color-dark-grey)"}} >
            <div className="h-2 aspect-square rounded-lg" style={{backgroundColor: online ? "var(--color-green)" : "var(--color-red)"}}></div>
            <div className="w-[90%] px-4 flex flex-col items-end">
                <p style={{color: isCreator ? "var(--color-gold)" : "var(--color-dark-white)", display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "calc(100%)"}}>{item.name}</p>
                <p className="text-green font-jbm" style={{display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "calc(100%)"}}>{`@${item.username}`}</p>
            </div>
        </li>
    )
}

function GroupChatHeader({ current, editChat } : GroupHeaderProps) {
    const { user } = useContext(AuthContext)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    function DropListTitle() {
        return (
            <button onClick={() => { setIsOpen(!isOpen) }} className="text-sm w-full flex flex-col justify-center items-center font-jbm hover:cursor-pointer">
                {
                    isOpen ? 
                    <p className="w-full py-1 border border-light-grey text-light-grey rounded hover:text-black hover:cursor-pointer hover:bg-light-grey transition-colors duration-200">Close</p> : 
                    <p className="w-full py-1 border border-green text-white rounded hover:cursor-pointer hover:bg-green transition-colors duration-200">View Members</p>
                }
            </button>
        )
    }

    function renderDropList(item: GroupMember, index: number): JSX.Element {
        return GroupMemberStatusItem(item, item.id === current.creator)
    }

    return (
        <>
            <Image src={DEFAULT_GROUP_PFP} alt="pfp" width={SQUARE_IMAGE_SIZE} height={SQUARE_IMAGE_SIZE} className="md:p-2 md:w-[10%] aspect-square md:space-x-4" />
            <div className="md:w-[90%] md:h-full md:flex md:flex-col md:justify-center md:space-y-2">
                <GroupAliasEditor current={current} editable={user?.uid === current.creator} editChat={editChat} />
                <DropList<GroupMember> open={isOpen} TitleComponent={<DropListTitle />} items={current.members} render={renderDropList} containerTailwind="w-[35%] h-5 text-light-grey space-y-4 z-10" />
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

export default function ChatHeader({ current, editChat } : ChatHeaderProps) {

    return (
        <header className="md:w-full md:h-[15%] border-b border-dark-grey md:flex md:flex-row md:justify-start md:items-center md:p-4">
            {
                current ?
                ((current as GroupChatMetaData).isGroup ? <GroupChatHeader current={current as GroupChatMetaData} editChat={editChat} /> : <DirectChatHeader current={current as DirectChatMetaData} />) : 
                <></>
            }
        </header>
    )
}
