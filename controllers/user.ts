import { Request, Response } from 'express'
import db from '../prisma/db'

export async function getProfile(req: Request, res: Response) {

    const user_name = req.query.user_name as string
    const user = await db.user.findFirst({ where: { user_name } })
    return res.json(user)

}
