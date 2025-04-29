import { DataSnapshot } from "firebase/database"

// This file contains helper types for hooks, not hook props

export interface UseListenerEventDetails {
    callback: (snapshot: DataSnapshot) => void
    errorTitle: string
}

export interface UseListenerConfig {
    value?: UseListenerEventDetails
    added?: UseListenerEventDetails
    changed?: UseListenerEventDetails
    removed?: UseListenerEventDetails
    moved?: UseListenerEventDetails
}
