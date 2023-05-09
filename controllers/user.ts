import { Request, Response } from 'express'
import db from '../prisma/db'
import { createProfileSchema } from '../schemas/user'
import { getError } from '../services/errorHandlers'
import { uploadFile } from '../services/cloudStorage'

export async function createProfile(req: Request, res: Response) {
    try {
        const body = createProfileSchema.validateSync(req.body)
        const { confirm_password: _, ...fields } = body

        let profile_pic: string | undefined = undefined
        if (req.file) {
            profile_pic = await uploadFile(req.file.path, req.file.filename, 'images')
        }

        const emailAddr = await db.emailAddress.findFirst({
            where: { email: body.email }
        })

        if (!emailAddr?.isVerified)
            return res.status(400)
                .json({ error: 'Email not verified' })

        const existingUser = await db.user.findFirst({
            where: { email: body.email }
        })

        if (existingUser)
            return res.status(400)
                .json({ error: 'User exist with this email' })

        const data = await db.user.create({
            data: { ...fields, profile_pic }
        })

        return res.json(data)
    }
    catch (err) {
        const error = getError(err)
        return res.status(400).json({ error })
    }
}

export async function checkUserName(req: Request, res: Response) {
    const { user_name } = req.query

    if (!user_name)
        return res.status(400)
            .json({ error: 'user_name required' })

    const existingUser = await db.user.findFirst({
        where: { user_name: user_name as string }
    })

    return res.json({ exist: Boolean(existingUser) })
}
