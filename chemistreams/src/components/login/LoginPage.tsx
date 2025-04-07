"use client"

import { FormEvent, useState, useTransition } from "react"
import { PAGE_SIGNUP } from "@/lib/constants/routes"
import { LoginPageProps } from "@/lib/types/props"
import useNotify from "@/lib/hooks/useNotify"

export default function LoginPage({ loginAction } : LoginPageProps) {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  let [isLoginActionPending, startTransition] = useTransition()
  const [error, setError] = useNotify()

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    event.stopPropagation()

    // add validation here
    if (email === "" || password === "") {
      setError("Please enter both email and password.")
      return
    }

    startTransition(() => loginAction(email, password))
    
    if (error !== "")
        setError("") // clear error if set
  }

  return (
    <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>
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
                disabled={isLoginActionPending}
                className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                Login
            </button>
        </form>

        <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <a href={PAGE_SIGNUP} className="text-blue-400 hover:underline">
                Sign Up
            </a>
        </p>
    </div>
  )
}
