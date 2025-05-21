import { Badge, BadgeAnimation, GenericError } from "../types/client"
import { MAXIMUM_PFP_FILE_SIZE } from "./server"

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
export const DEFAULT_PFP: string = "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"
export const LOGO: string = "https://img.icons8.com/?size=100&id=8hNJp4u2Tt8D&format=png&color=0B6448"

// badges codes
export type BadgeCode = 
    "BADGE_HEARTHSTONE" |    
    "BADGE_GHOSTBUSTER" |    
    "BADGE_PLAYSTATION" |    
    "BADGE_HUFFLEPUFF" |     
    "BADGE_GRYFFINDOR" |     
    "BADGE_CLOUDFLARE" |     
    "BADGE_STARBUCKS" |      
    "BADGE_MINECRAFT" |      
    "BADGE_SLYTHERIN" |      
    "BADGE_RAVENCLAW" |      
    "BADGE_MICROSOFT" |      
    "BADGE_ELDENRING" | 
    "BADGE_ETHEREUM" |            
    "BADGE_TERRARIA" |       
    "BADGE_ROCKSTAR" | 
    "BADGE_DEEPSEEK" |       
    "BADGE_DISCORD" |        
    "BADGE_WINDOWS" |              
    "BADGE_GENSHIN" |             
    "BADGE_FALLOUT" |        
    "BADGE_BLENDER" |        
    "BADGE_BITCOIN" | 
    "BADGE_HEROKU" |       
    "BADGE_SWITCH" |         
    "BADGE_NVIDIA" |         
    "BADGE_CHROME" |         
    "BADGE_SKYRIM" |         
    "BADGE_SAFARI" |         
    "BADGE_AMAZON" |         
    "BADGE_APPLE" |          
    "BADGE_STEAM" |          
    "BADGE_XBOX" |           
    "BADGE_EPIC" |           
    "BADGE_EDGE" |  
    "BADGE_DOOM" |        
    "BADGE_GPT" |            
    "BADGE_MAC" |            
    "BADGE_AMD"       

export type AnimationCode = "NULL" | "SPIN" | "SPIN_DELAY" | "SHAKE" | "PULSE" | "DANCE"

