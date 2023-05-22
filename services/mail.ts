import Mailer, { MailDataRequired } from '@sendgrid/mail'

Mailer.setApiKey(process.env.EMAIL_API_KEY ?? '')

export async function sendMail(options: MailDataRequired) {
    await Mailer.send(options)
}