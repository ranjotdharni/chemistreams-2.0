"use client"

import { PAGE_LOGIN, PAGE_SIGNUP } from "@/lib/constants/routes"
import ForwardCarousel, { CarouselItem } from "../utils/ForwardCarousel"

export default function Banner() {
    const carouselContent: [CarouselItem, ...CarouselItem[]] = [
        {
            title: "Messaging Made Easy",
            element: (
                <img src="https://res.cloudinary.com/dm9lygtbe/image/upload/v1747994561/bannerShot_qsqpxg.png" className="h-full aspect-square rounded-lg" alt="Banner Shot" width={500} height={500} />
            )
        }
    ]

    return (
        <main className="w-screen h-[80vh] flex flex-row justify-center items-center">
            <section className="w-full md:w-1/2 h-full flex flex-col items-center">
                <ForwardCarousel containerStyle={{width: "100%", height: "90%"}} content={carouselContent} />

                <aside className="w-3/4 h-[10%] flex flex-row justify-end items-center space-x-4">
                    <a href={PAGE_SIGNUP} className="font-lato text-white text-md bg-black px-6 py-1 rounded hover:cursor-pointer">Sign Up</a>
                    <a href={PAGE_LOGIN} className="font-lato text-white text-md bg-green px-6 py-1 rounded hover:cursor-pointer">Log In</a>
                </aside>
            </section>

            <iframe src='https://my.spline.design/genkubgreetingrobot-PomjdePZwJfkfLW2nXv3yTn8/' width="50%" height="100%" className="hidden md:flex"></iframe>
        </main>
    )
}
