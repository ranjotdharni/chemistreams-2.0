import { GenericError } from "../types/client"

export const USERNAME_MAX_LENGTH: number = 16
export const PASSWORD_MIN_LENGTH: number = 12
export const USERNAME_MIN_LENGTH: number = 8
export const SQUARE_IMAGE_SIZE: number = 100

export const USERNAME_RULES_REGEX: RegExp = /^[A-Za-z0-9_]+$/

export const PASSWORD_RULES_REGEX: RegExp = new RegExp(
    `^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#?!&]).{${PASSWORD_MIN_LENGTH},}$`
)

export const LOGO: string = "https://img.icons8.com/?size=100&id=8hNJp4u2Tt8D&format=png&color=0B6448"
export const DEFAULT_PFP: string = "https://img.icons8.com/color/100/user-male-circle--v1.png"

// error codes
export const USERNAME_SPECIAL_CHARACTER_ERROR: string = "USERNAME_SPECIAL_CHARACTER_ERROR"
export const PASSWORD_SPECIAL_CHARACTER_ERROR: string = "PASSWORD_SPECIAL_CHARACTER_ERROR"
export const USERNAME_MIN_LENGTH_ERROR: string = "USERNAME_MIN_LENGTH_ERROR"
export const USERNAME_MAX_LENGTH_ERROR: string = "USERNAME_MAX_LENGTH_ERROR"
export const PASSWORD_CAPITAL_ERROR: string = "PASSWORD_CAPITAL_ERROR"
export const PASSWORD_LENGTH_ERROR: string = "PASSWORD_LENGTH_ERROR"
export const PASSWORD_NUMBER_ERROR: string = "PASSWORD_NUMBER_ERROR"
export const SIGNOUT_FAILURE_ERROR: string = "SIGNOUT_FAILURE_ERROR"
export const SIGNUP_FAILURE_ERROR: string = "SIGNUP_FAILURE_ERROR"
export const LOGIN_FAILURE_ERROR: string = "LOGIN_FAILURE_ERROR"

export const ERRORS: { [key: string]: GenericError } = {
    SIGNUP_FAILURE_ERROR: {
        code: SIGNUP_FAILURE_ERROR,
        message: "Email or Username already exists."
    },
    LOGIN_FAILURE_ERROR: {
        code: LOGIN_FAILURE_ERROR,
        message: "Failed to log in; check credentials."
    },
    SIGNOUT_FAILURE_ERROR: {
        code: SIGNOUT_FAILURE_ERROR,
        message: "Failed to sign out."
    },
    USERNAME_SPECIAL_CHARACTER_ERROR:  {
        code: USERNAME_SPECIAL_CHARACTER_ERROR,
        message: "Username may only contain '_' special character."
    },
    USERNAME_MIN_LENGTH_ERROR: {
        code: USERNAME_MIN_LENGTH_ERROR,
        message: `Username must be ${USERNAME_MIN_LENGTH} characters minimum.`
    },
    USERNAME_MAX_LENGTH_ERROR: {
        code: USERNAME_MAX_LENGTH_ERROR,
        message: `Username must be ${USERNAME_MAX_LENGTH} characters maximum.`
    },
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
