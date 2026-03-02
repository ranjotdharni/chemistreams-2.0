import { ANIME_GIRL_PFP, HAYLEY_PFP, KEN_KANEKI_PFP } from "@/lib/constants/client"

export default function GroupChatCard({ containerTailwind } : { containerTailwind?: string }) {

    function MessagePFP({ img, name, username, right } : { img: string, name: string, username: string, right?: boolean }) {
        return (
            <section style={{flexDirection: right ? "row-reverse" : "row"}} className="h-8 w-full flex justify-start items-center mt-2 space-x-4">
                <img src={img} alt="message pfp" className="h-full aspect-square" />
                <span className="text-white font-jbm">{name}</span>
                <span className="text-light-grey font-jbm text-xs" style={{marginRight: right ? "1em" : undefined}}>(@{username})</span>
            </section>
        )
    }

    function GroupPFP({ pfps } : { pfps: React.ReactNode[] }) {
        return (
            <ul className="relative z-0 h-full w-20 flex flex-row justify-center items-center">
                {
                    pfps.map((item, index) => {
                        return (
                            <li key={`LANDING_GROUP_PFP_1x${index}`} style={{zIndex: pfps.length - index, left: `${index}em`}} className={`absolute h-2/3 aspect-square flex flex-row justify-center items-center`}>
                                { item }
                            </li>
                        )
                    })
                }
            </ul>
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
                <GroupPFP 
                    pfps={[
                        <img src={ANIME_GIRL_PFP} className="h-full w-full"  />,
                        <img src={KEN_KANEKI_PFP} className="h-full w-full"  />,
                        <img src={HAYLEY_PFP} className="h-full w-full"  />
                    ]}
                />
                <p>
                    <span className="text-amber-50 font-jbm xl:ml-[0.5vw]">The Cool Fools</span>
                </p>
            </header>

            <div className="w-full h-0.5 bg-dark-grey"></div>

            <section className="h-5/6 w-full">
                <MessagePFP img={HAYLEY_PFP} name="Hayley Smith" username="hsmith1" />
                <Message text="Guess What?" tailwind="rounded-t-lg rounded-br-lg mt-2" />

                <MessagePFP img={ANIME_GIRL_PFP} name="Naomi Nguyen" username="nnguyen1" right />
                <Message text="Ooo, lemme guess. Chicken butt!" tailwind="rounded-t-lg rounded-bl-lg mt-2" right />

                <MessagePFP img={KEN_KANEKI_PFP} name="Ken Kaneki" username="kkaneki1" />
                <Message text="Wow, so funny, I'm dying of laughter. (I'm dead now)" tailwind="rounded-t-lg rounded-br-lg mt-2" />
            </section>
        </article>
    )
}
