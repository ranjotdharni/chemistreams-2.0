import { ICON_NOT_FOUND } from "@/lib/constants/client"
import { PAGE_HOME, PAGE_LOGIN } from "@/lib/constants/routes"

export default function NotFound() {
    const linkStyle: string = "py-1 px-4 text-amber-50 bg-black rounded hover:cursor-pointer hover:text-blue-500"

    return (
        <main className="w-full h-full flex flex-col justify-center items-center font-jbm space-y-4">
            <img src={ICON_NOT_FOUND} alt="Not Found Icon" />
            <h1 className="text-xl text-amber-50">Not sure what you're looking for...</h1>
            <div className="space-x-4">
                <a href={PAGE_HOME} className={linkStyle}>Home</a>
                <a href={PAGE_LOGIN} className={linkStyle}>Login</a>
            </div>
        </main>
    )
}
