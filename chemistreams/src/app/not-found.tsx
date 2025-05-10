import { PAGE_LOGIN } from "@/lib/constants/routes"

export default function NotFound() {
    return (
        <main className="w-full h-full">
            <h1>Page Not Found or Fatal Authentication Failure</h1>
            <p>Try logging in again or creating a new account if needed.</p>
            <a href={PAGE_LOGIN}>Login</a>
        </main>
    )
}
