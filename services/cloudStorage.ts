import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs/promises'
import path from 'path'
import multer from 'multer'
import moment from 'moment'

const tmpDirPath = path.join(__dirname, '../tmp')

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        await createTmpDir()
        cb(null, tmpDirPath)
    },
    filename: function (req, file, cb) {
        const time = moment().format('DD-MMM-YYYY_hh.mma_')
        const name = file.originalname.replace(/ /g, '_')
        cb(null, (time + name))
    }
})

export const saveFile = multer({ storage })

export async function uploadFile(
    filePath: string, fileName: string, folderName: string
) {
    cloudinary.config({
        cloud_name: process.env.STORAGE_NAME,
        api_key: process.env.STORAGE_KEY,
        api_secret: process.env.STORAGE_SECRET,
    })

    const splitted = fileName.split('.')
    splitted.pop()
    const public_id = splitted.join('.')

    const data = await cloudinary.uploader.upload(
        filePath, { public_id, folder: folderName }
    )

    await fs.unlink(filePath)
    return data.secure_url
}

async function createTmpDir() {
    const exist = await fs.access(tmpDirPath)
        .then(() => true).catch(() => false)

    if (!exist)
        await fs.mkdir(tmpDirPath)
}