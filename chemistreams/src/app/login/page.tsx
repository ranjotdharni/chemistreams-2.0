import LoginPage from "@/components/login/LoginPage"
import { loginAction } from "@/lib/utils/server"

export default function Page() {
    return <LoginPage loginAction={loginAction} />
}
