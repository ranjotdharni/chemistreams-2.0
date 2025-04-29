"use client"

import { DatabaseReference, off, onChildAdded, onChildChanged, onChildMoved, onChildRemoved, onValue } from "firebase/database"
import { createDatabaseErrorHandler } from "../utils/client"
import { UseListenerConfig } from "../types/hooks"
import { useEffect } from "react"

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
            onValue(reference, config.value.callback, createDatabaseErrorHandler(config.value.errorTitle))

        if (config.added)
            onChildAdded(reference, config.added.callback, createDatabaseErrorHandler(config.added.errorTitle))

        if (config.changed)
            onChildChanged(reference, config.changed.callback, createDatabaseErrorHandler(config.changed.errorTitle))

        if (config.removed)
            onChildRemoved(reference, config.removed.callback, createDatabaseErrorHandler(config.removed.errorTitle))

        if (config.moved)
            onChildMoved(reference, config.moved.callback, createDatabaseErrorHandler(config.moved.errorTitle))

        return unsubscribe
    }, [reference, config])
}
