import ChatList from "./ChatList"
import ChatView from "./ChatView"
import Toolbar from "./Toolbar"

export default function ChatContainer() {

    return (
        <main className="bg-black md:w-[85%] md:h-[85%] md:rounded-2xl">
            <Toolbar />
            <ChatList />
            <ChatView />
        </main>
    )
}
