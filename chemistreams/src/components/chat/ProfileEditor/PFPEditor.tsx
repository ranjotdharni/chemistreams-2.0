"use client"

import { ChangeEvent, MouseEvent, useContext, useState } from "react"
import { AnimationCode, BadgeCode } from "@/lib/constants/client"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { GenericError, Profile } from "@/lib/types/client"
import { API_PROFILE } from "@/lib/constants/routes"
import { PFPEditorProps } from "@/lib/types/props"
import Loader from "@/components/utils/Loader"
import PFP from "@/components/utils/PFP"

function Uploader({ profile, cancel, close, update } : { profile: Profile, cancel: (event: MouseEvent<HTMLButtonElement>) => void, close: () => void, update: (profile: Profile) => void }) {
    const UIControl = useContext(InterfaceContext)

    const [loader, setLoader] = useState<boolean>(false)
    const [image, setImage] = useState<File | null | undefined>()

    function handleImage(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        setImage(event.target.files?.item(0))
    }

    async function handleUpload(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        if (!image || loader)
            return

        const formData = new FormData()
        formData.append("file", image)
        setLoader(true)

        try {
            const first = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}${API_PROFILE}`, {
                method: "PUT",
                body: formData
            })

            const res = await first.json()

            if (!first.ok) {
                UIControl.setText(res.message || "Failed to update Profile.", "red")
                setLoader(false)
                return
            }

            if (res.success) {
                UIControl.setText("Profile Updated.", "green")
                const newProfile: Profile = {
                    ...profile,
                    pfp: {
                        link: res.link,
                        space: res.space
                    }
                }
                update(newProfile)
            }
            else {
                UIControl.setText((res as GenericError).message, "red")
                setLoader(false)
                return
            }
        }
        catch (error) {
            UIControl.setText("FATAL ERROR: Internal Server Error 500", "red")
            setLoader(false)
            return
        }

        setImage(null)
        setLoader(false)
        close() // should be very last
    }

    return (
        <form className="space-y-4 px-2 w-full flex flex-col items-center">
            <input type="file" accept="image/*" onChange={handleImage} className="text-dark-white font-lato flex flex-row justify-center file:bg-green file:px-1 file:mx-2 file:rounded file:font-jbm hover:file:cursor-pointer" />
            {
                loader ? 
                <Loader containerTailwind="w-1/5 h-4" /> :
                <div className="w-full flex flex-row justify-end space-x-2">
                    <button onClick={cancel} className="px-2 font-lato rounded border border-light-grey text-light-grey hover:cursor-pointer hover:text-black hover:bg-light-grey transition-colors duration-200">Cancel</button>
                    <button onClick={handleUpload} type="submit" className="px-2 font-lato rounded border border-green text-green hover:cursor-pointer hover:text-white hover:bg-green transition-colors duration-200">Save</button>
                </div>
            }
        </form>
    )
}

export default function PFPEditor({ profile, setProfile } : PFPEditorProps) {
    const [showUpload, setShowUpload] = useState<boolean>(false)

    function toggleUploader(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        setShowUpload(previous => !previous)
    }

    function close() {
        setShowUpload(false)
    }

    return (
        <div className="h-full w-[25%] rounded border border-dark-grey md:py-20 md:flex md:flex-col md:justify-between md:items-center">
            <PFP length="75%" useHeight online bgColor="var(--color-black)" src={profile.pfp.link} badge={profile.badge as { badgeCode: BadgeCode, animationCode: AnimationCode } | undefined} />
            {
                showUpload ?
                <Uploader profile={profile} cancel={toggleUploader} close={close} update={setProfile} /> :
                <button onClick={toggleUploader} className="font-jbm text-light-grey hover:text-blue hover:cursor-pointer">Upload Photo</button>
            }
        </div>
    )
}
