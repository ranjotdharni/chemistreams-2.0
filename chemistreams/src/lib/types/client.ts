
export interface InterfaceContextValue {
    setText: (text: string, color?: string) => void
}

export interface GenericError {
    code: string
    message: string
}

export interface ChatMetaData {
    id: string | number
    pfp: string
    online: boolean
    name: string
    status: string
    timestamp: string
    lastChat: string
}

export interface ChatMessage {
    id: string | number
    incoming?: boolean
    message: string
    timestamp: Date
}
