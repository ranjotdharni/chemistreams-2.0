"use client"

import Loader from "@/components/utils/Loader"
import { API_PROFILE } from "@/lib/constants/routes"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { GenericError } from "@/lib/types/client"
import { PFPEditorProps } from "@/lib/types/props"
import Image from "next/image"
import { ChangeEvent, MouseEvent, useContext, useState } from "react"

function Uploader({ cancel, close, update } : { cancel: (event: MouseEvent<HTMLButtonElement>) => void, close: () => void, update: (link: string) => void }) {
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
            await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}${API_PROFILE}`, {
                method: "PUT",
                body: formData
            }).then(middle => {
                return middle.json()
            }).then(res => {
                if (res.success) {
                    update(res.link)
                }
                else {
                    UIControl.setText((res as GenericError).message, "red")
                    setLoader(false)
                    return
                }
            })
        }
        catch (error) {
            UIControl.setText("FATAL ERROR: Internal Server Error 500", "red")
            setLoader(false)
            return
        }

        setImage(null)
        setLoader(false)
        UIControl.setText("Profile Updated.", "green")
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

export default function PFPEditor({ profile } : PFPEditorProps) {
    const [showUpload, setShowUpload] = useState<boolean>(false)
    const [updated, setUpdated] = useState<string>()

    function toggleUploader(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        setShowUpload(previous => !previous)
    }

    function close() {
        setShowUpload(false)
    }

    return (
        <div className="h-full w-[25%] rounded border border-dark-grey md:py-20 md:flex md:flex-col md:justify-between md:items-center">
            <Image src={updated ? updated : profile.pfp.link} alt="PFP" width={100} height={100} className="md:w-1/2 aspect-square rounded-[100px]" />
            {
                showUpload ?
                <Uploader cancel={toggleUploader} close={close} update={setUpdated} /> :
                <button onClick={toggleUploader} className="font-jbm text-light-grey hover:text-blue hover:cursor-pointer">Upload Photo</button>
            }
        </div>
    )
}