export const BADGES: Record<BadgeCode, Badge> = {
    "BADGE_GHOSTBUSTER": {
        code: "BADGE_GHOSTBUSTER",
        link: "https://img.icons8.com/color/100/ghostbusters.png"
    },
    "BADGE_GRYFFINDOR": {
        code: "BADGE_GRYFFINDOR",
        link: "https://img.icons8.com/color/100/gryffindor.png"
    },
    "BADGE_HUFFLEPUFF": {
        code: "BADGE_HUFFLEPUFF",
        link: "https://img.icons8.com/color/100/hufflepuff.png"
    },
    "BADGE_SLYTHERIN": {
        code: "BADGE_SLYTHERIN",
        link: "https://img.icons8.com/color/100/slytherin.png"
    },
    "BADGE_RAVENCLAW": {
        code: "BADGE_RAVENCLAW",
        link: "https://img.icons8.com/color/100/ravenclaw.png"
    },
    "BADGE_EDGE": {
        code: "BADGE_EDGE",
        link: "https://img.icons8.com/color/100/ms-edge-new.png"
    },
    "BADGE_SAFARI": {
        code: "BADGE_SAFARI",
        link: "https://img.icons8.com/color/100/safari--v1.png"
    },
    "BADGE_APPLE": {
        code: "BADGE_APPLE",
        link: "https://img.icons8.com/color/100/mac-os--v1.png"
    },
    "BADGE_BLENDER": {
        code: "BADGE_BLENDER",
        link: "https://img.icons8.com/color/100/blender-3d.png"
    },
    "BADGE_CHROME": {
        code: "BADGE_CHROME",
        link: "https://img.icons8.com/color/100/chrome--v1.png"
    },
    "BADGE_NVIDIA": {
        code: "BADGE_NVIDIA",
        link: "https://img.icons8.com/color/100/nvidia.png"
    },
    "BADGE_STARBUCKS": {
        code: "BADGE_STARBUCKS",
        link: "https://img.icons8.com/color/100/starbucks.png"
    },
    "BADGE_DISCORD": {
        code: "BADGE_DISCORD",
        link: "https://img.icons8.com/color/100/discord--v2.png"
    },
    "BADGE_DEEPSEEK": {
        code: "BADGE_DEEPSEEK",
        link: "https://img.icons8.com/color/100/deepseek.png"
    },
    "BADGE_GPT": {
        code: "BADGE_GPT",
        link: "https://img.icons8.com/color/100/chatgpt.png"
    },
    "BADGE_SKYRIM": {
        code: "BADGE_SKYRIM",
        link: "https://img.icons8.com/color/100/skyrim.png"
    },
    "BADGE_XBOX": {
        code: "BADGE_XBOX",
        link: "https://img.icons8.com/color/100/xbox--v1.png"
    },
    "BADGE_PLAYSTATION": {
        code: "BADGE_PLAYSTATION",
        link: "https://img.icons8.com/color/100/play-station.png"
    },
    "BADGE_STEAM": {
        code: "BADGE_STEAM",
        link: "https://img.icons8.com/color/100/steam-circled.png"
    },
    "BADGE_SWITCH": {
        code: "BADGE_SWITCH",
        link: "https://img.icons8.com/color/100/nintendo-switch-logo.png"
    },
    "BADGE_EPIC": {
        code: "BADGE_EPIC",
        link: "https://img.icons8.com/color/100/epic-games.png"
    },
    "BADGE_HEARTHSTONE": {
        code: "BADGE_HEARTHSTONE",
        link: "https://img.icons8.com/color/100/hearthstone.png"
    },
    "BADGE_FALLOUT": {
        code: "BADGE_FALLOUT",
        link: "https://img.icons8.com/color/100/fallout.png"
    },
    "BADGE_MINECRAFT": {
        code: "BADGE_MINECRAFT",
        link: "https://img.icons8.com/color/100/minecraft-logo--v1.png"
    },
    "BADGE_GENSHIN": {
        code: "BADGE_GENSHIN",
        link: "https://img.icons8.com/color/100/genshin-impact.png"
    },
    "BADGE_TERRARIA": {
        code: "BADGE_TERRARIA",
        link: "https://img.icons8.com/color/100/best-terraria.png"
    },
    "BADGE_DOOM": {
        code: "BADGE_DOOM",
        link: "https://img.icons8.com/color/100/doom-logo.png"
    },
    "BADGE_ELDENRING": {
        code: "BADGE_ELDENRING",
        link: "https://img.icons8.com/color/100/elden-ring.png"
    },
    "BADGE_ROCKSTAR": {
        code: "BADGE_ROCKSTAR",
        link: "https://img.icons8.com/color/100/rockstar-games.png"
    },
    "BADGE_BITCOIN": {
        code: "BADGE_BITCOIN",
        link: "https://img.icons8.com/color/100/bitcoin--v1.png"
    },
    "BADGE_ETHEREUM": {
        code: "BADGE_ETHEREUM",
        link: "https://img.icons8.com/color/100/ethereum.png"
    },
    "BADGE_AMD": {
        code: "BADGE_AMD",
        link: "https://img.icons8.com/color/100/amd.png"
    },
    "BADGE_CLOUDFLARE": {
        code: "BADGE_CLOUDFLARE",
        link: "https://img.icons8.com/color/100/cloudflare.png"
    },
    "BADGE_HEROKU": {
        code: "BADGE_HEROKU",
        link: "https://img.icons8.com/color/100/heroku.png"
    },
    "BADGE_MICROSOFT": {
        code: "BADGE_MICROSOFT",
        link: "https://img.icons8.com/color/100/microsoft.png"
    },
    "BADGE_MAC": {
        code: "BADGE_MAC",
        link: "https://img.icons8.com/color/100/mac-logo.png"
    },
    "BADGE_WINDOWS": {
        code: "BADGE_WINDOWS",
        link: "https://img.icons8.com/color/100/windows-11.png"
    },
    "BADGE_AMAZON": {
        code: "BADGE_AMAZON",
        link: "https://img.icons8.com/color/100/amazon.png"
    }
}

export const ANIMATIONS: Record<AnimationCode, BadgeAnimation> = {
    "NULL": {
        code: "NULL",
        name: "None",
        animation: ""
    },
    "SPIN": {
        code: "SPIN",
        name: "Spin",
        animation: "spin 1s linear infinite reverse"
    }, 
    "SPIN_DELAY": {
        code: "SPIN_DELAY",
        name: "Spin Delay",
        animation: "spinDelay 2s ease-in-out infinite reverse"
    }, 
    "SHAKE": {
        code: "SHAKE",
        name: "Shake",
        animation: "shake 2s linear infinite"
    },
    "PULSE": {
        code: "PULSE",
        name: "Pulse",
        animation: "pulse 2s ease-in-out infinite"
    }, 
    "DANCE": {
        code: "DANCE",
        name: "Dance",
        animation: "dance 2s ease-in-out infinite"
    }
}

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


