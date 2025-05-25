"use client"

import { isValidDisplayName, isValidStatus } from "@/lib/utils/client"
import { FormEvent, MouseEvent, useContext, useState } from "react"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { AuthContext } from "@/lib/context/AuthContext"
import { DetailsEditorProps } from "@/lib/types/props"
import { DB_USERS } from "@/lib/constants/routes"
import { GenericError } from "@/lib/types/client"
import { ref, update } from "firebase/database"
import Loader from "@/components/utils/Loader"
import { rt } from "@/lib/auth/firebase"

export default function DetailsEditor({ profile, setProfile } : DetailsEditorProps) {
    const { user } = useContext(AuthContext)

    const UIControl = useContext(InterfaceContext)

    const [loader, setLoader] = useState<boolean>(false)
    const [displayName, setDisplayName] = useState<string>(profile.name)
    const [status, setStatus] = useState<string>(profile.status)

    async function save(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!user || loader)
            return

        setLoader(true)

        const name: string = displayName.trim()
        const bio: string = status.trim()

        if (name === profile.name && bio === profile.status) {
            setLoader(false)
            return
        }
        
        const invalidName: GenericError | undefined = isValidDisplayName(name)
        const invalidStatus: GenericError | undefined = isValidStatus(bio)

        if (invalidName) {
            setLoader(false)
            UIControl.setText(invalidName.message, "red")
            return
        }
        
        if (invalidStatus) {
            setLoader(false)
            UIControl.setText(invalidStatus.message, "red")
            return
        }

        const displayNameRoute: string = `${DB_USERS}/${user.uid}/name`
        const statusRoute: string = `${DB_USERS}/${user.uid}/bio`

        let updates: Record<string, string> = {}

        if (name !== profile.name)
            updates[displayNameRoute] = name

        if (status !== profile.status)
            updates[statusRoute] = bio

        try {
            await update(ref(rt), updates)
        }
        catch (error) {
            setLoader(false)
            UIControl.setText("Failed to update profile.", "red")
            return
        }

        setLoader(false)
        UIControl.setText("Profile Updated.", "green")
        setProfile({...profile, name: name, status: bio})
    }

    function cancel(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        setDisplayName(profile.name)
        setStatus(profile.status)
    }

    return (
        <form onSubmit={save} className="h-full w-[98%] md:w-[70%] px-2 md:px-10 md:py-4 rounded border border-dark-grey flex flex-col justify-evenly">
            <h2 className="text-light-grey w-full h-[12.5%] md:h-[15%] font-lato md:text-md p-2 space-y-2">
                Account 
                <span className="w-full flex flex-row justify-between">
                    <p className="text-dark-white font-lato text-md underline">{profile.email}</p>
                    <p className="text-green font-lato text-sm">{`@${profile.username}`}</p>
                </span>
            </h2>

            <div className="w-full h-[12.5%] md:h-[15%] flex flex-col p-2">
                <label className="text-light-grey font-lato text-md">Edit Display Name</label>
                <input value={displayName} onChange={e => { setDisplayName(e.target.value) }} className="w-full h-8 p-2 font-jbm border-b border-dark-white text-dark-white focus:text-green outline-none" />
            </div>

            <div className="w-full h-[12.5%] md:h-[15%] flex flex-col p-2">
                <label className="text-light-grey font-lato text-md">Edit Status</label>
                <input value={status} onChange={e => { setStatus(e.target.value) }} placeholder="Enter status..." className="w-full h-8 p-2 font-jbm border-b border-dark-white text-dark-white focus:text-green outline-none" />
            </div>   

            <div className="w-full h-[15%] md:h-[45%] mt-[5%] md:mt-0 p-2 flex flex-row justify-end items-end space-x-4">
                <button onClick={cancel} className="w-[30%] md:w-[15%] h-full md:h-1/4 flex flex-row justify-center items-center transition-colors duration-150 md:text-md rounded-md border border-dark-white text-light-grey font-lato hover:bg-dark-white hover:text-black hover:cursor-pointer">Cancel</button>
                {
                    loader ? 
                    <Loader containerTailwind="w-[30%] md:w-[15%] h-full md:h-1/4 py-3 px-6 bg-black" /> :
                    <button type="submit" disabled={loader} className="w-[30%] md:w-[15%] h-full md:h-1/4 flex flex-row justify-center items-center transition-colors duration-150 md:text-md rounded-md hover:bg-green border border-green text-white font-lato hover:cursor-pointer">
                        Save
                    </button>
                }
            </div>       
        </form>
    )
}
