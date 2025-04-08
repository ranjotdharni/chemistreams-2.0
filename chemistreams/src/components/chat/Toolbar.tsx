"use client"

import { ICON_EXIT, ICON_PAINT, ICON_PROFILE, ICON_TRASH, LOGO, SQUARE_IMAGE_SIZE } from "@/lib/constants/client"
import { ToolbarButtonProps } from "@/lib/types/props"
import ToolbarButton from "./Toolbar/ToolbarButton"
import Image from "next/image"

export default function Toolbar() {
    const buttons: ToolbarButtonProps[] = [
        {
            icon: ICON_PROFILE,
            alt: "Profile",
            callback: () => {}
        },
        {
            icon: ICON_PAINT,
            alt: "Theme",
            callback: () => {}
        },
        {
            icon: ICON_TRASH,
            alt: "Delete",
            callback: () => {}
        },
        {
            icon: ICON_EXIT,
            alt: "Logout",
            callback: () => {}
        }
    ]

    return (
        <section className="bg-black border-r border-dark-grey md:h-full md:w-[7.5%] md:p-2">
            <div className="w-full h-[70%] flex flex-col justify-between items-center">
                <Image src={LOGO} alt="Logo" width={SQUARE_IMAGE_SIZE} height={SQUARE_IMAGE_SIZE} className="md:w-full md:aspect-square p-3" />

                <ul className="md:w-full md:h-auto flex flex-col items-center space-y-8">
                    {
                        buttons.map((button: ToolbarButtonProps, index: number) => {
                            return <ToolbarButton key={`TOOLBAR_BUTTON_${index}`} icon={button.icon} alt={button.alt} callback={button.callback} />
                        })
                    }
                </ul>
            </div>
        </section>
    )
}