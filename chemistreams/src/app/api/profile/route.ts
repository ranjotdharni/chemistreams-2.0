import { generateCloudUrl, isValidImageFile } from "@/lib/utils/general"
import { extractTokenFromRequest } from "@/lib/utils/server"
import { DriveItem, DriveSpaceId } from "@/lib/types/server"
import { NextRequest, NextResponse } from "next/server"
import { remove, upload } from "@/lib/drive/workers"
import { DecodedIdToken } from "firebase-admin/auth"
import { DB_USERS } from "@/lib/constants/routes"
import { GenericError } from "@/lib/types/client"
import { get, ref, set } from "firebase/database"
import { rt } from "@/lib/auth/firebase"

export async function PUT(request: NextRequest) {
    // verify PUT request
    if (request.method !== 'PUT') 
        return NextResponse.json({ code: 'METHOD_NOT_ALLOWED', message: "METHOD NOT ALLOWED" } as GenericError, { status: 405 })

    // use custom server action for extracting user details from request cookies (which are httpOnly (and secure if set in .env))
    const decodedToken = await extractTokenFromRequest(request)

    // couldn't verify token, auth failure
    if ((decodedToken as GenericError).code)
        return NextResponse.json({ code: 'UNAUTHORIZED', message: "UNAUTHORIZED" } as GenericError, { status: 401 })

    const uid = (decodedToken as DecodedIdToken).uid

    // get realtime user details
    const userRef = ref(rt, `${DB_USERS}/${uid}`)

    const existingProfile = await get(userRef)

    const profile = existingProfile.val()
    const hasStoredPfp: boolean = (profile.pfp.space ? true : false)    // check if profile already has an existing pfp that needs to be deleted
    
    // get the new to-be uploaded pfp
    const data = await request.formData()
    const file = data.get("file")

    // no pfp uploaded, bad request
    if (!file)
        return NextResponse.json({ code: 'BAD_REQUEST', message: "MALFORMED REQUEST" } as GenericError, { status: 400 })

    // ensure uploaded file is a valid image
    const invalidFile: GenericError | void = isValidImageFile(file as File)

    if (invalidFile)
        return NextResponse.json(invalidFile, { status: 400 })

    // call server action to upload new pfp
    const result = await upload(file as File)

    if ((result as GenericError).code) 
        return NextResponse.json(result as GenericError, { status: 500 })

    const cloudUrl: string = generateCloudUrl((result as DriveItem).id)
    
    // update profile in realtime
    await set(ref(rt, `${DB_USERS}/${uid}/pfp`), {
        ...(result as DriveItem),
        link: cloudUrl
    })

    // if profile had existing pfp before this request, delete it from cloud storage cluster
    if (hasStoredPfp) {
        await remove(profile.pfp.space as DriveSpaceId, profile.pfp.id)
    }

    return NextResponse.json({ success: true, space: profile.pfp.space, link: cloudUrl }, { status: 200 })
}
