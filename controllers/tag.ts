import { Request, Response } from 'express'
import db from '../prisma/db'
import { createUpdateTags } from '../services/tagHelpers'
import { getError } from '../services/errorHandlers'

export async function getCategories(req: Request, res: Response) {
    const data = await db.category.findMany()
    return res.json(data)
}

export async function updateTags(req: Request, res: Response) {
    const body: { tags: string[]; category: number } = req.body
    try {
        await createUpdateTags(body.tags, body.category)
        return res.json({ msg: 'Sucess' })
    }
    catch (err) {
        const error = getError(err)
        res.status(400).json({ error })
    }
}

export async function searchTags(req: Request, res: Response) {
    try {
        type QueryFilters = { keyword?: string; limit?: string }
        const { keyword, limit } = req.query as QueryFilters

        if (!keyword) throw Error('Search keyword required')

        const tags = await db.tag.findMany({
            select: { id: true, name: true },
            where: { name: { contains: keyword } },
            orderBy: { appearance: 'desc' },
            take: Number(limit) || 15
        })

        return res.json(tags)
    }
    catch (err) {
        const error = getError(err)
        res.status(400).json({ error })
    }
}