import { Request, Response } from 'express'
import db from '../prisma/db'

export async function getCategories(req: Request, res: Response) {
    const data = await db.category.findMany()
    return res.json(data)
}