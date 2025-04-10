
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
