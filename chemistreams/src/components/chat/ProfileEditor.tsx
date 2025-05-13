import { ProfileEditorProps } from "@/lib/types/props"
import Editor from "./ProfileEditor/Editor"

export default function ProfileEditor({ show } : ProfileEditorProps) {

    return (
        <section className="bg-black flex-shrink-0 md:w-[92.5%] md:-left-[92.5%] md:h-full md:relative" style={{zIndex: show ? 20 : 0}}>
            <Editor />
        </section>
    )
}
