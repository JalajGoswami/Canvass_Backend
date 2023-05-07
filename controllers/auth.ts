import { Request, Response } from 'express'
import { sendMail } from '../services/mail'

export async function verifyEmail(req: Request, res: Response) {
    const { email } = req.body
    try {
        await sendMail({
            to: email,
            subject: 'Email Verification Code',
            text: 'Hello there your verification code is 123',
            html: '<h3>Hello there your verification code is 123</h3>',
        })
    }
    catch (err) {
        console.error('Error in sending email')
        console.error(err)
    }
    return res.json({})
}
