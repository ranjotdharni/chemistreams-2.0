"use client"

import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { FormEvent, useContext, useState } from "react"
import { PAGE_SIGNUP } from "@/lib/constants/routes"
import { isValidPassword } from "@/lib/utils/client"
import { LoginPageProps } from "@/lib/types/props"
import { GenericError } from "@/lib/types/client"

export default function LoginPage({ loginAction } : LoginPageProps) {
  const UIControl = useContext(InterfaceContext)

  const [disable, setDisable] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    event.stopPropagation()

    const invalidPassword: GenericError | undefined = isValidPassword(password)

    // add validation here
    if (email === "") {
      UIControl.setText("Please enter a valid email.", "red")
      return
    }

    if (invalidPassword !== undefined) {
        UIControl.setText((invalidPassword as GenericError).message, "red")
        return
    }

    setDisable(true)

    const loginResult: void | GenericError = await loginAction(email, password)

    if (loginResult !== undefined && (loginResult as GenericError).code !== undefined) {
        UIControl.setText(loginResult.message, "red")
    }

    setDisable(false)
  }

  return (
    <div className="w-full max-w-md bg-black p-8 rounded-lg shadow-lg text-white">
        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>

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
                className="w-full py-3 bg-blue text-white rounded-md font-semibold hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                Login
            </button>
        </form>

        <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <a href={PAGE_SIGNUP} className="text-blue hover:underline">
                Sign Up
            </a>
        </p>
    </div>
  )
}
