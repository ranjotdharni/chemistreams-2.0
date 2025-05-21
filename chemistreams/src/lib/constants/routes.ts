
// Page Routes
export const PAGE_SIGNUP: string = "/signup"
export const PAGE_LOGIN: string = "/login"
export const PAGE_HOME: string = "/chat"
export const PAGE_LANDING: string = "/"

// API Routes
export const API_REFRESH_TOKEN: string = "/api/refresh-token"
export const API_PROFILE: string = "/api/profile"
export const API_LOGOUT: string = "/api/logout"
export const API_UPLOAD: string = "/api/upload"
export const API_LOGIN: string = "/api/login"

// Database Routes
export const DB_USERNAMES: string = "usernames"
export const DB_METADATA: string = "metadata"
export const DB_MESSAGES: string = "messages"
export const DB_GROUPS: string = "groups"
export const DB_USERS: string = "users"

export const PUBLIC_ROUTES: string[] = [
    PAGE_LANDING,
    PAGE_SIGNUP,
    PAGE_LOGIN,
]
