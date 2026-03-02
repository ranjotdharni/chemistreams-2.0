import { SANSA_STARK_PFP, SHADOW_HOODIE_PFP } from "@/lib/constants/client"

export default function EmbedVideosCard({ containerTailwind } : { containerTailwind?: string }) {
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
        <article className={`bg-black rounded-lg p-4 space-y-4 ${containerTailwind}`}>
            <header className="h-1/6 w-full px-2 flex flex-row justify-start items-center space-x-4">
                <img src={SANSA_STARK_PFP} alt="main feature pfp" className="h-full aspect-square" />
                <p>
                    <span className="text-amber-50 font-jbm">Sansa Stark</span>
                    <br></br>
                    <span className="text-light-grey text-xs font-jbm">Not A Little Bird Anymore</span>
                </p>
            </header>

            <div className="w-full h-0.5 bg-dark-grey"></div>

            <section className="h-5/6 w-full">
                <MessagePFP img={SHADOW_HOODIE_PFP} name="Yousef Al-Zaidi" username="yal-zaidi1" right />
                <iframe
                    src={`https://www.youtube.com/embed/HR2C_7G_yRQ`}
                    width="75%"
                    height="50%"
                    allow="encrypted-media"
                    className="mt-2 relative left-1/4"
                >
                </iframe>

                <MessagePFP img={SANSA_STARK_PFP} name="Sansa Stark" username="sstark1" />
                <Message text="Wow, that is awesome!" tailwind="rounded-t-lg rounded-br-lg mt-2" />
            </section>
        </article>
    )
}
