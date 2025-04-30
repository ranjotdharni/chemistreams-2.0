"use client"

import { InterfaceContext } from "../context/InterfaceContext"
import { useContext, useState } from "react"

// 'message' should follow format "${COMPONENT}_${RECORD}_${ACTION}_ERROR"
export function useDatabaseErrorHandler(message: string): [(error: Error) => void, (message: string) => void] {
    const UIControl = useContext(InterfaceContext)

    const [errorMethod, setErrorMethod] = useState<(error: Error) => void>(() => {
        return (error: Error) => {
            UIControl.setText(`${message}: ${error.message}`, "red")
        }
    })

    function handleUpdate(message: string) {
        setErrorMethod((error: Error) => {
            UIControl.setText(`${message}: ${error.message}`, "red")
        })
    }

    return [errorMethod, handleUpdate]
}
