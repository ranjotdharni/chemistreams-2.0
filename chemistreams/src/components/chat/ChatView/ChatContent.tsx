import { ChatContentProps } from "@/lib/types/props"
import { ChatMetaData } from "@/lib/types/client"

interface ChatProps {
    current: ChatMetaData
}

function Chat({ current } : ChatProps) {

    return (
        <section className="md:w-full md:h-[75%]">
            
        </section>
    )
}

export default function ChatContent({ current } : ChatContentProps) {

    return (
        current ? 
        <Chat current={current} /> : 
        <section className="md:w-full md:h-[75%] md:flex md:flex-col md:justify-center md:items-center">
            <p className="text-light-grey font-jbm text-xl">Add or Select a Chat</p>
        </section>
    )
}
