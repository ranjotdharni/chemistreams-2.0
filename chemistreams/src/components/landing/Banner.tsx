"use client"

import { PAGE_LOGIN, PAGE_SIGNUP } from "@/lib/constants/routes"
import styles from "../../css/Typewriter.module.css"
import { useEffect, useRef, useState } from "react"

export default function Banner() {
    const [frameSize, setFrameSize] = useState<string>("0%")

    useEffect(() => {
        function evaluateFrameSize() {
            setFrameSize(window.screen.width < 640 ? "0%" : "50%")
        }

        evaluateFrameSize()

        window.addEventListener("resize", evaluateFrameSize)

        return () => {
            window.removeEventListener("resize", evaluateFrameSize)
        }
    }, [])

    return (
        <section className="fixed top-[20vh] left-0 w-screen h-[70vh] flex flex-row items-center">
            <div className="sm:w-full md:w-1/2 h-full flex flex-col items-center space-y-8">
                <div className="relative sm:w-full md:w-[62.5%]">
                    <h1 className={`${styles.typewriter} text-dark-white font-jbm sm:text-2xl md:text-4xl`}>Messaging Made Easy</h1>
                </div>

                <div className="bg-black rounded-lg w-3/4 h-3/4 shadow-xl flex flex-col justify-center items-center">
                    <img src="https://res.cloudinary.com/dm9lygtbe/image/upload/v1747994561/bannerShot_qsqpxg.png" className="h-full aspect-square rounded-lg" alt="Banner Shot" width={500} height={500} />
                </div>

                <div className="w-3/4 flex flex-row justify-end space-x-4">
                    <a href={PAGE_SIGNUP} className="font-lato text-white text-md bg-black px-6 py-1 rounded hover:cursor-pointer">Sign Up</a>
                    <a href={PAGE_LOGIN} className="font-lato text-white text-md bg-green px-6 py-1 rounded hover:cursor-pointer">Log In</a>
                </div>
            </div>

            <iframe src='https://my.spline.design/genkubgreetingrobot-PomjdePZwJfkfLW2nXv3yTn8/' width={frameSize} height='100%'></iframe>
        </section>
    )
}
