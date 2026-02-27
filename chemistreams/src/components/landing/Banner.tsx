"use client"

import { PAGE_LOGIN, PAGE_SIGNUP } from "@/lib/constants/routes"
import ForwardCarousel, { CarouselItem } from "../utils/ForwardCarousel"

export default function Banner() {
    const carouselContent: [CarouselItem, CarouselItem, CarouselItem, ...CarouselItem[]] = [
        {
            key: "initial",
            title: "Messaging Made Easy",
            element: (
                <img src="https://res.cloudinary.com/dm9lygtbe/image/upload/v1747994561/bannerShot_qsqpxg.png" className="h-full aspect-square rounded-lg hue-rotate-15" alt="Banner Shot" width={500} height={500} />
            )
        },
        {
            key: "mid",
            title: "Messaging Made Easy",
            element: (
                <img src="https://res.cloudinary.com/dm9lygtbe/image/upload/v1747994561/bannerShot_qsqpxg.png" className="h-full aspect-square rounded-lg hue-rotate-30" alt="Banner Shot" width={500} height={500} />
            )
        },
        {
            key: "final",
            title: "Messaging Made Easy",
            element: (
                <img src="https://res.cloudinary.com/dm9lygtbe/image/upload/v1747994561/bannerShot_qsqpxg.png" className="h-full aspect-square rounded-lg hue-rotate-45 invert-50" alt="Banner Shot" width={500} height={500} />
            )
        },
        {
            key: "then",
            title: "Messaging Made Easy",
            element: (
                <img src="https://res.cloudinary.com/dm9lygtbe/image/upload/v1747994561/bannerShot_qsqpxg.png" className="h-full aspect-square rounded-lg hue-rotate-60" alt="Banner Shot" width={500} height={500} />
            )
        },
        {
            key: "then2",
            title: "Messaging Made Easy",
            element: (
                <img src="https://res.cloudinary.com/dm9lygtbe/image/upload/v1747994561/bannerShot_qsqpxg.png" className="h-full aspect-square rounded-lg invert-25" alt="Banner Shot" width={500} height={500} />
            )
        },
        {
            key: "then3",
            title: "Messaging Made Easy",
            element: (
                <img src="https://res.cloudinary.com/dm9lygtbe/image/upload/v1747994561/bannerShot_qsqpxg.png" className="h-full aspect-square rounded-lg hue-rotate-60 invert-75" alt="Banner Shot" width={500} height={500} />
            )
        }
    ]

    return (
        <main className="w-screen h-[80vh] flex flex-row justify-center items-center">
            <section className="w-full md:w-1/2 h-full flex flex-col items-center">
                <ForwardCarousel containerStyle={{width: "100%", height: "90%"}} content={carouselContent} maxDisplayItems={6} />

                <aside className="w-3/4 h-[10%] flex flex-row justify-end items-center space-x-4">
                    <a href={PAGE_SIGNUP} className="font-lato text-white text-md bg-black px-6 py-1 rounded hover:cursor-pointer">Sign Up</a>
                    <a href={PAGE_LOGIN} className="font-lato text-white text-md bg-green px-6 py-1 rounded hover:cursor-pointer">Log In</a>
                </aside>
            </section>

            <iframe src='https://my.spline.design/genkubgreetingrobot-PomjdePZwJfkfLW2nXv3yTn8/' width="50%" height="100%" className="hidden md:flex"></iframe>
        </main>
    )
}
