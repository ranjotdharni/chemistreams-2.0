import { SQUARE_IMAGE_SIZE } from "@/lib/constants/client"
import { ToolbarButtonProps } from "@/lib/types/props"
import Image from "next/image"

export default function ToolbarButton({ icon, alt, callback } : ToolbarButtonProps) {

    return (
        <li className="md:w-2/5 md:aspect-square">
            <button onClick={() => { callback() }} className="md:w-full md:aspect-square">
                <Image src={icon} alt={alt} width={SQUARE_IMAGE_SIZE} height={SQUARE_IMAGE_SIZE} className="md:w-full md:aspect-square" />
            </button>
        </li>
    )
}