"use client"

import { DatabaseReference, off, onChildAdded, onChildChanged, onChildMoved, onChildRemoved, onValue } from "firebase/database"
import { UseListenerConfig } from "../types/hooks"
import { useEffect } from "react"

// reference and config (including its attributes) MUST BE MEMOIZED TO AVOID DUPLICATION VIA LISTENER REATTACHMENT ON DEPENDECY CHANGE!!!!!!!
export default function useListener(reference: DatabaseReference, config: UseListenerConfig): void {
    if (!config.value && !config.added && !config.changed && !config.removed && !config.moved)
        throw new Error("useListener config requires at least one event type")

    useEffect(() => {
        function unsubscribe() {
            if (config.value)
                off(reference, "value", config.value.callback)
    
            if (config.added)
                off(reference, "child_added", config.added.callback)
    
            if (config.changed)
                off(reference, "child_changed", config.changed.callback)
    
            if (config.removed)
                off(reference, "child_removed", config.removed.callback)
    
            if (config.moved)
                off(reference, "child_moved", config.moved.callback)
        }

        if (config.value)
            onValue(reference, config.value.callback, config.value.errorCallback)

        if (config.added)
            onChildAdded(reference, config.added.callback, config.added.errorCallback)

        if (config.changed)
            onChildChanged(reference, config.changed.callback, config.changed.errorCallback)

        if (config.removed)
            onChildRemoved(reference, config.removed.callback, config.removed.errorCallback)

        if (config.moved)
            onChildMoved(reference, config.moved.callback, config.moved.errorCallback)

        return unsubscribe
    }, [reference, config])
}
