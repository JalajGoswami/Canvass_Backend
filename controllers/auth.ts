import { Request, Response } from 'express'
import { sendMail } from '../services/mail'
import crypto from 'crypto'
import { verifyCodeSchema, verifyEmailSchema } from '../schemas/auth'
import { VerificationMailTemplate } from '../utils/constants'
import db from '../prisma/db'
import { getError } from '../services/errorHandlers'

export async function verifyEmail(req: Request, res: Response) {
    try {
        const body = verifyEmailSchema.validateSync(req.body)

        const { email } = body
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
            text, html
        })
        return res.json({ msg: 'Verification mail sent' })
    }
    catch (err) {
        const error = getError(err)
        return res.status(400).json({ error })
    }
}

export async function verifyCode(req: Request, res: Response) {
    try {
        const body = verifyCodeSchema.validateSync(req.body)

        const { email, code } = body
        const entry = await db.emailAddress.findFirst({ where: { email } })

        return res.json({
            verified: Boolean(entry && entry.verification_code === code)
        })
    }
    catch (err) {
        const error = getError(err)
        return res.status(400).json({ error })
    }
}