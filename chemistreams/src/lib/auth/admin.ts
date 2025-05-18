"use server"

import { initializeApp, cert, getApps, getApp } from "firebase-admin/app"
import { clientConfig, serverConfig } from "./config"
import { getAuth } from "firebase-admin/auth"

const app = getApps().length === 0 ?
    initializeApp({
        credential: cert({
            projectId: clientConfig.projectId,
            clientEmail: serverConfig.serviceAccount.clientEmail,
            privateKey: serverConfig.serviceAccount.privateKey
        })
    }) :
    getApp()

const admin = getAuth(app)

export { admin }
