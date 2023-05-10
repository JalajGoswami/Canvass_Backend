import { Request, Response } from 'express'
import db from '../prisma/db'
import { createProfileSchema, updateProfileSchema } from '../schemas/user'
import { getError } from '../services/errorHandlers'
import { deleteFile, uploadFile } from '../services/cloudStorage'
import crypto from 'crypto'

export async function createProfile(req: Request, res: Response) {
    try {
        const body = createProfileSchema.validateSync(req.body)
        const { confirm_password: _, ...fields } = body

        // hashing password
        fields.password = crypto.createHmac('sha256',
            process.env.HASH_SECRET ?? "secret")
            .update(fields.password).digest('base64')

        let profile_pic: string | undefined = undefined
        if (req.file) {
            profile_pic = await uploadFile(
                req.file.path, req.file.filename, 'images'
            )
        }

        const emailAddr = await db.emailAddress.findFirst({
            where: { email: body.email }
        })

        if (!emailAddr?.isVerified)
            throw Error('Email not verified')

        const existingUser = await db.user.findFirst({
            where: { email: body.email }
        })

        if (existingUser)
            throw Error('User exist with this email')

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

export async function updateProfile(req: Request, res: Response) {
    const { id } = req.params
    try {

        if (!id || isNaN(Number(id)))
            throw Error('Provide valid id')

        const body = updateProfileSchema.validateSync(req.body)

        let profile_pic: string | undefined = undefined
        if (req.file) {
            const old_pic = await db.user.findFirst({
                where: { id: Number(id) },
                select: { profile_pic: true }
            })
            // deleting old one
            if (old_pic?.profile_pic)
                await deleteFile(old_pic.profile_pic)

            // uploading new one
            profile_pic = await uploadFile(
                req.file.path, req.file.filename, 'images'
            )
        }

        const data = await db.user.update({
            where: { id: Number(id) },
            data: { ...body, profile_pic }
        })

        return res.json(data)
    }
    catch (err) {
        const error = getError(err)
        return res.status(400).json({ error })
    }
}