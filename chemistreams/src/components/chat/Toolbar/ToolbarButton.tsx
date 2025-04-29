import { ToolbarButtonProps } from "@/lib/types/props"

export default function ToolbarButton({ Icon, callback, hoverColor } : ToolbarButtonProps) {
    const tailwind: string = `md:text-light-grey hover:text-${hoverColor ? hoverColor : 'green'} hover:cursor-pointer md:w-full md:aspect-square`

    return (
        <li className="md:w-2/5 md:aspect-square">
            <button onClick={(e) => { callback(e) }} className="md:w-full md:aspect-square">
                <Icon className={tailwind} />
            </button>
        </li>
    )
}