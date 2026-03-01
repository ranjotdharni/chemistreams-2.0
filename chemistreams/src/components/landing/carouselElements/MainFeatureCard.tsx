const ROGER_PFP: string = "https://res.cloudinary.com/dm9lygtbe/image/upload/v1772324172/RogerPFP_az50ar.png"
const FRANCINE_PFP: string = "https://res.cloudinary.com/dm9lygtbe/image/upload/v1772326719/FrancinePFP_wojw1b.png"

export default function MeainFeatureCard({ containerTailwind } : { containerTailwind?: string }) {
    
    function MessagePFP({ img, name, username, right } : { img: string, name: string, username: string, right?: boolean }) {
        return (
            <section style={{flexDirection: right ? "row-reverse" : "row"}} className="h-8 w-full flex justify-start items-center mt-2 space-x-4">
                <img src={img} alt="message pfp" className="h-full aspect-square" />
                <span className="text-light-grey font-jbm">{name}</span>
                <span className="text-dark-grey font-jbm text-xs" style={{marginRight: right ? "1em" : undefined}}>(@{username})</span>
            </section>
        )
    }

    function Message({ text, tailwind, right } : { text: string, tailwind?: string, right?: boolean }) {
        return (
            <p className="w-full text-light-grey font-jbm flex flex-row" style={{justifyContent: right ? "flex-end" : "flex-start"}}>
                <span className={`max-w-4/5 bg-dark-grey px-2 py-1 ${tailwind ? tailwind : ""}`}>{text}</span>
            </p>
        )
    }

    return (
        <article className={`bg-black rounded-lg p-4 space-y-4 ${containerTailwind}`}>
            <header className="h-1/6 w-full px-2 flex flex-row justify-start items-center space-x-4">
                <img src={ROGER_PFP} alt="main feature pfp" className="h-full aspect-square" />
                <p>
                    <span className="text-amber-50 font-jbm">Roger Smith</span>
                    <br></br>
                    <span className="text-light-grey text-xs font-jbm">Floor Spaghetti</span>
                </p>
            </header>

            <div className="w-full h-0.5 bg-dark-grey"></div>

            <section className="h-5/6 w-full">
                <MessagePFP img={ROGER_PFP} name="Roger Smith" username="rsmith1" />
                <Message text="Francine, I haven't been entirely truthful with you." tailwind="rounded-t-lg rounded-br-lg mt-2" />

                <MessagePFP img={FRANCINE_PFP} name="Francine Smith" username="fsmith1" right />
                <Message text="Oh, come on!" tailwind="rounded-t-lg rounded-bl-lg mt-2" right />

                <MessagePFP img={ROGER_PFP} name="Roger Smith" username="rsmith1" />
                <Message text="I don't really know where she wanted to be buried." tailwind="rounded-t-lg rounded-br-lg mt-2" />
            </section>
        </article>
    )
}
