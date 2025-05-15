import { API_PROFILE } from "@/lib/constants/routes"
import { PFPEditorProps } from "@/lib/types/props"
import Image from "next/image"
import { MouseEvent } from "react"

export default function PFPEditor({ profile } : PFPEditorProps) {
    
    async function handleUpload(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}${API_PROFILE}`, {
            method: "PUT"
        })
    }

    return (
        <form className="h-full w-[25%] rounded border border-dark-grey md:py-20 md:flex md:flex-col md:justify-between md:items-center">
            <Image src={profile.pfp} alt="PFP" width={100} height={100} className="md:w-1/2 aspect-square" />
            <button onClick={handleUpload} className="font-jbm text-light-grey hover:text-blue hover:cursor-pointer">Upload Photo</button>
        </form>
    )
}
