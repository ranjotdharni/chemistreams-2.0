import { GLOW_EYES_PFP, THOR_PFP } from "@/lib/constants/client"

export default function EmbedMessagesCard({ containerTailwind } : { containerTailwind?: string }) {
    function MessagePFP({ img, name, username, right } : { img: string, name: string, username: string, right?: boolean }) {
        return (
            <section style={{flexDirection: right ? "row-reverse" : "row"}} className="h-8 w-full flex justify-start items-center mt-2 space-x-4">
                <img src={img} alt="message pfp" className="h-full aspect-square" />
                <span className="text-white font-jbm">{name}</span>
                <span className="text-light-grey font-jbm text-xs" style={{marginRight: right ? "1em" : undefined}}>(@{username})</span>
            </section>
        )
    }

    function Message({ text, tailwind, right } : { text: string, tailwind?: string, right?: boolean }) {
        return (
            <p className="w-full text-dark-grey font-jbm flex flex-row" style={{justifyContent: right ? "flex-end" : "flex-start"}}>
                <span className={`max-w-4/5 bg-green px-2 py-1 ${tailwind ? tailwind : ""}`}>{text}</span>
            </p>
        )
    }

    return (
        <article className={`bg-black rounded-lg p-4 space-y-4 flex flex-col ${containerTailwind}`}>
            <header className="h-1/6 w-full px-2 flex flex-row justify-start items-center space-x-4">
                <img src={GLOW_EYES_PFP} alt="main feature pfp" className="h-full aspect-square" />
                <p>
                    <span className="text-amber-50 font-jbm">James Madden</span>
                    <br></br>
                    <span className="text-light-grey text-xs font-jbm">Flee On Sight</span>
                </p>
            </header>

            <div className="w-full h-0.5 bg-dark-grey"></div>

            <section className="h-5/6 w-full overflow-auto">
                <MessagePFP img={GLOW_EYES_PFP} name="James Madden" username="jmadden1" />
                <iframe
                    src={`https://open.spotify.com/embed/track/7MXVkk9YMctZqd1Srtv4MB`}
                    width="75%"
                    height="50%"
                    allow="encrypted-media"
                    className="mt-2"
                >
                </iframe>

                <MessagePFP img={THOR_PFP} name="Thor Odinson" username="todinson1" right />
                <Message text="Huzzah, brother! That is my jam!" tailwind="rounded-t-lg rounded-bl-lg mt-2" right />
            </section>
        </article>
    )
}
