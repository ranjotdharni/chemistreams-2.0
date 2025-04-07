import { Claims } from "next-firebase-auth-edge/lib/auth/claims"
import { UserInfo } from "firebase/auth"

export interface User extends UserInfo {
    emailVerified: boolean
    customClaims: Claims
}

export interface AuthContextValue {
    user: User | null
}
