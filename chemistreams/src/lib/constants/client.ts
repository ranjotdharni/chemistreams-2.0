import { GenericError } from "../types/client"

export const PASSWORD_MIN_LENGTH: number = 12
export const SQUARE_IMAGE_SIZE: number = 100

export const PASSWORD_RULES_REGEX = new RegExp(
    `^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#?!&]).{${PASSWORD_MIN_LENGTH},}$`
)

export const ICON_PROFILE: string = "https://img.icons8.com/?size=100&id=ts3qYEwZQngs&format=png&color=cecece"
export const ICON_PAINT: string = "https://img.icons8.com/?size=100&id=HcTVPKRCB9mQ&format=png&color=cecece"
export const ICON_TRASH: string = "https://img.icons8.com/?size=100&id=7SayCU4CTibL&format=png&color=cecece"
export const ICON_EXIT: string = "https://img.icons8.com/?size=100&id=wY0SdntrJpvh&format=png&color=cecece"
export const LOGO: string = "https://img.icons8.com/?size=100&id=8hNJp4u2Tt8D&format=png&color=0B6448"
export const DEFAULT_PFP: string = "https://img.icons8.com/color/100/user-male-circle--v1.png"

// error codes
export const PASSWORD_SPECIAL_CHARACTER_ERROR: string = "PASSWORD_SPECIAL_CHARACTER_ERROR"
export const PASSWORD_CAPITAL_ERROR: string = "PASSWORD_CAPITAL_ERROR"
export const PASSWORD_LENGTH_ERROR: string = "PASSWORD_LENGTH_ERROR"
export const PASSWORD_NUMBER_ERROR: string = "PASSWORD_NUMBER_ERROR"

export const ERRORS: { [key: string]: GenericError } = {
    PASSWORD_SPECIAL_CHARACTER_ERROR: {
        code: PASSWORD_SPECIAL_CHARACTER_ERROR,
        message: "Password requires character @, #, ?, !, or &.",
    },
    PASSWORD_CAPITAL_ERROR: {
        code: PASSWORD_CAPITAL_ERROR,
        message: "Password requires a capital letter.",
    },
    PASSWORD_LENGTH_ERROR: {
        code: PASSWORD_LENGTH_ERROR,
        message: `Password must be ${PASSWORD_MIN_LENGTH} characters minimum.`
    },
    PASSWORD_NUMBER_ERROR: {
        code: PASSWORD_NUMBER_ERROR,
        message: "Password requires a number."
    }
}
