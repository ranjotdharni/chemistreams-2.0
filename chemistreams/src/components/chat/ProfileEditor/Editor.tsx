import { EditorProps } from "@/lib/types/props"
import PFPEditor from "./PFPEditor"
import DetailsEditor from "./DetailsEditor"

export default function Editor({ profile } : EditorProps) {
    return (
        <div className="md:w-full md:h-full p-2 md:flex md:flex-col">
            <h1 className="md:w-full md:h-[10%] border-b border-dark-white text-green p-2 md:text-2xl font-jbm md:flex md:flex-col md:justify-center">Edit Your Profile</h1>
            <div className="md:w-full md:h-[55%] p-4 md:flex md:flex-row">
                <PFPEditor initial={profile.pfp} />
                <DetailsEditor profile={profile} />
            </div>
        </div>
    )
}
