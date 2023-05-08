import { Request, Response } from 'express'
import db from '../prisma/db'
import { createProfileSchema } from '../schemas/user'
import { getError } from '../services/errorHandlers'

export async function createProfile(req: Request, res: Response) {
    try {
        const body = createProfileSchema.validateSync(req.body)
        const emailAddr = await db.emailAddress.findFirst({
            where: { email: body.email }
        })

        if (!emailAddr?.isVerified)
            return res.status(400)
                .json({ error: 'Email not verified' })

        const data = await db.user.create({ data: body })
        
        return res.json(data)
    }
    catch (err) {
        const error = getError(err)
        return res.status(400).json({ error })
    }
}
