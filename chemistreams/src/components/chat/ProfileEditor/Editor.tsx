import { EditorProps } from "@/lib/types/props"
import DetailsEditor from "./DetailsEditor"
import BadgeEditor from "./BadgeEditor"
import PFPEditor from "./PFPEditor"

export default function Editor({ profile, setProfile } : EditorProps) {
    return (
        <div className="w-full h-full flex flex-col">
            <h1 className="w-full h-[10%] border-b border-dark-white text-green p-2 text-2xl font-lato flex flex-col justify-center">Edit Your Profile</h1>
            <div className="w-full h-auto max-h-[90%] overflow-y-scroll overflow-x-hidden md:h-[90%] flex flex-col items-center">
                <div className="w-full h-[75%] md:h-[60%] p-3 flex flex-col md:flex-row justify-evenly items-center space-y-2 md:space-y-0">
                    <PFPEditor profile={profile} setProfile={setProfile} />
                    <DetailsEditor profile={profile} setProfile={setProfile} />
                </div>
                <div className="w-full h-[40%] p-4 flex flex-col">
                    <BadgeEditor profile={profile} setProfile={setProfile} />
                </div>
            </div>
        </div>
    )
}
