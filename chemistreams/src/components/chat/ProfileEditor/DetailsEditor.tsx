import { DetailsEditorProps } from "@/lib/types/props"

export default function DetailsEditor({ profile } : DetailsEditorProps) {

    return (
        <form className="h-full w-3/4 px-10 py-4 space-y-8">
            <h2 className="text-light-grey font-jbm">Email: <p className="text-dark-white font-montserrat text-lg underline">{profile.email}</p></h2>
            <h2 className="text-light-grey font-jbm">Username: <p className="text-green font-roboto text-lg">{`@${profile.username}`}</p></h2>

            <div className="w-full flex flex-col">
                <label className="text-light-grey font-jbm">Edit Name</label>
                <input value={profile.name} className="w-full h-8 p-2 font-jbm border-b border-dark-white text-dark-white focus:text-green outline-none" />
            </div>

            <div className="w-full flex flex-col">
                <label className="text-light-grey font-jbm">Edit Status</label>
                <input value={profile.status} placeholder="Enter status..." className="w-full h-8 p-2 font-jbm border-b border-dark-white text-dark-white focus:text-green outline-none" />
            </div>   

            <div className="w-full p-2 flex flex-row justify-end space-x-4">
                <button className="px-2 rounded border border-dark-white text-dark-white font-jbm hover:bg-dark-white hover:text-black hover:cursor-pointer">Cancel</button>
                <button className="px-2 rounded hover:bg-green hover:border-green hover:text-white border border-white text-white font-jbm hover:cursor-pointer">Save</button>
            </div>       
        </form>
    )
}
