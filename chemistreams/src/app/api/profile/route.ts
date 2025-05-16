import { loggedInUser } from "@/lib/auth/firebase"
import { upload } from "@/lib/drive/workers"
import { GenericError } from "@/lib/types/client"
import { isValidImageFile } from "@/lib/utils/general"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
    if (request.method !== 'PUT') 
        return NextResponse.json({ code: 'METHOD_NOT_ALLOWED', message: "METHOD NOT ALLOWED" } as GenericError, { status: 405 })
    
    const data = await request.formData()
    const file = data.get("file")

    if (!file)
        return NextResponse.json({ code: 'BAD_REQUEST', message: "MALFORMED REQUEST" } as GenericError, { status: 400 })

    const invalidFile: GenericError | void = isValidImageFile(file as File)

    if (invalidFile)
        return NextResponse.json(invalidFile, { status: 400 })

    await upload(file as File)

    return NextResponse.json({ success: true }, { status: 200 })
}
