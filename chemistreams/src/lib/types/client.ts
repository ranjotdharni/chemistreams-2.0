import { JSX } from "react"

export interface InterfaceContextValue {
    setText: (text: string, color?: string) => void
}

export interface GenericError {
    code: string
    message: string
}

export interface ChatMetaData {
    id: string
    creator: string
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

export interface DropListProps<T> {
    open: boolean
    TitleComponent: JSX.Element | JSX.Element[]
    items: T[]
    render: (item: T, index: number) => JSX.Element
    containerTailwind: string
}

export interface GroupMember {
    id: string
    name: string
    username: string
}
