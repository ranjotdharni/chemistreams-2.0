import { EditorProps } from "@/lib/types/props"
import DetailsEditor from "./DetailsEditor"
import BadgeEditor from "./BadgeEditor"
import PFPEditor from "./PFPEditor"

export default function Editor({ profile, setProfile } : EditorProps) {
    return (
        <div className="md:w-full md:h-full md:flex md:flex-col">
            <h1 className="md:w-full md:h-[10%] border-b border-dark-white text-green p-2 md:text-2xl font-lato md:flex md:flex-col md:justify-center">Edit Your Profile</h1>
            <div className="md:w-full md:h-[55%] p-3 md:flex md:flex-row md:justify-evenly">
                <PFPEditor profile={profile} setProfile={setProfile} />
                <DetailsEditor profile={profile} setProfile={setProfile} />
            </div>
            <div className="md:w-full md:h-[35%] p-4 md:flex md:flex-col">
                <BadgeEditor />
            </div>
        </div>
    )
}
