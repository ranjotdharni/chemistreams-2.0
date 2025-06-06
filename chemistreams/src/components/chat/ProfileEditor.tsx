"use client"

import { AuthContext } from "@/lib/context/AuthContext"
import { useContext, useEffect, useState } from "react"
import { ProfileEditorProps } from "@/lib/types/props"
import { DEFAULT_PFP } from "@/lib/constants/client"
import { DB_USERS } from "@/lib/constants/routes"
import Loader from "@/components/utils/Loader"
import { Profile } from "@/lib/types/client"
import { get, ref } from "firebase/database"
import Editor from "./ProfileEditor/Editor"
import { rt } from "@/lib/auth/firebase"

export default function ProfileEditor({ show } : ProfileEditorProps) {
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
            name: profileData.name,
            email: user.email || "",
            pfp: {
                space: profileData.pfp.space,
                link: profileData.pfp.link || DEFAULT_PFP
            },
            badge: profileData.badge,
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
        <section className="bg-black flex-shrink-0 w-[85.5%] md:w-[92.5%] -left-[143%] md:-left-[92.5%] p-2 h-auto md:h-full relative flex justify-center items-center" style={{zIndex: show ? 20 : 0}}>
            {
                show ? 
                loader || !profile ? 
                <Loader containerTailwind="w-40 h-8" options={{zIndex: show ? 20 : 0}} /> : 
                <Editor profile={profile} setProfile={setProfile} /> :
                <></>
            }
        </section>
    )
}
