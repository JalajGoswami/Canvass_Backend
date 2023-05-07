import { Request, Response } from 'express'
import { sendMail } from '../services/mail'
import crypto from 'crypto'
import { verifyEmailSchema } from '../schemas/auth'
import { VerificationMailTemplate } from '../utils/constants'
import db from '../prisma/db'

export async function verifyEmail(req: Request, res: Response) {
    try {
        verifyEmailSchema.validateSync(req.body)

        const { email } = req.body
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
        let error = err as any
        error = error?.message ?? error?.name ?? error
        return res.status(400).json({ error })
    }
}
