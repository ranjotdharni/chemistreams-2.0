"use client"

import { isValidDisplayName, isValidPassword, isValidUsername } from "@/lib/utils/client"
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

    const labelStyle: string = "text-amber-50 text-sm font-medium mb-2"
    const inputStyle: string = "w-full p-3 bg-dark-grey text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (name.trim() === "") {
            UIControl.setText("Please enter your name.", "red")
            return
        }

        if (email.trim() === "") {
        UIControl.setText("Please enter an email.", "red")
        return
        }

        // add validation here
        const invalidDisplayName: GenericError | undefined = isValidDisplayName(name.trim())
        const invalidUsername: GenericError | undefined = isValidUsername(username.trim())
        const invalidPassword: GenericError | undefined = isValidPassword(password.trim())

        if (invalidDisplayName !== undefined) {
            UIControl.setText((invalidDisplayName as GenericError).message, "red")
            return
        }
        else if (invalidUsername !== undefined) {
            UIControl.setText((invalidUsername as GenericError).message, "red")
            return
        }
        else if (invalidPassword !== undefined) {
            UIControl.setText((invalidPassword as GenericError).message, "red")
            return
        }
        else {
            // sign user up
            const response: void | GenericError = await signUpAction(name.trim(), email.trim(), username.trim(), password.trim())

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
        <section className="w-full h-full flex flex-col justify-center items-center sm:p-8">
            <form onSubmit={onSubmit} className="relative bottom-15 w-[95%] sm:w-110 space-y-4 bg-black rounded-lg px-8 py-6 flex flex-col items-center">
                <h2 className="text-3xl font-lato text-center text-amber-50 mb-6">Sign Up</h2>

                <div className="w-full">
                    <label htmlFor="name" className={labelStyle}>
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={inputStyle}
                        placeholder="Enter name..."
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="email" className={labelStyle}>
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={inputStyle}
                        placeholder="example@example.com"
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="username" className={labelStyle}>
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className={inputStyle}
                        placeholder="Enter username..."
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="password" className={labelStyle}>
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={inputStyle}
                        placeholder="Enter password..."
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-green text-white rounded-md font-semibold hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                    Sign Up
                </button>

                <p className="text-center text-amber-50 text-sm mt-4">
                    Already have an account?{" "}
                    <a href={PAGE_LOGIN} className="text-blue hover:underline">
                    Log In
                    </a>
                </p>
            </form>
        </section>
    )
}