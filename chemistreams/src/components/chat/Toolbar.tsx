"use client"

import { ToolbarButtonProps, ToolbarProps } from "@/lib/types/props"
import ToolbarButton from "./Toolbar/ToolbarButton"
import AnimatedLogo from "../utils/AnimatedLogo"

export default function Toolbar({ buttons } : ToolbarProps) {

    return (
        <section className="flex-shrink-0 border-r border-dark-grey h-full w-[15%] md:w-[7.5%] md:p-2">
            <div className="w-full h-full md:h-[65%] flex flex-col md:justify-between items-center">
                <div className="w-full relative md:left-0 h-10 md:h-12 p-3 mt-[30%] md:mt-[15%]">
                    <AnimatedLogo />
                </div>

                <ul className="w-full h-[3/5] relative top-[25%] md:top-[12.5%] md:h-auto flex flex-col items-center space-y-8">
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