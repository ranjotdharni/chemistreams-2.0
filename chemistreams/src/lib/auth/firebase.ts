import { getAuth, onAuthStateChanged, User } from "firebase/auth"
import { initializeApp, getApp, getApps } from "firebase/app"
import { getDatabase } from "firebase/database"
import { clientConfig } from "./config"

const app = getApps.length === 0 ? initializeApp(clientConfig) : getApp()

const auth = getAuth(app)

const rt = getDatabase(app)

let loggedInUser: User | null = auth.currentUser

onAuthStateChanged(auth, (user) => {
    if (user)
        loggedInUser = user
})

export { app, auth, rt, loggedInUser }