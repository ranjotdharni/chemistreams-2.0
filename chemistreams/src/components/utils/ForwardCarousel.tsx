import { CSSProperties, useState } from "react"

export type CarouselItem = {
    title: string
    element: React.ReactNode
}

type ForwardCarouselProps = {
    containerStyle?: CSSProperties
    content: [CarouselItem, ...CarouselItem[]] // non-empty CarouselItem array
}

export default function ForwardCarousel({ containerStyle, content } : ForwardCarouselProps) {
    const [currentItem, setCurrentItem] = useState<number>(0)

    return (
        <article style={containerStyle}>
            <header className="w-full h-1/5 flex flex-row justify-center items-center">
                <h2 className="text-dark-white text-2xl font-jbm">{content[currentItem].title}</h2>
            </header>

            <section className="relative w-full h-4/5 z-0 flex flex-col justify-center items-center">
                { content[currentItem].element }
            </section>
        </article>
    )
}
