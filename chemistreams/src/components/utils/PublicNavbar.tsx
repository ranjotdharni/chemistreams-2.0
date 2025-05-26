"use client"

import { PAGE_LANDING, PAGE_LOGIN, PAGE_SIGNUP, PUBLIC_ROUTES } from "@/lib/constants/routes"
import { usePathname } from "next/navigation"
import AnimatedLogo from "./AnimatedLogo"

export default function PublicNavbar() {
    const pathname = usePathname()

    if (!PUBLIC_ROUTES.includes(pathname))
        return <></>

    return (
        <nav className="fixed top-0 left-0 bg-black border-b border-dark-grey md:pr-30 w-full h-[10vh] p-2 flex flex-col md:flex-row justify-end md:justify-between items-center">
            <a href={PAGE_LANDING} className="hover:cursor-pointer w-full md:w-auto h-1/2 md:h-full flex flex-row justify-start items-center space-x-2 p-1">
                <div className="h-3 w-8 md:h-5 md:w-15">
                    <AnimatedLogo />
                </div>
                <p className="text-green font-lato text-xl md:text-4xl">ChemiStreams</p>
            </a>

            <div className="w-full md:w-1/2 text-md md:text-lg space-x-5 md:space-x-15 flex flex-row justify-end pr-3 md:pr-0">
                <a href={PAGE_LOGIN} className="font-jbm hover:cursor-pointer" style={{color: PAGE_LOGIN === pathname ? "var(--color-green)" : "var(--color-light-grey)"}}>Log In</a>
                <a href={PAGE_SIGNUP} className="font-jbm hover:cursor-pointer" style={{color: PAGE_SIGNUP === pathname ? "var(--color-green)" : "var(--color-light-grey)"}}>Sign Up</a>
                <a href="https://github.com/ranjotdharni/chemistreams-2.0?tab=readme-ov-file#usage" target="_blank" className="font-jbm hover:cursor-pointer text-light-grey">Usage</a>
                <a href="https://github.com/ranjotdharni/chemistreams-2.0" target="_blank" className="font-jbm hover:cursor-pointer text-light-grey">About</a>
            </div>
        </nav>
    )
}
