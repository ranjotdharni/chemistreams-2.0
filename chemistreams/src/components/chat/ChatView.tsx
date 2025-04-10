import { ChatViewProps } from "@/lib/types/props"
import ChatContent from "./ChatView/ChatContent"
import ChatFooter from "./ChatView/ChatFooter"
import ChatHeader from "./ChatView/ChatHeader"

export default function ChatView({ current } : ChatViewProps) {

    return (
        <section className="bg-opacity-0 border-l border-dark-grey md:h-full md:w-[70%]">
            <ChatHeader current={current} />
            <ChatContent current={current} />
            <ChatFooter />
        </section>
    )
}