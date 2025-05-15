import { NextRequest, NextResponse } from "next/server"
import { upload001 } from "@/lib/drive/workers"

export async function GET(request: NextRequest) {
    if (request.method !== 'GET') 
        return NextResponse.json({ error: 'METHOD NOT ALLOWED' }, { status: 405 })
    
    console.log("hit")
    await upload001()
    console.log("clear")

    return NextResponse.json({ success: true }, { status: 200 })
}
