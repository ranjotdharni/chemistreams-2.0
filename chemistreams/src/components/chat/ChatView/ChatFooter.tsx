"use client"

import { FILE_TYPE_CODE, MAXIMUM_IMAGE_UPLOAD_SIZE, MESSAGE_TYPE_CODE, SPOTIFY_EMBED_TYPE_CODE, YOUTUBE_EMBED_TYPE_CODE } from "@/lib/constants/server"
import { ChangeEvent, MouseEvent, FormEvent, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { DirectChatMetaData, GenericError, GroupChatMetaData } from "@/lib/types/client"
import { LucideIcon, SendIcon, Paperclip, Music, MonitorPlay } from "lucide-react"
import { DataSnapshot, push, ref, serverTimestamp, set } from "firebase/database"
import { useDatabaseErrorHandler } from "@/lib/hooks/useDatabaseErrorHandler"
import { API_UPLOAD, DB_MESSAGES, DB_USERS } from "@/lib/constants/routes"
import { extractYoutubeResources, isValidUrl } from "@/lib/utils/general"
import { DriveFileType, DriveMimeType } from "@/lib/types/server"
import { InterfaceContext } from "@/lib/context/InterfaceContext"
import { AuthContext } from "@/lib/context/AuthContext"
import { UseListenerConfig } from "@/lib/types/hooks"
import { ChatFooterProps } from "@/lib/types/props"
import useListener from "@/lib/hooks/useListener"
import Loader from "@/components/utils/Loader"
import { rt } from "@/lib/auth/firebase"

const CLEAR_TYPING_MS: number = 3000
const SPOTIFY_RESOURCES = ["track", "album", "playlist", "artist", "show"]

interface FooterButtonProps {
    isDisabled: boolean
    Icon: LucideIcon
    onClick: (event: MouseEvent<HTMLButtonElement>) => void
}

function YoutubeEmbeder({ close, uid, chatId } : { close: () => void, uid: string, chatId: string }) {
    const UIControl = useContext(InterfaceContext)

    const [youtubeLink, setYoutubeLink] = useState<string>("")
    const [loader, setLoader] = useState<boolean>(false)
    const [invalidLink, setInvalidLink] = useState<boolean>(false)

    function onLinkChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        setYoutubeLink(event.target.value)
    }

    function clear(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        setInvalidLink(false)
        setYoutubeLink("")
    }

    async function handleUpload(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        if (loader)
            return

        setLoader(true)
        setInvalidLink(false)

        const youtubeId = extractYoutubeResources(youtubeLink)

        if ((youtubeId as GenericError).code) {
            setLoader(false)
            setInvalidLink(true)
            return
        }

        try {
            const messageData = {
                sender: uid,
                type: YOUTUBE_EMBED_TYPE_CODE,
                youtubeId: youtubeId,
                timestamp: serverTimestamp()
            }

            await push(ref(rt, `${DB_MESSAGES}/${chatId}`), messageData)
        }
        catch (_) {
            UIControl.setText("Failed to send message.", "red")
            setLoader(false)
            close()
            return
        }
        
        setLoader(false)
        UIControl.setText("Message sent.", "green")
        close() // should be very last
    }

    return (
        <div className="backdrop-blur z-40 fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center">
            <div className="w-[95%] h-[75%] md:h-1/3 md:w-1/5 bg-black border border-dark-grey rounded flex flex-col items-center space-y-4 py-2 px-4">
                <h2 className="text-green w-full font-lato text-xl border-b border-dark-grey">Attach YouTube Link</h2>

                <input
                    className="w-full h-[12.5%] border-b border-dark-white rounded px-2 outline-none font-lato text-light-grey focus:text-green focus:border-green"
                    placeholder="Paste link..."
                    value={youtubeLink}
                    onChange={onLinkChange}
                />
                
                <div
                    className="w-full flex flex-row justify-end px-2"
                >
                    <button
                        className="hover:cursor-pointer hover:text-red text-sm text-dark-white font-jbm"
                        onClick={clear}
                    >
                        Clear
                    </button>
                </div>

                <span className="w-full flex flex-row justify-between font-jbm text-red">
                    {
                        (
                            invalidLink ? "Invalid Link" : ""
                        )
                    }
                </span>

                <span
                    className="w-full text-center text-sm text-green font-lato"
                >
                    <p>
                        Get the link for a video and paste it above. When you send a 
                        valid YouTube video, ChemiStreams will embed it as a chat message.
                    </p>
                </span>

                <div className="w-full flex-1 flex flex-row justify-end items-end space-x-2">
                    {
                        loader ? 
                        <Loader containerTailwind="w-1/4 h-5" /> :
                        <>
                            <button 
                                onClick={close}
                                className="transition-colors duration-200 text-light-grey text-sm px-1 font-lato border border-light-grey rounded hover:cursor-pointer hover:bg-light-grey hover:text-black"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUpload}
                                className="transition-colors duration-200 text-white text-sm px-1 font-lato border border-green rounded hover:cursor-pointer hover:bg-green"
                            >
                                Send
                            </button>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

function SpotifyEmbeder({ close, uid, chatId } : { close: () => void, uid: string, chatId: string }) {
    const UIControl = useContext(InterfaceContext)

    const [spotifyLink, setSpotifyLink] = useState<string>("")
    const [loader, setLoader] = useState<boolean>(false)
    const [invalidLink, setInvalidLink] = useState<boolean>(false)

    function onLinkChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        setSpotifyLink(event.target.value)
    }

    function clear(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        setInvalidLink(false)
        setSpotifyLink("")
    }

    async function handleUpload(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        if (loader)
            return

        setLoader(true)

        setInvalidLink(false)

        const link = spotifyLink.trim().split("?")[0]

        if (!isValidUrl(link)) {
            setInvalidLink(true)
            setLoader(false)
            return
        }

        const resources = link.split("/")

        if (resources.length < 2 || !SPOTIFY_RESOURCES.includes(resources[resources.length - 2])) {
            setInvalidLink(true)
            setLoader(false)
            return
        }

        const spotifyId = resources[resources.length - 1]
        const resourceType = resources[resources.length - 2]

        try {
            const messageData = {
                sender: uid,
                type: SPOTIFY_EMBED_TYPE_CODE,
                spotifyId: spotifyId,
                resourceType: resourceType,
                timestamp: serverTimestamp()
            }

            await push(ref(rt, `${DB_MESSAGES}/${chatId}`), messageData)
        }
        catch (_) {
            UIControl.setText("Failed to send message.", "red")
            setLoader(false)
            close()
            return
        }
        
        setLoader(false)
        UIControl.setText("Message sent.", "green")
        close() // should be very last
    }

    return (
        <div className="backdrop-blur z-40 fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center">
            <div className="w-[95%] h-[75%] md:h-1/3 md:w-1/5 bg-black border border-dark-grey rounded flex flex-col items-center space-y-4 py-2 px-4">
                <h2 className="text-green w-full font-lato text-xl border-b border-dark-grey">Attach Spotify Link</h2>

                <input
                    className="w-full h-[12.5%] border-b border-dark-white rounded px-2 outline-none font-lato text-light-grey focus:text-green focus:border-green"
                    placeholder="Paste link..."
                    value={spotifyLink}
                    onChange={onLinkChange}
                />
                
                <div
                    className="w-full flex flex-row justify-end px-2"
                >
                    <button
                        className="hover:cursor-pointer hover:text-red text-sm text-dark-white font-jbm"
                        onClick={clear}
                    >
                        Clear
                    </button>
                </div>

                <span className="w-full flex flex-row justify-between font-jbm text-red">
                    {
                        (
                            invalidLink ? "Invalid Link" : ""
                        )
                    }
                </span>

                <span
                    className="w-full text-center text-sm text-green font-lato"
                >
                    <p>
                        Get the link for a track, album, playlist, artist, podcast, or audiobook and paste it above. 
                        When you send a valid Spotify resource, ChemiStreams will show a preview of it as a chat 
                        message.
                    </p>
                </span>

                <div className="w-full flex-1 flex flex-row justify-end items-end space-x-2">
                    {
                        loader ? 
                        <Loader containerTailwind="w-1/4 h-5" /> :
                        <>
                            <button 
                                onClick={close}
                                className="transition-colors duration-200 text-light-grey text-sm px-1 font-lato border border-light-grey rounded hover:cursor-pointer hover:bg-light-grey hover:text-black"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUpload}
                                className="transition-colors duration-200 text-white text-sm px-1 font-lato border border-green rounded hover:cursor-pointer hover:bg-green"
                            >
                                Send
                            </button>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

function AttachmentUploader({ close, chatId } : { close: () => void, chatId: string }) {
    const UIControl = useContext(InterfaceContext)

    const [file, setFile] = useState<File | null | undefined>()
    const [loader, setLoader] = useState<boolean>(false)

    function handleFile(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        setFile(event.target.files?.item(0))
    }

    async function handleUpload(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        if (!file || loader)
            return

        const formData = new FormData()
        formData.append("file", file)
        setLoader(true)

        try {
            const first = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}${API_UPLOAD}`, {
                method: "PUT",
                body: formData
            })

            const res = await first.json()

            if (!first.ok) {
                UIControl.setText(res.message || "Failed to upload file.", "red")
                setLoader(false)
                close()
                return
            }

            if (res.success) {
                const messageData = {
                    sender: res.uid,
                    type: FILE_TYPE_CODE,
                    link: res.link,
                    space: res.space,
                    fileId: res.fileId,
                    timestamp: serverTimestamp()
                }

                try {
                    await push(ref(rt, `${DB_MESSAGES}/${chatId}`), messageData)
                }
                catch(error) {
                    console.log(error)
                    UIControl.setText("Message failed to send (500 ISE).", "red")
                    setLoader(false)
                    close()
                    return
                }

                UIControl.setText("Message sent.", "green")
            }
            else {
                UIControl.setText((res as GenericError).message, "red")
                setLoader(false)
                close()
                return
            }
        }
        catch (error) {
            UIControl.setText("Failed to upload file.", "red")
            setLoader(false)
            close()
            return
        }

        setFile(null)
        setLoader(false)
        close() // should be very last
    }

    return (
        <div className="backdrop-blur z-40 fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center">
            <div className="w-[95%] h-[75%] md:h-1/3 md:w-1/5 bg-black border border-dark-grey rounded flex flex-col items-center space-y-4 py-2 px-4">
                <h2 className="text-green w-full font-lato text-xl border-b border-dark-grey">Upload File</h2>

                <input type="file" accept={Object.values(DriveMimeType).join(",")} onChange={handleFile} className="max-w-full text-dark-white font-lato flex flex-row justify-center file:bg-green file:px-1 file:mx-2 file:rounded file:font-jbm hover:file:cursor-pointer" />
                
                <p className="text-light-grey">{`[ .${Object.values(DriveFileType).join(", .")} ]`}</p>

                <span className="w-full flex flex-row justify-between">
                    <p className="text-light-grey">Max Image Size:</p>
                    <p className="text-dark-white font-jbm">{`${MAXIMUM_IMAGE_UPLOAD_SIZE}MB`}</p>
                </span>

                <div className="w-full flex-1 flex flex-row justify-end items-end space-x-2">
                    {
                        loader ? 
                        <Loader containerTailwind="w-1/4 h-5" /> :
                        <>
                            <button 
                                onClick={close}
                                className="transition-colors duration-200 text-light-grey text-sm px-1 font-lato border border-light-grey rounded hover:cursor-pointer hover:bg-light-grey hover:text-black"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUpload}
                                className="transition-colors duration-200 text-white text-sm px-1 font-lato border border-green rounded hover:cursor-pointer hover:bg-green"
                            >
                                Send
                            </button>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

function TypingListener({ chatId, uid, display, isGroup } : { chatId: string, uid: string, display: string, isGroup: boolean }) {
    const [typingStatusValueErrorCallback, setTypingStatusValueErrorCallback] = useDatabaseErrorHandler("TYPINGLISTENER_TYPINGSTATUS_CHANGE_ERROR")
    const [isTyping, setIsTyping] = useState<boolean>(false)

    const typingReference = useMemo(() => {
        return ref(rt, `${DB_USERS}/${uid}/typing`)
    }, [uid])

    const handleTypingStatusChange = useCallback(async (snapshot: DataSnapshot) => {
        if (snapshot.val() === null || snapshot.val() === undefined)
            return

        setIsTyping(snapshot.val() === chatId)
    }, [uid])

    const typingStatusListenerConfig: UseListenerConfig = useMemo(() => {
        return {
            value: {
                callback: handleTypingStatusChange,
                errorCallback: typingStatusValueErrorCallback
            }
        }
    }, [uid])

    useListener(typingReference, typingStatusListenerConfig)

    return (
        isTyping && 
        <p className="font-jbm max-h-[100%]">{`${display} is typing${isGroup ? "," : "..."}`}</p>
    )
}

function FooterButton({ isDisabled, Icon, onClick } : FooterButtonProps) {

    return (
        <button onClick={onClick} disabled={isDisabled} className="text-light-grey hover:text-green w-10 md:w-[30%] h-full hover:cursor-pointer">
            <Icon />
        </button>
    )
}

export default function ChatFooter({ current } : ChatFooterProps) {
    const { user } = useContext(AuthContext)
    const UIControl = useContext(InterfaceContext)

    if (!user || !current)
        return <></>

    const [message, setMessage] = useState<string>("")
    const [isTyping, setIsTyping] = useState<boolean>(false)
    const [uploaderIsOpen, toggleUploader] = useState<boolean>(false)
    const [spotifyEmbederIsOpen, toggleSpotifyEmbeder] = useState<boolean>(false)
    const [youtubeEmbederIsOpen, toggleYoutubeEmbeder] = useState<boolean>(false)

    const inputRef = useRef<HTMLInputElement>(null)

    const buttons: FooterButtonProps[] = [
        {
            isDisabled: false,
            Icon: Paperclip,
            onClick: (event: MouseEvent<HTMLButtonElement>) => {
                event.preventDefault()

                if (spotifyEmbederIsOpen || youtubeEmbederIsOpen)
                    return

                toggleUploader(true)
            }
        },
        {
            isDisabled: false,
            Icon: Music,
            onClick: (event: MouseEvent<HTMLButtonElement>) => {
                event.preventDefault()

                if (uploaderIsOpen || youtubeEmbederIsOpen)
                    return

                toggleSpotifyEmbeder(true)
            }
        },
        {
            isDisabled: false,
            Icon: MonitorPlay,
            onClick: (event: MouseEvent<HTMLButtonElement>) => {
                event.preventDefault()

                if (uploaderIsOpen || spotifyEmbederIsOpen)
                    return

                toggleYoutubeEmbeder(true)
            }
        }
    ]

    async function send(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!user || !current)
            return

        const trimmedMessage: string = message.trim()

        if (trimmedMessage.length === 0) {
            if (message !== "")
                setMessage("")
            return
        }

        const messageData = {
            sender: user.uid,
            type: MESSAGE_TYPE_CODE,
            content: trimmedMessage,
            timestamp: serverTimestamp()
        }

        try {
            await push(ref(rt, `${DB_MESSAGES}/${current.id}`), messageData)
        }
        catch {
            UIControl.setText("Failed To Send Message.")
            return
        }

        setMessage("")
    }

    useEffect(() => {
        if (!inputRef.current || !user || !current)
            return

        let timeoutId: NodeJS.Timeout | string | number | undefined

        const startTimeout: () => Promise<NodeJS.Timeout | string | number | undefined> = async () => {
            if (timeoutId)
                clearTimeout(timeoutId)

            return setTimeout(async () => {
                timeoutId = undefined
                // set typing status
                await set(ref(rt, `${DB_USERS}/${user.uid}/typing`), "")
                setIsTyping(false)
            }, CLEAR_TYPING_MS)
        }

        const stopTimeout = () => {
            if (timeoutId)
                clearTimeout(timeoutId)
        }

        const updateTyping = (is_typing: boolean) => {
            if (is_typing)
                return is_typing

            // set typing status
            set(ref(rt, `${DB_USERS}/${user.uid}/typing`), current.id)
            return true 
        }

        const onTyping = async () => {
            setIsTyping(updateTyping)
            timeoutId = await startTimeout()
        }

        inputRef.current.addEventListener("keypress", onTyping)

        return () => {
            stopTimeout()
            inputRef.current?.removeEventListener("keypress", onTyping)
            set(ref(rt, `${DB_USERS}/${user.uid}/typing`), "")
        }

    }, [inputRef.current])

    return (
        <>
            <footer className="w-full h-[15%] md:p-4 space-y-2 flex flex-col justify-end">
                <span className="w-full h-[10%] px-2 flex flex-row items-end text-green text-[0.75em]">
                    {
                        (current as GroupChatMetaData).isGroup ? 
                        (current as GroupChatMetaData).members.map((member) => {
                            return ( 
                                member.id !== user.uid &&
                                <TypingListener key={`MEMBER_TYPING_STATUS_${member.id}`} chatId={current.id} uid={member.id} display={member.name} isGroup={true} />
                            )
                        }) :
                        <TypingListener key={`MEMBER_TYPING_STATUS_${(current as DirectChatMetaData).to !== user.uid ? (current as DirectChatMetaData).to : current.creator}`} chatId={current.id} uid={(current as DirectChatMetaData).to !== user.uid ? (current as DirectChatMetaData).to : current.creator} display={(current as DirectChatMetaData).to !== user.uid ? current.name : ""} isGroup={false} />
                    }
                </span>
                <div className="w-full h-[90%] space-y-2 md:space-y-0 md:p-1 flex flex-col md:flex-row justify-evenly items-start md:items-center">
                    <div className="w-[12.5%] h-[20%] px-2 md:px-0 md:h-full flex flex-row justify-start space-x-1 md:py-2">
                        {
                            buttons.map((button, index) => {
                                return <FooterButton key={`FOOTER_ATTACH_BUTTON_${index}`} isDisabled={button.isDisabled} Icon={button.Icon} onClick={button.onClick} />
                            })
                        }
                    </div>
                    <form onSubmit={send} className="w-full px-2 md:w-[87.5%] h-[50%] md:h-full md:py-1 flex flex-row justify-evenly md:justify-between items-center">
                        <input ref={inputRef} value={message} onChange={e => setMessage(e.target.value)} disabled={current === undefined} placeholder="Send Message..." className="bg-dark-grey w-[90%] md:w-[93%] h-[80%] px-4 rounded-4xl outline-none font-jbm text-dark-white" />
                        <button type="submit" disabled={current === undefined} className="w-[6%] md:h-auto h-full md:aspect-square text-light-grey hover:text-green hover:cursor-pointer">
                            <SendIcon className="w-full h-full md:p-2" />
                        </button>
                    </form>
                </div>
            </footer>
            {
                uploaderIsOpen && 
                <AttachmentUploader 
                    chatId={current.id} 
                    close={ () => { toggleUploader(false) } } 
                />
            }
            {
                spotifyEmbederIsOpen && 
                <SpotifyEmbeder 
                    uid={user.uid}
                    chatId={current.id} 
                    close={ () => { toggleSpotifyEmbeder(false) } } 
                />
            }
            {
                youtubeEmbederIsOpen && 
                <YoutubeEmbeder 
                    uid={user.uid}
                    chatId={current.id}
                    close={() => { toggleYoutubeEmbeder(false) }}
                />
            }
        </>
    )
}
