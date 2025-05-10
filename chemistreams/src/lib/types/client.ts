
export interface InterfaceContextValue {
    setText: (text: string, color?: string) => void
}

export interface GenericError {
    code: string
    message: string
}

export interface ChatMetaData {
    id: string
    to?: string
    isGroup?: true
    pfp: string
    username?: string
    name: string
    status?: string
}

export interface ChatMessage {
    id: string
    sender: string
    type: number
    content?: string
    added?: string
    removed?: string
    timestamp: Date
}
