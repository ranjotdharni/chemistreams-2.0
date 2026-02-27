import { useEffect, useRef, useState } from "react"

export type UseTimeoutType = {
    started: boolean
    completed: boolean
    begin: (milliseconds: number) => void
    reset: () => void
}

export default function useTimeout(initial?: number): UseTimeoutType {
    const timeoutId = useRef<number | NodeJS.Timeout | undefined>(undefined)
    
    const [milliseconds, setMilliseconds] = useState<number>(initial ? initial : 0)
    const [started, setStarted] = useState<boolean>(false)
    const [completed, setCompleted] = useState<boolean>(false)

    function begin(milliseconds: number): void {
        setStarted(true)
        setCompleted(false)
        setMilliseconds(milliseconds)
    }

    function completeTimeout() {
        setStarted(false)
        setCompleted(true)
    }

    function reset() {
        setStarted(false)
        setCompleted(false)
        setMilliseconds(0)
    }

    useEffect(() => {
        function startTimeout(): number | NodeJS.Timeout | undefined {
            if (timeoutId.current)                  // previous timeout still active, clear first
                clearTimeout(timeoutId.current)

            return setTimeout(()=> {    // after ${stopAt} milliseconds, clear this timeout
                timeoutId.current = undefined
                completeTimeout()
            }, milliseconds)
        }

        function stopTimeout() {
            if (timeoutId.current)
                clearTimeout(timeoutId.current)
        }

        if (started)
            timeoutId.current = startTimeout()

        if (!started)       // in case of reset call, stop any timeout if it exists when started becomes false
            stopTimeout()

        return stopTimeout  // stop any remaining timeout on component dismount
    }, [started, milliseconds])

    return { started, completed, begin, reset }
}
