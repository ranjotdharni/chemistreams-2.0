"use server"

import { refreshCookiesWithIdToken } from "next-firebase-auth-edge/next/cookies"
import { clientConfig, serverConfig } from "../auth/config"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { cookies, headers } from "next/headers"
import { PAGE_HOME } from "../constants/routes"
import { redirect } from "next/navigation"
import { auth } from "../auth/firebase"

export async function loginAction(username: string, password: string) {
    const credentials = await signInWithEmailAndPassword(
        auth,
        username,
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

    redirect(PAGE_HOME)
}

export async function signUpAction(email: string, password: string) {
    const credentials = await createUserWithEmailAndPassword(
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
