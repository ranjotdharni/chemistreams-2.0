import { DataSnapshot } from "firebase/database"

// This file contains helper types for hooks, not hook props

export interface UseListenerEventDetails {
    callback: (snapshot: DataSnapshot) => void
    errorCallback: (error: Error) => void
}

export interface UseListenerConfig {
    value?: UseListenerEventDetails
    added?: UseListenerEventDetails
    changed?: UseListenerEventDetails
    removed?: UseListenerEventDetails
    moved?: UseListenerEventDetails
}
