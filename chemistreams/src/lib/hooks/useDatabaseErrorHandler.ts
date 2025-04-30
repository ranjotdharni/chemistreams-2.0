"use client"

import { InterfaceContext } from "../context/InterfaceContext"
import { useContext } from "react"

// 'message' should follow format "${COMPONENT}_${RECORD}_${ACTION}_ERROR"
export function useDatabaseErrorHandler(message: string): (error: Error) => void {
    const UIControl = useContext(InterfaceContext)

    return (error: Error) => {
        UIControl.setText(`${message}: ${error.message}`, "red")
    }
}
