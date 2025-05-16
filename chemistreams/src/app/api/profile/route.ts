import { loggedInUser, rt } from "@/lib/auth/firebase"
import { CUSTOM_ERROR } from "@/lib/constants/client"
import { DB_USERS } from "@/lib/constants/routes"
import { remove, upload } from "@/lib/drive/workers"
import { GenericError } from "@/lib/types/client"
import { DriveItem, DriveSpaceId } from "@/lib/types/server"
import { generateCloudUrl, isValidImageFile } from "@/lib/utils/general"
import { get, ref, set } from "firebase/database"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
    if (request.method !== 'PUT') 
        return NextResponse.json({ code: 'METHOD_NOT_ALLOWED', message: "METHOD NOT ALLOWED" } as GenericError, { status: 405 })

    if (!loggedInUser)
        return NextResponse.json({ code: CUSTOM_ERROR, message: "User profile not found." } as GenericError, { status: 405 })

    const userRef = ref(rt, `${DB_USERS}/${loggedInUser.uid}`)

    const existingProfile = await get(userRef)

    const profile = existingProfile.val()
    const hasStoredPfp: boolean = (profile.pfp.space ? true : false)
    
    const data = await request.formData()
    const file = data.get("file")

    if (!file)
        return NextResponse.json({ code: 'BAD_REQUEST', message: "MALFORMED REQUEST" } as GenericError, { status: 400 })

    const invalidFile: GenericError | void = isValidImageFile(file as File)

    if (invalidFile)
        return NextResponse.json(invalidFile, { status: 400 })

    const result = await upload(file as File)

    if ((result as GenericError).code) 
        return NextResponse.json(result as GenericError, { status: 500 })

    const cloudUrl: string = generateCloudUrl((result as DriveItem).id)
    
    await set(ref(rt, `${DB_USERS}/${loggedInUser.uid}/pfp`), {
        ...(result as DriveItem),
        link: cloudUrl
    })

    if (hasStoredPfp) {
        await remove(profile.pfp.space as DriveSpaceId, profile.pfp.id)
    }

    return NextResponse.json({ success: true, link: cloudUrl }, { status: 200 })
}
