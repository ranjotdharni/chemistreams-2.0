"use client"

import { ProfileEditorProps } from "@/lib/types/props"
import Loader from "@/components/utils/Loader"
import { AuthContext } from "@/lib/context/AuthContext"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { useContext, useEffect, useState } from "react"
import Editor from "./ProfileEditor/Editor"
import { Profile } from "@/lib/types/client"
import { get, ref } from "firebase/database"
import { rt } from "@/lib/auth/firebase"
import { DB_USERS } from "@/lib/constants/routes"

export default function ProfileEditor({ show } : ProfileEditorProps) {

    const UIControl = useContext(InterfaceContext)
    const { user } = useContext(AuthContext)

    const [loader, setLoader] = useState<boolean>(true)
    const [profile, setProfile] = useState<Profile>()

    async function getInitialProps() {
        if (!user)
            return

        const profileSnapshot = await get(ref(rt, `${DB_USERS}/${user.uid}`))
        const profileData = profileSnapshot.val()
        
        if (!profileData)
            return

        setProfile({
            id: user.uid,
            username: profileData.username,
            name: user.displayName || "",
            email: user.email || "",
            pfp: profileData.pfp,
            status: profileData.bio
        })

        setLoader(false)
    }

    useEffect(() => {
        async function instateProps() {
            await getInitialProps()
        }

        instateProps()
    }, [])

    return ( 
        <section className="bg-black flex-shrink-0 md:w-[92.5%] md:-left-[92.5%] p-2 md:h-full md:relative md:flex md:justify-center md:items-center" style={{zIndex: show ? 20 : 0}}>
            {
                show ? 
                loader || !profile ? 
                <Loader containerTailwind="md:w-40 md:h-8" options={{zIndex: show ? 20 : 0}} /> : 
                <Editor profile={profile} /> :
                <></>
            }
        </section>
    )
}
