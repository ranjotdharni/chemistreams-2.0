import { Geist, Geist_Mono, JetBrains_Mono, Montserrat } from "next/font/google"
import { InterfaceProvider } from "@/components/provider/InterfaceProvider"
import { filterStandardClaims } from "next-firebase-auth-edge/auth/claims"
import { AuthProvider } from "@/components/provider/AuthProvider"
import { clientConfig, serverConfig } from "@/lib/auth/config"
import { getTokens, Tokens } from "next-firebase-auth-edge"
import { User } from "@/lib/types/server"
import { cookies } from "next/headers"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jbm",
  subsets: ["latin"],
})

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
})

function tokensToUser({ decodedToken } : Tokens): User {
  const {
    uid,
    email,
    picture: photoURL,
    email_verified: emailVerified,
    phone_number: phoneNumber,
    name: displayName,
    source_sign_in_provider: signInProvider,
  } = decodedToken

  const customClaims = filterStandardClaims(decodedToken)
 
  return {
    uid,
    email: email ?? null,
    displayName: displayName ?? null,
    photoURL: photoURL ?? null,
    phoneNumber: phoneNumber ?? null,
    emailVerified: emailVerified ?? false,
    providerId: signInProvider,
    customClaims,
  }
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tokens = await getTokens(await cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys, // potential point of error, check here if app doesn't work, may be fine though
    serviceAccount: serverConfig.serviceAccount
  })

  const user = tokens ? tokensToUser(tokens) : null
  
  async function setText(text: string) {
    "use server"
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased w-screen h-screen flex flex-col justify-center items-center`}
      >
        <InterfaceProvider setText={setText}>
          <AuthProvider user={user}>
            { children }
          </AuthProvider>
        </InterfaceProvider>
      </body>
    </html>
  )
}
