import { loggedInUser } from "@/lib/auth/firebase"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
    if (request.method !== 'PUT') 
        return NextResponse.json({ error: 'METHOD NOT ALLOWED' }, { status: 405 })
    
    console.log(loggedInUser ? loggedInUser.email : "null user")

    return NextResponse.json({ success: true }, { status: 200 })
}
