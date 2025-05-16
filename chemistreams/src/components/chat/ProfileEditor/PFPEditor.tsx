"use client"

import { API_PROFILE } from "@/lib/constants/routes"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { PFPEditorProps } from "@/lib/types/props"
import Image from "next/image"
import { ChangeEvent, MouseEvent, useContext, useState } from "react"

function Uploader({ cancel } : { cancel: (event: MouseEvent<HTMLButtonElement>) => void }) {
    const UIControl = useContext(InterfaceContext)

    const [image, setImage] = useState<File | null | undefined>()

    function handleImage(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        setImage(event.target.files?.item(0))
    }

    async function handleUpload(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        if (!image)
            return

        const formData = new FormData()
        formData.append("file", image)

        try {
            await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}${API_PROFILE}`, {
                method: "PUT",
                body: formData
            })
        }
        catch (error) {
            UIControl.setText("FATAL ERROR: Internal Server Error 500", "red")
            return
        }

        setImage(null)
    }

    return (
        <form className="space-y-4 px-2 w-full flex flex-col items-center">
            <input type="file" accept="image/*" onChange={handleImage} className="text-dark-white font-lato flex flex-row justify-center file:bg-green file:px-1 file:mx-2 file:rounded file:font-jbm hover:file:cursor-pointer" />
            <div className="w-full flex flex-row justify-end space-x-2">
                <button onClick={cancel} className="px-2 font-lato rounded border border-light-grey text-light-grey hover:cursor-pointer hover:text-black hover:bg-light-grey transition-colors duration-200">Cancel</button>
                <button onClick={handleUpload} type="submit" className="px-2 font-lato rounded border border-green text-green hover:cursor-pointer hover:text-white hover:bg-green transition-colors duration-200">Save</button>
            </div>
        </form>
    )
}

export default function PFPEditor({ profile } : PFPEditorProps) {
    const [showUpload, setShowUpload] = useState<boolean>(false)

    function toggleUploader(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        setShowUpload(previous => !previous)
    }

    return (
        <div className="h-full w-[25%] rounded border border-dark-grey md:py-20 md:flex md:flex-col md:justify-between md:items-center">
            <Image src={profile.pfp} alt="PFP" width={100} height={100} className="md:w-1/2 aspect-square" />
            {
                showUpload ?
                <Uploader cancel={toggleUploader} /> :
                <button onClick={toggleUploader} className="font-jbm text-light-grey hover:text-blue hover:cursor-pointer">Upload Photo</button>
            }
        </div>
    )
}
