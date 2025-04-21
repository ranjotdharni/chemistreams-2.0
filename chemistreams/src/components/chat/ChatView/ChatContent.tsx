import { ChatMessage, ChatMetaData } from "@/lib/types/client"
import { ChatContentProps } from "@/lib/types/props"

interface ChatProps {
    current: ChatMetaData
}

const mockData: ChatMessage[] = [
    {
        id: 110,
        message: "Hey, what's up?",
        timestamp: new Date()
    },
    {
        id: 111,
        message: "What are you doing?",
        timestamp: new Date()
    },
    {
        id: 112,
        incoming: true,
        message: "Not much, wbu?",
        timestamp: new Date()
    },
    {
        id: 113,
        message: "Same :/",
        timestamp: new Date()
    },
    {
        id: 114,
        incoming: true,
        message: "Wanna hang out?? this is me typing some more stuff so that I can test the padding and width constraints on an element.",
        timestamp: new Date()
    }
]

function Message({ incoming = false, message, timestamp } : ChatMessage) {
    const tailwindContainer: string = `w-full p-2 flex items-center justify-start ${incoming ? "flex-row" : "flex-row-reverse"}`
    const tailwindMessage: string = `${incoming ? "bg-dark-grey" : "bg-green"} max-w-[47.5%] text-dark-white px-4 py-1 rounded-2xl font-jbm`
    const tailwindTimestamp: string = `w-[52.5%] flex flex-row ${incoming ? "justify-start" : "justify-end"} px-6 font-roboto text-light-grey opacity-0 hover:opacity-100`

    return (
        <li className={tailwindContainer}>
            <p className={tailwindMessage}>{message}</p>
            <p className={tailwindTimestamp}>{`${timestamp.getHours()}:${timestamp.getMinutes()}`}</p>
        </li>
    )
}

function Chat({ current } : ChatProps) {

    return (
        <ul className="md:w-full md:h-[75%]">
            {
                mockData.map(message => {
                    return <Message id={message.id} incoming={message.incoming} message={message.message} timestamp={message.timestamp} />
                })
            }
        </ul>
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
