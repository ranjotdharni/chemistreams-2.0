"use client"

import { ToolbarButtonProps, ToolbarProps } from "@/lib/types/props"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import ToolbarButton from "./Toolbar/ToolbarButton"
import AnimatedLogo from "../utils/AnimatedLogo"
import { useContext } from "react"

export default function Toolbar({ buttons } : ToolbarProps) {
    const UIControl = useContext(InterfaceContext)

    return (
        <section className="flex-shrink-0 border-r border-dark-grey md:h-full md:w-[7.5%] md:p-2">
            <div className="w-full h-[65%] flex flex-col justify-between items-center">
                <div className="md:w-full md:h-12 p-3 mt-[15%]">
                    <AnimatedLogo />
                </div>

                <ul className="md:w-full md:h-auto flex flex-col items-center space-y-8">
                    {
                        buttons.map((button: ToolbarButtonProps, index: number) => {
                            return <ToolbarButton key={`TOOLBAR_BUTTON_${index}`} Icon={button.Icon} hoverColor={button.hoverColor} callback={button.callback} />
                        })
                    }
                </ul>
            </div>
        </section>
    )
}