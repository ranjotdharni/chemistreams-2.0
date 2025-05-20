import { GroupPFPProps } from "@/lib/types/props"
import Image from "next/image"

export default function GroupPFP({ pfps, length, useHeight } : GroupPFPProps) {
    let zDrop: number = 3

    return (
        <div className="relative flex flex-row justify-start items-center aspect-square" style={useHeight ? { height: length } : { width: length }}>
            {
                pfps.slice(0, 3).map((pfp, index) => {
                    return <Image className="w-1/2 aspect-square rounded-[1000px] absolute" style={{left: `${16.66 * index}%`, zIndex: zDrop--}} key={`GROUP_PFP_ITEM_${index}`} src={pfp.link} alt={`GROUP_PFP_${index}`} width={200} height={200} />
                })
            }
         </div>
    )
}
