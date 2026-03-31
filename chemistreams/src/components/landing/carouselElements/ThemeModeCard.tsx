import { BAG_HEAD_PFP, BILLIE_EILISH_PFP } from "@/lib/constants/client"

export default function ThemeModeCard({ containerTailwind } : { containerTailwind?: string }) {
    
    function MessagePFP({ img, name, username, right } : { img: string, name: string, username: string, right?: boolean }) {
        return (
            <section style={{flexDirection: right ? "row-reverse" : "row"}} className="h-8 w-full flex justify-start items-center mt-2 space-x-4">
                <img src={img} alt="message pfp" className="h-full aspect-square" />
                <span className="text-dark-grey font-jbm">{name}</span>
                <span className="text-light-grey font-jbm text-xs" style={{marginRight: right ? "1em" : undefined}}>(@{username})</span>
            </section>
        )
    }

    function Message({ text, tailwind, right } : { text: string, tailwind?: string, right?: boolean }) {
        return (
            <p className="w-full text-amber-50 font-jbm flex flex-row" style={{justifyContent: right ? "flex-end" : "flex-start"}}>
                <span className={`max-w-4/5 bg-green px-2 py-1 ${tailwind ? tailwind : ""}`}>{text}</span>
            </p>
        )
    }

    return (
        <article className={`bg-white rounded-lg p-4 space-y-4 flex flex-col ${containerTailwind}`}>
            <header className="h-1/6 w-full px-2 flex flex-row justify-start items-center space-x-4">
                <img src={BILLIE_EILISH_PFP} alt="main feature pfp" className="h-full aspect-square" />
                <p>
                    <span className="text-green font-jbm">Billie Eilish</span>
                    <br></br>
                    <span className="text-dark-grey text-xs font-jbm">You Should See Me In A Crown</span>
                </p>
            </header>

            <div className="w-full h-0.5 bg-light-grey"></div>

            <section className="h-5/6 w-full overflow-auto">
                <MessagePFP img={BAG_HEAD_PFP} name="Charles Matte" username="cmatte1" right />
                <Message text="Oh God, Billie. Were you ever cool?" tailwind="rounded-t-lg rounded-bl-lg mt-2" right />

                <MessagePFP img={BILLIE_EILISH_PFP} name="Billie Eilish" username="beilish1" />
                <Message text="Oh yeah, Charles? Well, I pity the fool who thinks I'm uncool." tailwind="rounded-t-lg rounded-br-lg mt-2" />
                <Message text="Get it? I was making a Dr. T reference." tailwind="rounded-tr-lg rounded-b-lg mt-0.5" />
            </section>
        </article>
    )
}
