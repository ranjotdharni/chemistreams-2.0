"use client"

import { browserPopupRedirectResolver, signInWithPopup } from "firebase/auth"
import { githubProvider, googleProvider } from "@/lib/auth/provider"
import { FormEvent, MouseEvent, useContext, useState } from "react"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { PAGE_HOME, PAGE_SIGNUP } from "@/lib/constants/routes"
import { providerLoginAction } from "@/lib/utils/server"
import { isValidPassword } from "@/lib/utils/client"
import { LoginPageProps } from "@/lib/types/props"
import { GenericError } from "@/lib/types/client"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/auth/firebase"

export default function LoginPage({ loginAction } : LoginPageProps) {
    const router = useRouter()

  const UIControl = useContext(InterfaceContext)

  const [disable, setDisable] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    event.stopPropagation()

    const invalidPassword: GenericError | undefined = isValidPassword(password.trim())

    // add validation here
    if (email.trim() === "") {
      UIControl.setText("Please enter a valid email.", "red")
      return
    }

    if (invalidPassword !== undefined) {
        UIControl.setText((invalidPassword as GenericError).message, "red")
        return
    }

    setDisable(true)

    const loginResult: void | GenericError = await loginAction(email.trim(), password.trim())

    if (loginResult !== undefined && (loginResult as GenericError).code !== undefined) {
        UIControl.setText(loginResult.message, "red")
    }

    setDisable(false)
  }

  async function handleGoogleLogin(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()

    setDisable(true)

    try {
        const credentials = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver)
        const uid = credentials.user.uid
        const email = credentials.user.email
        const name = credentials.user.displayName || ""
        const idToken = await credentials.user.getIdToken()

        if (!email)
            throw new Error()

        const loginResult = await providerLoginAction(uid, email, name.trim(), idToken)

        if (loginResult !== undefined && (loginResult as GenericError).code !== undefined) {
            UIControl.setText(loginResult.message, "red")
        }
    }
    catch (error) {
        console.log(error)
        UIControl.setText("Failed to log you in. Check your credentials.", "red")
        setDisable(false)
        return
    }

    setDisable(false)
    router.push(PAGE_HOME)
  }

  async function handleGithubLogin(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()

    setDisable(true)

    try {
        const credentials = await signInWithPopup(auth, githubProvider, browserPopupRedirectResolver)
        const uid = credentials.user.uid
        const email = credentials.user.email
        const name = credentials.user.displayName || ""
        const idToken = await credentials.user.getIdToken()

        if (!email)
            throw new Error()

        const loginResult = await providerLoginAction(uid, email, name.trim(), idToken)

        if (loginResult !== undefined && (loginResult as GenericError).code !== undefined) {
            UIControl.setText(loginResult.message, "red")
        }
    }
    catch (error) {
        console.log(error)
        UIControl.setText("Failed to log you in. Check your credentials.", "red")
        setDisable(false)
        return
    }

    setDisable(false)
    router.push(PAGE_HOME)
  }

  return (
    <div className="w-full max-w-md bg-black p-8 rounded-lg shadow-lg text-white">
        <h2 className="text-3xl font-lato text-center mb-6">Log In</h2>

        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={disable}
                    className="w-full p-3 bg-dark-grey text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example@example.com"
                />
                </div>

                <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={disable}
                    className="w-full p-3 bg-dark-grey text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password..."
                />
            </div>

            <button
                type="submit"
                disabled={disable}
                className="w-full py-3 bg-green text-white rounded-md font-semibold hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                Log In
            </button>
        </form>

        <div className="w-full mt-3 pt-3 border-t-2 border-dark-grey flex flex-col space-y-4">
            <button onClick={handleGoogleLogin} disabled={disable} className="w-full h-10 py-2 text text-white font-semibold bg-blue rounded-md space-x-4 flex flex-row justify-center items-center hover:cursor-pointer">
                <img className="h-full aspect-square" src="https://img.icons8.com/fluency/100/google-logo.png" alt="google" />
                <p>Google Sign-In</p>
            </button>
            <button onClick={handleGithubLogin} disabled={disable} className="w-full h-10 py-2 text text-white font-semibold bg-blue rounded-md space-x-4 flex flex-row justify-center items-center hover:cursor-pointer">
                <img className="h-full aspect-square rounded" src="https://img.icons8.com/external-tal-revivo-shadow-tal-revivo/24/external-github-community-for-software-building-and-testing-online-logo-shadow-tal-revivo.png" alt="github" />
                <p>GitHub Sign-In</p>
            </button>
        </div>

        <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <a href={PAGE_SIGNUP} className="text-blue hover:underline">
                Sign Up
            </a>
        </p>
    </div>
  )
}
