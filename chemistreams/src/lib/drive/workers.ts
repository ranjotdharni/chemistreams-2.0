import { google } from "googleapis"

const service001 = new google.auth.GoogleAuth({
    keyFile: `${process.cwd()}/drive/001/space001.json`,
    scopes: ["https://www.googleapis.com/auth/drive"]
})

export const upload001 = async () => {
    const drive = google.drive({ version: "v3", auth: service001 })

    try {
        const res = await drive.files.list()

        console.log("Folders:", res.data.files)
    }
    catch (error) {
        throw error
    }
}
