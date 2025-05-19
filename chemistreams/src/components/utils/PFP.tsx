import { ANIMATIONS, BADGES, SQUARE_IMAGE_SIZE } from "@/lib/constants/client"
import { Badge, BadgeAnimation, PFPProps } from "@/lib/types/client"
import Image from "next/image"

function AnimatedBadge({ badge, animation } : { badge: Badge, animation: BadgeAnimation }) {

    return (
        <div className="h-1/5 relative -top-[5%] -left-1/4 aspect-square rounded-xl flex flex-col justify-center items-center">
            <Image src={badge.link} alt="badge_icon" className="w-full aspect-square rounded-lg" style={{animation: animation.animation}} width={SQUARE_IMAGE_SIZE} height={SQUARE_IMAGE_SIZE} />
        </div>
    )
}

function StatusIndicator({ online, bgColor } : { online?: boolean, bgColor: string }) {

    return (
        <div className="h-1/5 relative -top-[5%] -left-1/4 aspect-square rounded-[100px] flex flex-col justify-center items-center" style={{backgroundColor: bgColor}}>
            <div className="h-2/3 aspect-square rounded-[100px]" style={{backgroundColor: online ? "var(--color-light-green)" : "var(--color-red)"}}></div>
        </div>
    )
}

export default function PFP({ length, useHeight, online, bgColor, src, disable, badge } : PFPProps) {

    return (
        <div className="flex flex-col justify-center items-center aspect-square" style={useHeight ? { height: length } : { width: length }}>
            <Image className="w-3/4 h-3/4 relative rounded-[1000px]" style={{top: disable ? 0 : "12.5%"}} src={src} alt="pfp" width={200} height={200} />
            {
                !disable &&
                (badge !== undefined ? <AnimatedBadge badge={BADGES[badge.badgeCode]} animation={ANIMATIONS[badge.animationCode]} /> : <StatusIndicator online={online} bgColor={bgColor} />)
            }
        </div>
    )
}
