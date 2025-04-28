"use client"

import { isValidPassword, isValidUsername } from "@/lib/utils/client"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { FormEvent, useContext, useState } from "react"
import { PAGE_LOGIN } from "@/lib/constants/routes"
import { GenericError } from "@/lib/types/client"
import { signUpAction } from "@/lib/utils/server"

export default function SignUpPage() {
  const UIControl = useContext(InterfaceContext)

  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (name === "") {
        UIControl.setText("Please enter your name.", "red")
        return
    }

    if (email === "") {
      UIControl.setText("Please enter an email.", "red")
      return
    }

    // add validation here
    const invalidUsername: GenericError | undefined = isValidUsername(username)
    const invalidPassword: GenericError | undefined = isValidPassword(password)

    if (invalidUsername !== undefined) {
        UIControl.setText((invalidUsername as GenericError).message, "red")
        return
    }
    else if (invalidPassword !== undefined) {
        UIControl.setText((invalidPassword as GenericError).message, "red")
        return
    }
    else {
        // sign user up
        const response: void | GenericError = await signUpAction(name, email, username, password)

        if (response !== undefined && (response as GenericError).code !== undefined) {
            UIControl.setText((response as GenericError).message, "red")
            return
        }

        setName("")
        setEmail("")
        setUsername("")
        setPassword("")
    }
  }

  return (
    <div className="w-full max-w-md bg-black p-8 rounded-lg shadow-lg text-white">
        <h2 className="text-3xl font-semibold text-center mb-6">Sign Up</h2>

        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                </label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-3 bg-dark-grey text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter name..."
                />
                </div>

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
                    className="w-full p-3 bg-dark-grey text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example@example.com"
                />
                </div>

                <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                    Username
                </label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full p-3 bg-dark-grey text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter username..."
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
                    className="w-full p-3 bg-dark-grey text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password..."
                />
            </div>

            <button
                type="submit"
                className="w-full py-3 bg-blue text-white rounded-md font-semibold hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                Sign Up
            </button>
        </form>

        <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <a href={PAGE_LOGIN} className="text-blue hover:underline">
            Log In
            </a>
        </p>
    </div>
  )
}