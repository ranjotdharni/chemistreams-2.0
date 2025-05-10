"use client"

import { UserPen, PaintBucket, Trash2, LogOut } from "lucide-react"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { ToolbarButtonProps } from "@/lib/types/props"
import ToolbarButton from "./Toolbar/ToolbarButton"
import { logoutAction } from "@/lib/utils/server"
import { GenericError } from "@/lib/types/client"
import AnimatedLogo from "../utils/AnimatedLogo"
import { MouseEvent, useContext } from "react"

export default function Toolbar() {
    const UIControl = useContext(InterfaceContext)

    async function handleLogout(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        const result: void | GenericError = await logoutAction()

        if (result !== undefined && (result as GenericError).code !== undefined) {
            UIControl.setText((result as GenericError).message, "red")
            return
        }
    }

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
            hoverColor: "red",
            callback: handleLogout
        }
    ]

    return (
        <section className="border-r border-dark-grey md:h-full md:w-[7.5%] md:p-2">
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