import { useEffect, useState } from "react"

export default function useNotify(initial?: string): [string, (message: string) => void] {
    const [message, setMessage] = useState<string>(initial ? initial : "")

    useEffect(() => {
        let timeoutId: NodeJS.Timeout | string | number | undefined

        function startTimeout(): NodeJS.Timeout | string | number | undefined {
            if (timeoutId)
                clearTimeout(timeoutId)

            return setTimeout(()=> {
                timeoutId = undefined
                setMessage('')
            }, 8000)
        }

        function stopTimeout() {
            if (timeoutId)
                clearTimeout(timeoutId)
        }

        if (message !== "")
            timeoutId = startTimeout()

        return stopTimeout
    }, [message])

    return [message, setMessage]
}
