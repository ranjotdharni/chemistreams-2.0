"use client"

import { isValidPassword } from "@/lib/utils/client"
import { PAGE_LOGIN } from "@/lib/constants/routes"
import { GenericError } from "@/lib/types/client"
import { signUpAction } from "@/lib/utils/server"
import useNotify from "@/lib/hooks/useNotify"
import { FormEvent, useState } from "react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useNotify()

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // add validation here
    const invalidPassword: GenericError | undefined = isValidPassword(password)

    if (email === "") {
      setError("Please enter an email.")
      return
    }

    if (invalidPassword !== undefined) {
        // sign user up
        setError((invalidPassword as GenericError).message)
        return
    }
    else {
        try {
            const response = await signUpAction(email, password)
            console.log({ response })
            setEmail("")
            setPassword("")
        }
        catch (error) {
            console.error(error)
        }
    }
  }

  return (
    <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">Sign Up</h2>
        {error && error !== "" && <p className="text-red-500 text-center mb-4">{error}</p>}

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
                    className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password..."
                />
            </div>

            <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                Sign Up
            </button>
        </form>

        <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <a href={PAGE_LOGIN} className="text-blue-400 hover:underline">
            Log In
            </a>
        </p>
    </div>
  )
}