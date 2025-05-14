"use client"

import { DB_GROUPS, DB_METADATA, DB_USERNAMES, DB_USERS } from "@/lib/constants/routes"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { get, ref, set, update } from "firebase/database"
import { MouseEvent, useContext, useState } from "react"
import { AuthContext } from "@/lib/context/AuthContext"
import { rt } from "@/lib/auth/firebase"
import { Plus, X } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface NewChatDetails {
    username: string
    uid: string
}

interface NewChatListItemProps {
    details: NewChatDetails
    remove: (event: MouseEvent<HTMLButtonElement>) => void
}

interface NewChatListProps {
    newChatDetails: NewChatDetails[]
    removeCallback: (uid: string) => (event: MouseEvent<HTMLButtonElement>) => void
    cancelCallback: (event: MouseEvent<HTMLButtonElement>) => void
    createCallback: (event: MouseEvent<HTMLButtonElement>) => void
}

function NewChatListItem({ details, remove } : NewChatListItemProps) {
    return (
        <li className="border border-dark-grey md:py-1 md:px-2 md:rounded-md md:w-full md:flex md:flex-row md:justify-between">
            <p className="text-green font-jbm">{`@${details.username}`}</p>
            <button onClick={remove} className="text-light-grey hover:text-red hover:cursor-pointer md:h-full md:aspect-square">
                <X className="w-full h-full" />
            </button>
        </li>
    )
}

function NewChatList({ newChatDetails, removeCallback, cancelCallback, createCallback } : NewChatListProps) {

    return (
        <div className="md:px-4 md:space-y-2">
            <ul className="md:space-y-1">
                {
                    newChatDetails.map(detail => {
                        return <NewChatListItem key={detail.uid} details={detail} remove={removeCallback(detail.uid)} />
                    })
                }
            </ul>

            <div className="md:space-x-2 md:flex md:flex-row md:justify-end">
                <button className="hover:cursor-pointer bg-red text-dark-grey md:px-2 md:rounded-sm" onClick={cancelCallback}>Cancel</button>
                <button className="hover:cursor-pointer bg-green text-white md:px-2 md:rounded-sm" onClick={createCallback}>Create</button>
            </div>
        </div>
    )
}

export default function NewChat() {
    const { user } = useContext(AuthContext)
    const UIControl = useContext(InterfaceContext)

    const [searchQuery, setSearchQuery] = useState<string>("")
    const [newChatUsers, setNewChatUsers] = useState<NewChatDetails[]>([])

    async function addNewChatUser(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        const trimmedSearchQuery: string = searchQuery.trim()

        if (trimmedSearchQuery === "") {
            UIControl.setText("Please enter some text.", "red")
            return
        }

        if (newChatUsers.find(u => u.username === trimmedSearchQuery) !== undefined) {
            UIControl.setText("User already added.", "red")
            return
        }

        const reference = ref(rt, `${DB_USERNAMES}/${trimmedSearchQuery}`)
        let snapshot

        try {
            snapshot = await get(reference)
        }
        catch (error) {
            console.log(error)
            UIControl.setText("CHATLIST_USERNAME_ADDNEWCHATUSER_ERROR: 500 Internal Server Error", "red")
            return
        }

        if (!snapshot.exists()) {
            UIControl.setText("User not found.", "red")
            return
        }

        const userUid: string = snapshot.val()

        if (!user || user.uid === userUid) {
            UIControl.setText("You may not add yourself.", "red")
            return
        }

        const updatedNewChatUsers = [...newChatUsers]

        updatedNewChatUsers.push({
            username: trimmedSearchQuery,
            uid: userUid
        } as NewChatDetails)

        setSearchQuery("")
        setNewChatUsers(updatedNewChatUsers)
    }

    function removeNewChatUser(uid: string): (event: MouseEvent<HTMLButtonElement>) => void {
        return (event: MouseEvent<HTMLButtonElement>) => {
            event.preventDefault()

            const toBeRemovedIndex: number = newChatUsers.findIndex(u => u.uid === uid)

            if (toBeRemovedIndex !== -1) {
                const updatedNewChatUsers = [...newChatUsers]
                updatedNewChatUsers.splice(toBeRemovedIndex, 1)
                setNewChatUsers(updatedNewChatUsers)
            }
        }
    }

    function cancel(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        setNewChatUsers([])
    }

    async function createDirectChat() {
        if (!user)
            return

        const chatId: string = uuidv4()
        const toUserId: string = newChatUsers[0].uid

        try {
            // update metadata
            const metadataReference = ref(rt, `${DB_METADATA}/${chatId}`)
            await set(metadataReference, {
                creator: user.uid,
                to: toUserId
            })

            // add to both users chats
            const creatorUpdatePath: string = `${DB_USERS}/${user.uid}/chats/${chatId}`
            const toUpdatePath: string = `${DB_USERS}/${toUserId}/chats/${chatId}`

            const updates: Record<string, string> = {
                [creatorUpdatePath]: "",
                [toUpdatePath]: ""
            }

            await update(ref(rt), updates)
        }
        catch (error) {
            console.log(error)
            UIControl.setText("CHATLIST_CREATEDIRECTCHAT_ERROR: 500 Internal Server Error", "red")
            return
        }

        setNewChatUsers([])
        UIControl.setText("Chat Created.", "green")
    }

    async function createGroupChat() {
        if (!user)
            return

        const chatId: string = uuidv4()

        try {
            // update metadata + groups
            const metadataUpdate: Record<string, any> = {
                [`${DB_METADATA}/${chatId}`]: {
                    creator: user.uid,
                    group: true,
                    alias: user.displayName ? `${user.displayName}'s Group` : "New Group Chat"
                }
            }

            // add all users to group's members list and users' chats list
            const groupUpdateMembers: string[] = [user.uid, ...newChatUsers.map(u => u.uid)]
            const groupUpdates: Record<string, boolean> = {}
            const chatUpdates: Record<string, string> = {}

            for (let uid of groupUpdateMembers) {
                groupUpdates[`${DB_GROUPS}/${chatId}/${uid}`] = true
                chatUpdates[`${DB_USERS}/${uid}/chats/${chatId}`] = ""
            }

            await update(ref(rt), {...metadataUpdate, ...groupUpdates, ...chatUpdates})
        }
        catch (error) {
            console.log(error)
            UIControl.setText("CHATLIST_CREATEGROUPCHAT_ERROR: 500 Internal Server Error", "red")
            return
        }

        setNewChatUsers([])
        UIControl.setText("Group Chat Created.", "green")
    }

    function create(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        const endParticipantCount: number = newChatUsers.length

        if (endParticipantCount === 0) {
            return
        }
        else if (endParticipantCount === 1) {
            createDirectChat()
        }
        else {
            createGroupChat()
        }
    }

    return (
        <div className="md:w-full md:h-auto md:flex md:flex-col md:space-y-2">
            <div className="md:w-full md:h-10 md:flex md:flex-row md:justify-between">
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by username..." className={`md:w-[87.5%] md:h-full md:rounded-3xl md:px-3 font-jbm ${searchQuery.trim() === "" ? "text-light-grey" : "text-dark-white"} bg-dark-grey outline-none`} />
                <button onClick={addNewChatUser} className="md:w-[12.5%] md:h-full md:p-2 md:flex md:flex-row md:justify-center text-light-grey hover:text-green hover:cursor-pointer">
                    <Plus className="w-full h-full" />
                </button>
            </div>

            {
                newChatUsers.length !== 0 && <NewChatList newChatDetails={newChatUsers} removeCallback={removeNewChatUser} cancelCallback={cancel} createCallback={create} />
            }
        </div>
    )
}