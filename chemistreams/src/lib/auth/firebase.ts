import { initializeApp, getApp, getApps } from "firebase/app"
import { clientConfig } from "./config"
import { getAuth } from "firebase/auth"

const app = getApps.length === 0 ? initializeApp(clientConfig) : getApp()

const auth = getAuth(app)

export { app, auth }