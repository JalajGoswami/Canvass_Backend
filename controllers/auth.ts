import { Request, Response } from 'express'
import db from '../prisma/db'
import Mailer, { TransportOptions } from 'nodemailer'
import { google } from 'googleapis'

export async function verifyEmail(req: Request, res: Response) {
    const { email } = req.body
    try {
        const oAuth2Client = new google.auth.OAuth2(
            process.env.GMAIL_CLIENT_ID,
            process.env.GMAIL_CLIENT_SECRET,
            process.env.GMAIL_REDIRECT_URI
        )
        oAuth2Client.setCredentials({
            refresh_token: process.env.GMAIL_REFRESH_TOKEN
        })
        const accessToken = await oAuth2Client.getAccessToken()

        const mailer = Mailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_USER,
                clientId: process.env.GMAIL_CLIENT_ID,
                clientSecret: process.env.GMAIL_CLIENT_SECRET,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN,
                accessToken
            }
        } as TransportOptions)

        await mailer.sendMail({
            from: `Canvass <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Email Verification Code',
            text: 'Hello there your verification code is 123',
            html: '<h3>Hello there your verification code is 123</h3>'
        })
    }
    catch (err) {
        console.error('Error in sending email')
        console.error(err)
    }
    return res.json({})
}
