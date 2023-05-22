import { Request, Response } from 'express'
import { sendMail } from '../services/mail'
import crypto from 'crypto'
import { loginSchema, verifyCodeSchema, verifyEmailSchema } from '../schemas/auth'
import { VerificationMailTemplate } from '../utils/constants'
import db from '../prisma/db'
import { handleError } from '../services/errorHandlers'
import jwt from 'jsonwebtoken'
import { User } from '@prisma/client'

type UserResult = Partial<User> | null

export async function verifyEmail(req: Request, res: Response) {
    try {
        const body = verifyEmailSchema.validateSync(req.body)
        const { email } = body

        const existingUser = await db.user.findFirst({
            where: { email }
        })

        if (existingUser)
            throw Error('User exist with this email')

        const verification_code = crypto.randomInt(Math.pow(10, 5), Math.pow(10, 6))

        const entry = await db.emailAddress.findFirst({ where: { email } })
        if (entry)
            await db.emailAddress.update({
                where: { email },
                data: { verification_code }
            })
        else
            await db.emailAddress.create({
                data: { email, verification_code }
            })

        const { html, text } = VerificationMailTemplate(verification_code)
        await sendMail({
            to: email,
            subject: 'Email Verification Code',
            text, html,
            from: process.env.EMAIL_USER ?? ''
        })
        return res.json({ msg: 'Verification mail sent' })
    }
    catch (err) { handleError(res, err) }
}

export async function verifyCode(req: Request, res: Response) {
    try {
        const body = verifyCodeSchema.validateSync(req.body)

        const { email, code } = body
        const entry = await db.emailAddress.findFirst({ where: { email } })

        const verified = Boolean(entry && entry.verification_code === code)
        if (verified)
            await db.emailAddress.update({
                where: { email },
                data: { isVerified: true }
            })

        return res.json({ verified })
    }
    catch (err) { handleError(res, err) }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = loginSchema.validateSync(req.body)

        const user: UserResult = await db.user.findFirst({
            where: { email }
        })

        if (!user)
            throw Error('User not exist')

        const hash = crypto.createHmac('sha256',
            process.env.HASH_SECRET ?? "secret")
            .update(password).digest('base64')

        if (hash != user.password)
            throw Error('Incorrect Password !')

        delete user.password

        const accessToken = jwt.sign(
            { id: user.id, email },
            process.env.HASH_SECRET ?? 'secret'
        )

        return res.json({ accessToken, user })
    }
    catch (err) { handleError(res, err) }
}