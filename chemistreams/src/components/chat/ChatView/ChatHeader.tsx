"use client"

import { ChatMetaData, DirectChatMetaData, GenericError, GroupChatMetaData, GroupMember } from "@/lib/types/client"
import { FormEvent, JSX, MouseEvent, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useDatabaseErrorHandler } from "@/lib/hooks/useDatabaseErrorHandler"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { DataSnapshot, get, ref, set } from "firebase/database"
import { DB_METADATA, DB_USERS } from "@/lib/constants/routes"
import { AuthContext } from "@/lib/context/AuthContext"
import { UseListenerConfig } from "@/lib/types/hooks"
import { ChatHeaderProps } from "@/lib/types/props"
import GroupPFP from "@/components/utils/GroupPFP"
import DropList from "@/components/utils/DropList"
import useListener from "@/lib/hooks/useListener"
import { isValidAlias } from "@/lib/utils/client"
import { rt } from "@/lib/auth/firebase"
import PFP from "@/components/utils/PFP"
import { Edit } from "lucide-react"

interface DirectHeaderProps {
    current: DirectChatMetaData
    chatList: ChatMetaData[]
    setCurrentChat: (current: ChatMetaData) => void
}

interface GroupHeaderProps {
    current: GroupChatMetaData
    editChat: (update: ChatMetaData) => void
    chatList: ChatMetaData[]
    setCurrentChat: (current: ChatMetaData) => void
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

    useEffect(() => {
        setText(current.name)
        setCopy(current.name)
    }, [current])
    
    return (
        <div className="w-full flex flex-row">
            {
                editorOpen ?
                <form onSubmit={save} className="w-[90%] flex flex-row justify-evenly items-center">
                    <input value={text} onChange={e => { setText(e.target.value) }} className="font-jbm text-white px-2 focus:text-green w-[60%] md:w-[85%] outline-none border-b border-dark-white" />
                    <button type="submit" className="w-[20%] md:w-[10%] h-3/4 rounded text-[0.8em] font-jbm border border-green text-white hover:bg-green hover:cursor-pointer transition-colors duration-200">Save</button>
                </form> :
                <h2 className="font-jbm text-white border border-dark-grey px-2 rounded md:text-lg w-[90%]" style={{display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{text}</h2>
            }
            {
                editable ?
                <button onClick={toggle} className="h-[90%] aspect-square text-light-grey hover:cursor-pointer hover:text-green">
                    <Edit className="p-1 w-full h-full" />
                </button> : 
                <></>
            }
        </div>
    )
}

function GroupMemberStatusItem({ item, isCreator, chatList, setCurrentChat } : { item: GroupMember, isCreator: boolean, chatList: ChatMetaData[], setCurrentChat: (chat: ChatMetaData) => void }) {
    const [statusChangedErrorCallback, setStatusChangedErrorCallback] = useDatabaseErrorHandler("GROUPMEMBERSTATUSITEM_STATUS_VALUE_ERROR")
    const [online, setOnline] = useState<boolean>(false)
    const { user } = useContext(AuthContext)
    const UIControl = useContext(InterfaceContext)

    function viewProfile(event: MouseEvent<HTMLLIElement>) {
        event.preventDefault()

        if (!user)
            return

        UIControl.setProfileView(
            user.uid,
            {
                uid: item.id,
                username: item.username,
                status: item.status,
                name: item.name,
                pfp: item.pfp,
                badge: item.badge
            },
            setCurrentChat,
            item.id === user.uid ? undefined : chatList.find(c => c.creator === item.id || ((c as DirectChatMetaData).to !== undefined && (c as DirectChatMetaData).to === item.id))
        )
    }

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
        <li key={item.id} onClick={viewProfile} className="w-full h-auto p-2 mb-2 flex flex-row justify-between items-center rounded-md bg-black hover:cursor-pointer" style={{borderBottom: "solid 1px var(--color-dark-grey)"}} >
            <PFP length="4em" useHeight src={item.pfp.link} online={online} bgColor="var(--color-black)" />
            <div className="w-[90%] px-4 flex flex-col items-end">
                <p style={{color: isCreator ? "var(--color-gold)" : "var(--color-dark-white)", display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "calc(100%)"}}>{item.name}</p>
                <p className="text-green font-jbm" style={{display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "calc(100%)"}}>{`@${item.username}`}</p>
            </div>
        </li>
    )
}

function GroupChatHeader({ current, editChat, setCurrentChat, chatList } : GroupHeaderProps) {
    const { user } = useContext(AuthContext)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [mobile, setMobile] = useState<boolean>(false)

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
        return <GroupMemberStatusItem key={item.id} item={item} isCreator={item.id === current.creator} chatList={chatList} setCurrentChat={setCurrentChat} />
    }

    useEffect(() => {
        function resize() {
            setMobile(window.screen.width < 640 ? true : false)
        }

        resize()

        window.addEventListener("resize", resize)

        return () => {
            window.removeEventListener("resize", resize)
        }

    }, [])

    return (
        <>
            <GroupPFP pfps={current.members.map(m => m.pfp)} length={mobile ? "20%" : "10%"} />
            <div className="w-[80%] md:w-[90%] h-full flex flex-col justify-center space-y-2">
                <GroupAliasEditor current={current} editable={user?.uid === current.creator} editChat={editChat} />
                <DropList<GroupMember> open={isOpen} TitleComponent={<DropListTitle />} items={current.members} render={renderDropList} containerTailwind="w-full md:w-[35%] h-5 text-light-grey space-y-4 z-10" height="auto" maxHeight="400px" />
            </div>
        </>
    )
}

function DirectChatHeader({ current, setCurrentChat, chatList } : DirectHeaderProps) {
    const { user } = useContext(AuthContext)
    const UIControl = useContext(InterfaceContext)

    function viewProfile(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        if (!user)
            return

        UIControl.setProfileView(
            user.uid,
            {
                uid: current.to,
                username: current.username,
                name: current.name,
                status: current.status,
                pfp: current.pfp,
                badge: current.badge
            },
            setCurrentChat,
            current
        )
    }

    return (
        <>
            <button className="h-full aspect-square hover:cursor-pointer hover:opacity-[0.75]" onClick={viewProfile}>
                <PFP src={current.pfp.link} length={"100%"} useHeight disable={!current.badge} badge={current.badge} bgColor="var(--color-black)" />
            </button>
            <div className="w-auto h-full flex flex-col justify-center space-y-2">
                <h2 className="font-jbm text-white md:text-lg md:mt-3">{current.name}</h2>
                <p className="font-jbm text-light-grey md:text-sm">{current.status}</p>
            </div>
        </>
    )
}

export default function ChatHeader({ current, editChat, chatList, setCurrentChat } : ChatHeaderProps) {

    return (
        <header className="w-full h-[15%] border-b border-dark-grey flex flex-row justify-start items-center p-4">
            {
                current ?
                ((current as GroupChatMetaData).isGroup ? <GroupChatHeader current={current as GroupChatMetaData} editChat={editChat} setCurrentChat={setCurrentChat} chatList={chatList} /> : <DirectChatHeader current={current as DirectChatMetaData} setCurrentChat={setCurrentChat} chatList={chatList} />) : 
                <></>
            }
        </header>
    )
}
