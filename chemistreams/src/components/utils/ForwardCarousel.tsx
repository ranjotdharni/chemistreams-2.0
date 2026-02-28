import "@/css/ForwardCarousel.css"
import useTimeout from "@/lib/hooks/useTimeout"
import { ChevronDown, ChevronUp } from "lucide-react"
import { CSSProperties, MouseEvent, useEffect, useState } from "react"

export type CarouselItem = {
    key: string | number | bigint
    title: string
    element: React.ReactNode
}

type ForwardCarouselProps = {
    containerStyle?: CSSProperties
    content: [CarouselItem, CarouselItem, CarouselItem, ...CarouselItem[]] // minimum 3 items CarouselItem array
    maxDisplayItems?: number
}

export default function ForwardCarousel({ containerStyle, content, maxDisplayItems } : ForwardCarouselProps) {
    const displayCount: number = Math.max(maxDisplayItems || content.length, 3)

    const [currentItemIndex, setCurrentItemIndex] = useState<number>(0)

    const backwardTimer = useTimeout()
    const forwardTimer = useTimeout()

    function getPreviousItemIndex() {
        return currentItemIndex === 0 ? content.length - 1 : currentItemIndex - 1
    }

    function getNextItemIndex() {
        return currentItemIndex === content.length - 1 ? 0 : currentItemIndex + 1
    }

    function cycleBackward(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        backwardTimer.begin(50)
        setCurrentItemIndex(getPreviousItemIndex())
    }

    function cycleForward(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        forwardTimer.begin(50)
        setCurrentItemIndex(getNextItemIndex())
    }

    function oneWayCyclicalSlice(arr: Array<any>, start: number, end: number): Array<any> {
        if (start > end)
            throw new Error("{\nfunction 'cyclicalSlice' parameter error:\n    'start' may not be less than 'end'\n}")

        if (end > arr.length) {
            let remainingLength: number = end - start
            let result: Array<any> = arr.slice(start, arr.length)

            remainingLength -= (arr.length - start)

            while (remainingLength !== 0) {
                let slice: number = Math.min(remainingLength, arr.length)
                result = [...result, ...arr.slice(0, slice)]
                remainingLength -= slice
            }

            return result
        }

        return arr.slice(start, end)
    }

    useEffect(() => {
        if (backwardTimer.completed)
            backwardTimer.reset() 

        if (forwardTimer.completed)
            forwardTimer.reset() 
    }, [backwardTimer.completed, forwardTimer.completed])

    return (
        <article style={containerStyle}>
            <header className="w-full h-[10%] flex flex-row justify-center items-center">
                <h2 className="text-dark-white text-2xl font-jbm">{content[currentItemIndex].title}</h2>
            </header>

            <section className="w-full h-[5%] flex flex-row justify-end items-center">
                <button onClick={cycleBackward}>
                    <ChevronUp />
                </button>
                <button onClick={cycleForward}>
                    <ChevronDown />
                </button>
            </section>

            <ul className="relative w-full h-[85%] z-0 flex flex-col justify-center items-center">
                {
                    oneWayCyclicalSlice(content, currentItemIndex, currentItemIndex + displayCount).map((item, index) => {
                        let xScale: number = 1 - ((0.2 / displayCount) * index)
                        let yTranslate: number = 20 - ((20 / displayCount) * index)
                        let activeOpacity: number = 1 - ((0.5 / displayCount) * index)
                        let activeZ: number = displayCount - index
                        let hasAnimations: boolean = true

                        if (index === 0 && backwardTimer.started && !backwardTimer.completed) {
                            yTranslate = 20 + 5
                            activeOpacity = 0
                            activeZ = -100
                            hasAnimations = false
                        }

                        if (index === displayCount - 1 && forwardTimer.started && !forwardTimer.completed) {
                            yTranslate = 0
                            activeOpacity = 0
                            activeZ = 100
                            hasAnimations = false
                        }

                        return (
                            <li key={displayCount === content.length && index === 0 && backwardTimer.started && !backwardTimer.completed ? "entering" : item.key} style={{opacity: activeOpacity, zIndex: activeZ, transform: `translateY(${yTranslate}%) scaleX(${xScale})`, transition: hasAnimations ? "opacity 0.2s linear, transform 0.25s linear" : undefined}} className="absolute top-0 w-full h-3/4 flex flex-col justify-center items-center">
                                { item.element }
                            </li>
                        )
                    })
                }
            </ul>
        </article>
    )
}
