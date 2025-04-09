"use client"

import { UserPen, PaintBucket, Trash2, LogOut } from "lucide-react"
import { LOGO, SQUARE_IMAGE_SIZE } from "@/lib/constants/client"
import { ToolbarButtonProps } from "@/lib/types/props"
import ToolbarButton from "./Toolbar/ToolbarButton"
import Image from "next/image"

export default function Toolbar() {
    const buttons: ToolbarButtonProps[] = [
        {
            Icon: UserPen,
            callback: () => {}
        },
        {
            Icon: PaintBucket,
            callback: () => {}
        },
        {
            Icon: Trash2,
            callback: () => {}
        },
        {
            Icon: LogOut,
            callback: () => {}
        }
    ]

    return (
        <section className="bg-black border-r border-dark-grey md:h-full md:w-[7.5%] md:p-2">
            <div className="w-full h-[65%] flex flex-col justify-between items-center">
                <Image src={LOGO} alt="Logo" width={SQUARE_IMAGE_SIZE} height={SQUARE_IMAGE_SIZE} className="md:w-full md:aspect-square p-3" />

                <ul className="md:w-full md:h-auto flex flex-col items-center space-y-8">
                    {
                        buttons.map((button: ToolbarButtonProps, index: number) => {
                            return <ToolbarButton key={`TOOLBAR_BUTTON_${index}`} Icon={button.Icon} callback={button.callback} />
                        })
                    }
                </ul>
            </div>
        </section>
    )
}