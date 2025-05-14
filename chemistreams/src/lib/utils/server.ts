"use server"

import { DEFAULT_PFP, ERRORS, LOGIN_FAILURE_ERROR, SIGNOUT_FAILURE_ERROR, SIGNUP_FAILURE_ERROR } from "../constants/client"
import { refreshCookiesWithIdToken, removeServerCookies } from "next-firebase-auth-edge/next/cookies"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { DB_USERNAMES, DB_USERS, PAGE_HOME, PAGE_LOGIN } from "../constants/routes"
import { clientConfig, serverConfig } from "../auth/config"
import { ref, get, set, update } from "firebase/database"
import { cookies, headers } from "next/headers"
import { GenericError } from "../types/client"
import { auth, rt } from "../auth/firebase"
import { redirect } from "next/navigation"

export async function loginAction(email: string, password: string): Promise<void | GenericError> {
    try {
        const credentials = await signInWithEmailAndPassword(
            auth,
            email,
            password
        )
    
        const idToken = await credentials.user.getIdToken()
    
        await refreshCookiesWithIdToken(
            idToken,
            await headers(),
            await cookies(),
            {
                ...serverConfig,
                apiKey: clientConfig.apiKey
            }
        )
    }
    catch {
        return ERRORS[LOGIN_FAILURE_ERROR]
    }

    redirect(PAGE_HOME)
}

export async function signUpAction(name: string, email: string, username: string, password: string): Promise<void | GenericError> {
    try {
        const usernameCheck = ref(rt, `${DB_USERNAMES}/${username}`)
        const checkResult = await get(usernameCheck)

        if (checkResult.exists())
            return ERRORS[SIGNUP_FAILURE_ERROR]

        const credentials = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        )

        const idToken = await credentials.user.getIdToken()
        const user = credentials.user

        await set(ref(rt, `${DB_USERS}/${user.uid}`), {
            username: username,
            name: name,
            bio: "",
            pfp: DEFAULT_PFP
        })

        const newUserRoute: string = `${DB_USERS}/${user.uid}`
        const newUsernameRoute: string = `${DB_USERNAMES}/${username}`

        const updates: Record<string, any> = {
            [newUserRoute]: {
                username: username,
                name: name,
                bio: "",
                pfp: DEFAULT_PFP
            },
            [newUsernameRoute]: user.uid
        }

        await update(ref(rt), updates)

        await refreshCookiesWithIdToken(
            idToken,
            await headers(),
            await cookies(),
            {
                ...serverConfig,
                apiKey: clientConfig.apiKey
            }
        )
    }
    catch (error) {
        console.log(error)
        return ERRORS[SIGNUP_FAILURE_ERROR]
    }

    redirect(PAGE_HOME)
}

export async function logoutAction(): Promise<void | GenericError> {
    try {
        await signOut(auth)
        removeServerCookies(await cookies(), { cookieName: serverConfig.cookieName })
    }
    catch (error) {
        console.log(error)
        return ERRORS[SIGNOUT_FAILURE_ERROR]
    }

    redirect(PAGE_LOGIN)
}
