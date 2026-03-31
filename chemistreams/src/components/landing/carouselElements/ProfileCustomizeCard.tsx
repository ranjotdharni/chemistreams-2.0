import { BADGES, JAMES_BOND_PFP } from "@/lib/constants/client"

export default function ProfileCustomizeCard({ containerTailwind } : { containerTailwind?: string }) {
    return (
        <article className={`bg-black rounded-lg p-4 space-y-4 flex flex-col ${containerTailwind}`}>
            <header className="h-1/2 flex flex-col justify-evenly items-center">
                <div className="relative h-fit aspect-square">
                    <img src={JAMES_BOND_PFP} alt="anime girl pfp" />
                    <img src={BADGES["BADGE_GHOSTBUSTER"].link} alt="elden ring logo" className="absolute h-[30%] aspect-square top-[70%] left-0" />
                </div>

                <span className="text-green font-jbm">Online</span>
            </header>

            <section className="w-full h-1/2 space-y-2">
                <p className="border border-dark-grey flex flex-row justify-between w-full py-1 px-2">
                    <span className="text-light-grey">Name</span>
                    <span className="text-white font-jbm">James Bond</span>
                </p>

                <p className="border border-dark-grey flex flex-row justify-between w-full py-1 px-2">
                    <span className="text-light-grey">Username</span>
                    <span className="text-green font-jbm">@jbond1</span>
                </p>

                <section className="relative top-2 px-4 space-y-1">
                    <label className="text-light-grey">Status</label>
                    <br></br>
                    <p className="text-white font-jbm border border-dark-grey p-1">Shaken, Not Stirred</p>
                </section>
            </section>
        </article>
    )
}
