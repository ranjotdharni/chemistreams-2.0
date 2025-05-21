"use client"

import { AnimationCode, ANIMATIONS, BadgeCode, BADGES, SQUARE_IMAGE_SIZE } from "@/lib/constants/client"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { Badge, BadgeAnimation } from "@/lib/types/client"
import { MouseEvent, useContext, useState } from "react"
import { AuthContext } from "@/lib/context/AuthContext"
import { BadgeEditorProps } from "@/lib/types/props"
import { DB_USERS } from "@/lib/constants/routes"
import Loader from "@/components/utils/Loader"
import { ref, set } from "firebase/database"
import { rt } from "@/lib/auth/firebase"
import Image from "next/image"

function BadgePicker({ isSelected, badge, setBadge, animation } : { isSelected: boolean, badge: Badge, setBadge: (badge: Badge) => void, animation: string }) {

    return (
        <button type="button" onClick={() => { setBadge(badge) }} className="h-[35%] aspect-square p-2 rounded bg-dark-grey hover:cursor-pointer" style={{border: isSelected ? "solid 1px var(--color-green)" : "none"}}>
            <Image src={badge.link} alt={badge.code} className="w-full h-full" style={{animation: animation}} width={SQUARE_IMAGE_SIZE} height={SQUARE_IMAGE_SIZE} />
        </button>
    )
}

function AnimationPicker({ isSelected, animation, setAnimation } : { isSelected: boolean, animation: BadgeAnimation, setAnimation: (animation: BadgeAnimation) => void }) {

    return (
        <li onClick={() => { setAnimation(animation) }} style={isSelected ? { borderColor: "var(--color-green)", backgroundColor: "var(--color-green)" } : { borderColor: "var(--color-light-grey)" }} className="px-2 rounded border border-green transition-colors duration-150 hover:cursor-pointer hover:bg-light-grey">
            <p style={{color: isSelected ? "var(--color-dark-white)" : ""}} className="text-sm font-jbm text-light-grey hover:text-black">{animation.name}</p>
        </li>
    )
}

export default function BadgeEditor({ profile, setProfile } : BadgeEditorProps) {
    const { user } = useContext(AuthContext)
    const UIControl = useContext(InterfaceContext)

    const [loader, setLoader] = useState<boolean>(false)
    const [badge, setBadge] = useState<Badge | undefined>(profile.badge ? BADGES[profile.badge.badgeCode as BadgeCode] : undefined)
    const [animation, setAnimation] = useState<BadgeAnimation>(profile.badge ? ANIMATIONS[profile.badge.animationCode as AnimationCode] : ANIMATIONS.NULL)

    async function updateBadge(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        if (!user || !badge || (badge.code === profile.badge?.badgeCode && animation?.code === profile.badge?.animationCode))
            return

        setLoader(true)

        try {
            await set(ref(rt, `${DB_USERS}/${user.uid}/badge`), {
                badgeCode: badge.code,
                animationCode: animation.code
            })
        }
        catch (error) {
            UIControl.setText("Failed to update badge.", "red")
            setLoader(false)
            return
        }

        setLoader(false)
        UIControl.setText("Badge updated.", "green")
        setBadge(BADGES[badge.code])
        setAnimation(ANIMATIONS[animation.code])
        setProfile({
            ...profile,
            badge: {
                badgeCode: badge.code,
                animationCode: animation.code
            }
        })
    }

    async function removeBadge(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        if (!user || !badge)
            return

        setLoader(true)

        try {
            await set(ref(rt, `${DB_USERS}/${user.uid}/badge`), null)
        }
        catch (error) {
            UIControl.setText("Failed to remove badge.", "red")
            setLoader(false)
            return
        }

        setLoader(false)
        UIControl.setText("Badge removed.", "green")
        setBadge(undefined)
        setAnimation(ANIMATIONS.NULL)
        setProfile({
            ...profile,
            badge: undefined
        })
    }

    return (
        <div className="w-full h-full flex flex-col">
            <h2 className="text-green text-xl font-lato">Badges</h2>
            
            <ul className="w-full py-1 px-[3px] flex flex-row space-x-1">
                {
                    Object.entries(ANIMATIONS).map(([key, value]) => {
                        return <AnimationPicker key={key} isSelected={animation !== undefined && value.code === animation.code} animation={value} setAnimation={setAnimation} />
                    })
                }
            </ul>

            <ul className="md:w-full md:h-[65%] p-2 rounded md:flex md:flex-row justify-center items-center flex-wrap space-x-2 border border-dark-grey">
                {
                    Object.entries(BADGES).map(([key, value], index) => {
                        return <BadgePicker key={key} isSelected={badge !== undefined && badge.code === value.code} badge={value} setBadge={setBadge} animation={animation ? animation.animation : ""} />
                    })
                }
            </ul>

            <div className="w-full flex-1 flex flex-row justify-end p-2 space-x-2">
                {
                    loader ? 
                    <Loader containerTailwind="w-[5%] px-2 py-1" /> : 
                    <>
                        <button onClick={removeBadge} className="w-[7.5%] border border-light-grey rounded text-light-grey font-lato px-1 transition-colors duration-200 hover:cursor-pointer hover:bg-light-grey hover:text-black">Remove</button>
                        <button onClick={updateBadge} className="w-[7.5%] border border-green rounded text-dark-white font-lato px-1 transition-colors duration-200 hover:cursor-pointer hover:bg-green">Save</button>
                    </>
                }
            </div>
        </div>
    )
}
