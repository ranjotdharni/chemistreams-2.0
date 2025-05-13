import { PFPEditorProps } from "@/lib/types/props"
import Image from "next/image"

export default function PFPEditor({ initial } : PFPEditorProps) {

    return (
        <form className="h-full w-1/4 rounded border border-dark-grey md:py-20 md:flex md:flex-col md:justify-between md:items-center">
            <Image src={initial} alt="PFP" width={100} height={100} className="md:w-1/2 aspect-square" />
            <button className="font-jbm text-light-grey hover:text-blue hover:cursor-pointer">Upload Photo</button>
        </form>
    )
}
