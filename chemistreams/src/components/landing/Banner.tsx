"use client"

import { PAGE_LOGIN, PAGE_SIGNUP } from "@/lib/constants/routes"
import ForwardCarousel, { CarouselItem } from "../utils/ForwardCarousel"
import MainFeatureCard from "./carouselElements/MainFeatureCard"
import GroupChatCard from "./carouselElements/GroupChatCard"
import ProfileCustomizeCard from "./carouselElements/ProfileCustomizeCard"
import EmbedMessagesCard from "./carouselElements/EmbedMessagesCard"
import ThemeModeCard from "./carouselElements/ThemeModeCard"
import EmbedVideosCard from "./carouselElements/EmbedVideosCard"

export default function Banner() {
    const carouselContent: [CarouselItem, CarouselItem, CarouselItem, ...CarouselItem[]] = [
        {
            key: "embedded-videos-feature",
            title: "Share YouTube Videos",
            element: <EmbedVideosCard containerTailwind="w-[95%] sm:w-3/5 h-full" />
        },
        {
            key: "embed-messages-feature",
            title: "Share Spotify Music",
            element: <EmbedMessagesCard containerTailwind="w-[95%] sm:w-3/5 h-full" />
        },
        {
            key: "theme-modes-feature",
            title: "Light and Dark Modes",
            element: <ThemeModeCard containerTailwind="w-[95%] sm:w-3/5 h-full" />
        },
        {
            key: "custom-profiles-feature",
            title: "Customize Your Profile",
            element: <ProfileCustomizeCard containerTailwind="w-[95%] sm:w-3/5 h-full" />
        },
        {
            key: "group-chat-feature",
            title: "Create Group Chats",
            element: <GroupChatCard containerTailwind="w-[95%] sm:w-3/5 h-full" />
        },
        {
            key: "main-feature",
            title: "Message Your Friends",
            element: <MainFeatureCard containerTailwind="w-[95%] sm:w-3/5 h-full" />
        }
    ]

    return (
        <main className="w-screen h-[80vh] flex flex-row justify-center items-center">
            <section className="w-full sm:w-1/2 h-full flex flex-col items-center">
                <ForwardCarousel containerStyle="w-full h-full sm:h-[90%]" content={carouselContent} maxDisplayItems={carouselContent.length - 1} autoCycleDuration={3500} autoCycleReverse />

                <aside className="w-3/4 h-[10%] hidden sm:flex flex-row justify-end items-center space-x-4">
                    <a href={PAGE_SIGNUP} className="font-lato text-white text-md bg-black px-6 py-1 rounded hover:cursor-pointer">Sign Up</a>
                    <a href={PAGE_LOGIN} className="font-lato text-white text-md bg-green px-6 py-1 rounded hover:cursor-pointer">Log In</a>
                </aside>
            </section>

            <iframe src='https://my.spline.design/genkubgreetingrobot-PomjdePZwJfkfLW2nXv3yTn8/' width="50%" height="100%" className="hidden md:flex"></iframe>
        </main>
    )
}
