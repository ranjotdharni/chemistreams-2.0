"use client"

import { NewChatProps } from "@/lib/types/props"
import { Plus } from "lucide-react"
import { ChangeEvent } from "react"

export default function NewChat({ text, onChange } : NewChatProps) {

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        onChange(event.target.value)
    }

    return (
        <div className="md:w-full md:h-[10%] md:flex md:flex-row md:items-center">
            <input value={text} onChange={handleChange} placeholder="Add Chat by Email..." className={`md:w-4/5 md:h-1/2 md:rounded-3xl md:px-3 font-montserrat ${text === "" ? "text-light-grey" : "text-dark-white"} bg-dark-grey outline-none`} />
            <button className="md:w-1/5 md:h-3/5 md:p-2 md:flex md:flex-row md:justify-center text-light-grey hover:text-green hover:cursor-pointer">
                <Plus className="w-full h-full" />
            </button>
        </div>
    )
}