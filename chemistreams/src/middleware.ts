import { API_LOGIN, API_LOGOUT, API_REFRESH_TOKEN, PAGE_HOME, PAGE_LANDING, PAGE_LOGIN, PUBLIC_ROUTES } from "./lib/constants/routes"
import { authMiddleware, redirectToHome, redirectToLogin } from "next-firebase-auth-edge"
import { clientConfig, serverConfig } from "./lib/auth/config"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {

    const routeChecks: boolean[] = [
      request.nextUrl.pathname.startsWith("/_next/static"),
      request.nextUrl.pathname.endsWith("/favicon.ico")
    ]

    for (let match of routeChecks) {
      if (match)
        return NextResponse.next()
    }

    return authMiddleware(request, {
      loginPath: API_LOGIN,
      logoutPath: API_LOGOUT,
      refreshTokenPath: API_REFRESH_TOKEN,
      apiKey: clientConfig.apiKey,
      cookieName: serverConfig.cookieName,
      cookieSignatureKeys: serverConfig.cookieSignatureKeys,
      cookieSerializeOptions: serverConfig.cookieSerializeOptions,
      serviceAccount: serverConfig.serviceAccount,
      handleValidToken: async ({ token, decodedToken, customToken }, headers) => {
        // Authenticated user should not be able to access /login, /register and /reset-password routes
        if (PUBLIC_ROUTES.includes(request.nextUrl.pathname)) {
          return redirectToHome(request, {
            path: PAGE_HOME
          })
        }

        return NextResponse.next({
          request: {
            headers
          }
        })
      },
      handleInvalidToken: async (reason) => {
        console.info('Missing or malformed credentials.', { reason })

        return redirectToLogin(request, {
          path: PAGE_LOGIN,
          publicPaths: PUBLIC_ROUTES
        });
      },
      handleError: async (error) => {
        console.error('Unhandled authentication error.', { error })
        
        return redirectToLogin(request, {
          path: PAGE_LOGIN,
          publicPaths: PUBLIC_ROUTES
        })
      }
    })
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    PAGE_LANDING,
    API_LOGIN,
    API_LOGOUT,
    API_REFRESH_TOKEN,
  ],
}