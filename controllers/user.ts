import { Request, Response } from 'express'
import db from '../prisma/db'
import { createPrefrenceSchema, createProfileSchema, updateProfileSchema } from '../schemas/user'
import { getError } from '../services/errorHandlers'
import { deleteFile, uploadFile } from '../services/cloudStorage'
import crypto from 'crypto'
import { User } from '@prisma/client'
import ExtendedRequest from '../types/ExtendedRequest'

type UserResult = Partial<User> | null

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
                req.file.path, req.file.filename, 'profile_pics'
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

        const data: UserResult = await db.user.create({
            data: { ...fields, profile_pic }
        })

        delete data.password

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

export async function updateProfile(req: ExtendedRequest, res: Response) {
    try {
        const { id } = req.session as User

        if (!id) throw Error('Provide valid id')

        const body = updateProfileSchema.validateSync(req.body)

        let profile_pic: string | undefined = undefined
        if (req.file) {
            const old_pic = await db.user.findFirst({
                where: { id },
                select: { profile_pic: true }
            })
            // deleting old one
            if (old_pic?.profile_pic)
                await deleteFile(old_pic.profile_pic)

            // uploading new one
            profile_pic = await uploadFile(
                req.file.path, req.file.filename, 'profile_pics'
            )
        }

        const data: UserResult = await db.user.update({
            where: { id },
            data: { ...body, profile_pic }
        })

        delete data.password

        return res.json(data)
    }
    catch (err) {
        const error = getError(err)
        return res.status(400).json({ error })
    }
}

export async function getProfile(req: ExtendedRequest, res: Response) {
    const user = req.session as User
    return res.json(user)
}

export async function createPrefrence(req: Request, res: Response) {
    try {
        const { userId, categories } = createPrefrenceSchema.validateSync(req.body)
        const categoryIds = categories.filter(Boolean)
            .map(id => ({ id: id as number }))

        const data = await db.userPrefrence.create({
            data: {
                userId,
                categories: { connect: categoryIds }
            }
        })

        return res.json(data)
    }
    catch (err) {
        const error = getError(err)
        return res.status(400).json({ error })
    }
}