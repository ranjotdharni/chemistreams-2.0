import { ToolbarButtonProps } from "@/lib/types/props"

export default function ToolbarButton({ Icon, callback } : ToolbarButtonProps) {

    return (
        <li className="md:w-2/5 md:aspect-square">
            <button onClick={() => { callback() }} className="md:w-full md:aspect-square">
                <Icon className="md:text-light-grey hover:text-green hover:cursor-pointer md:w-full md:aspect-square" />
            </button>
        </li>
    )
}