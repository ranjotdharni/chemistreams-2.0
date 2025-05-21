import { generateCloudUrl, isValidFile } from "@/lib/utils/general"
import { MAXIMUM_IMAGE_UPLOAD_SIZE } from "@/lib/constants/server"
import { extractTokenFromRequest } from "@/lib/utils/server"
import { DriveItem, DriveSpaceId } from "@/lib/types/server"
import { NextRequest, NextResponse } from "next/server"
import { DecodedIdToken } from "firebase-admin/auth"
import { DB_USERS } from "@/lib/constants/routes"
import { GenericError } from "@/lib/types/client"
import { get, ref } from "firebase/database"
import { upload } from "@/lib/drive/workers"
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
    
    const data = await request.formData()
    const file = data.get("file")

    // no pfp uploaded, bad request
    if (!file)
        return NextResponse.json({ code: 'BAD_REQUEST', message: "MALFORMED REQUEST" } as GenericError, { status: 400 })

    // ensure uploaded file is a valid image
    const invalidFile: GenericError | void = isValidFile(file as File, MAXIMUM_IMAGE_UPLOAD_SIZE)

    if (invalidFile)
        return NextResponse.json(invalidFile, { status: 400 })

    // call server action to upload
    const result = await upload(file as File)

    if ((result as GenericError).code) 
        return NextResponse.json(result as GenericError, { status: 500 })

    const cloudUrl: string = generateCloudUrl((result as DriveItem).id)

    return NextResponse.json({ success: true, space: profile.pfp.space as DriveSpaceId, link: cloudUrl, fileId: (result as DriveItem).id, uid: uid }, { status: 200 })
}
