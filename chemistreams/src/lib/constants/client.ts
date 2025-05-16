import { MAXIMUM_PFP_FILE_SIZE } from "./server"
import { GenericError } from "../types/client"

export const DISPLAY_NAME_MAX_LENGTH: number = 32
export const DISPLAY_NAME_MIN_LENGTH: number = 3
export const USERNAME_MAX_LENGTH: number = 16
export const PASSWORD_MIN_LENGTH: number = 12
export const USERNAME_MIN_LENGTH: number = 8
export const SQUARE_IMAGE_SIZE: number = 100
export const STATUS_MAX_LENGTH: number = 64
export const ALIAS_MAX_LENGTH: number = 38
export const ALIAS_MIN_LENGTH: number = 3

export const USERNAME_RULES_REGEX: RegExp = /^[A-Za-z0-9_]+$/

export const PASSWORD_RULES_REGEX: RegExp = new RegExp(
    `^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#?!&]).{${PASSWORD_MIN_LENGTH},}$`
)

export const DEFAULT_GROUP_PFP: string = "https://img.icons8.com/3d-fluency/100/user-group-man-woman--v2.png"
export const LOGO: string = "https://img.icons8.com/?size=100&id=8hNJp4u2Tt8D&format=png&color=0B6448"
export const DEFAULT_PFP: string = "https://img.icons8.com/color/100/user-male-circle--v1.png"

// error codes
export const USERNAME_SPECIAL_CHARACTER_ERROR: string = "USERNAME_SPECIAL_CHARACTER_ERROR"
export const PASSWORD_SPECIAL_CHARACTER_ERROR: string = "PASSWORD_SPECIAL_CHARACTER_ERROR"
export const DISPLAY_NAME_MIN_LENGTH_ERROR: string = "DISPLAY_NAME_MIN_LENGTH_ERROR"
export const DISPLAY_NAME_MAX_LENGTH_ERROR: string = "DISPLAY_NAME_MAX_LENGTH_ERROR"
export const INVALID_PFP_FILE_TYPE_ERROR: string = "INVALID_PFP_FILE_TYPE_ERROR"
export const INVALID_PFP_FILE_SIZE_ERROR: string = "INVALID_PFP_FILE_SIZE_ERROR"
export const USERNAME_MIN_LENGTH_ERROR: string = "USERNAME_MIN_LENGTH_ERROR"
export const USERNAME_MAX_LENGTH_ERROR: string = "USERNAME_MAX_LENGTH_ERROR"
export const STATUS_MAX_LENGTH_ERROR: string = "STATUS_MAX_LENGTH_ERROR"
export const PASSWORD_CAPITAL_ERROR: string = "PASSWORD_CAPITAL_ERROR"
export const ALIAS_MAX_LENGTH_ERROR: string= "ALIAS_MAX_LENGTH_ERROR"
export const ALIAS_MIN_LENGTH_ERROR: string= "ALIAS_MIN_LENGTH_ERROR"
export const PASSWORD_LENGTH_ERROR: string = "PASSWORD_LENGTH_ERROR"
export const PASSWORD_NUMBER_ERROR: string = "PASSWORD_NUMBER_ERROR"
export const SIGNOUT_FAILURE_ERROR: string = "SIGNOUT_FAILURE_ERROR"
export const FATAL_NULL_USER_ERROR: string = "FATAL_NULL_USER_ERROR"
export const SIGNUP_FAILURE_ERROR: string = "SIGNUP_FAILURE_ERROR"
export const LOGIN_FAILURE_ERROR: string = "LOGIN_FAILURE_ERROR"
export const CUSTOM_ERROR: string = "CUSTOM_ERROR"  // for custom errors, does not have a value in ERRORS object

export const ERRORS: { [key: string]: GenericError } = {
    [INVALID_PFP_FILE_TYPE_ERROR]: {
        code: INVALID_PFP_FILE_TYPE_ERROR,
        message: "Invalid file type."
    },
    [INVALID_PFP_FILE_SIZE_ERROR]: {
        code: INVALID_PFP_FILE_SIZE_ERROR,
        message: `Maximum file size: ${MAXIMUM_PFP_FILE_SIZE} MB`
    },
    [ALIAS_MIN_LENGTH_ERROR]: {
        code: ALIAS_MIN_LENGTH_ERROR,
        message: `Group name minimum length: ${ALIAS_MIN_LENGTH}`
    },
    [ALIAS_MAX_LENGTH_ERROR]: {
        code: ALIAS_MAX_LENGTH_ERROR,
        message: `Group name maximum length: ${ALIAS_MAX_LENGTH}`
    },
    [FATAL_NULL_USER_ERROR]: {
        code: FATAL_NULL_USER_ERROR,
        message: "Internal Server Error 500 [Fatal]: User object null"
    },
    [STATUS_MAX_LENGTH_ERROR]: {
        code: STATUS_MAX_LENGTH_ERROR,
        message: `Status maximum length: ${STATUS_MAX_LENGTH}`
    },
    [DISPLAY_NAME_MIN_LENGTH_ERROR]: {
        code: DISPLAY_NAME_MIN_LENGTH_ERROR,
        message: `Display name minimum length: ${DISPLAY_NAME_MIN_LENGTH}`
    },
    [DISPLAY_NAME_MAX_LENGTH_ERROR]: {
        code: DISPLAY_NAME_MAX_LENGTH_ERROR,
        message: `Display name maximum length: ${DISPLAY_NAME_MAX_LENGTH}`
    },
    [SIGNUP_FAILURE_ERROR]: {
        code: SIGNUP_FAILURE_ERROR,
        message: "Email or Username already exists."
    },
    [LOGIN_FAILURE_ERROR]: {
        code: LOGIN_FAILURE_ERROR,
        message: "Failed to log in; check credentials."
    },
    [SIGNOUT_FAILURE_ERROR]: {
        code: SIGNOUT_FAILURE_ERROR,
        message: "Failed to sign out."
    },
    [USERNAME_SPECIAL_CHARACTER_ERROR]:  {
        code: USERNAME_SPECIAL_CHARACTER_ERROR,
        message: "Username may only contain '_' special character."
    },
    [USERNAME_MIN_LENGTH_ERROR]: {
        code: USERNAME_MIN_LENGTH_ERROR,
        message: `Username must be ${USERNAME_MIN_LENGTH} characters minimum.`
    },
    [USERNAME_MAX_LENGTH_ERROR]: {
        code: USERNAME_MAX_LENGTH_ERROR,
        message: `Username must be ${USERNAME_MAX_LENGTH} characters maximum.`
    },
    [PASSWORD_SPECIAL_CHARACTER_ERROR]: {
        code: PASSWORD_SPECIAL_CHARACTER_ERROR,
        message: "Password requires character @, #, ?, !, or &.",
    },
    [PASSWORD_CAPITAL_ERROR]: {
        code: PASSWORD_CAPITAL_ERROR,
        message: "Password requires a capital letter.",
    },
    [PASSWORD_LENGTH_ERROR]: {
        code: PASSWORD_LENGTH_ERROR,
        message: `Password must be ${PASSWORD_MIN_LENGTH} characters minimum.`
    },
    [PASSWORD_NUMBER_ERROR]: {
        code: PASSWORD_NUMBER_ERROR,
        message: "Password requires a number."
    }
}
