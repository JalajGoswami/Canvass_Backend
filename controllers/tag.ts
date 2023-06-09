import { Request, Response } from 'express'
import db from '../prisma/db'
import { createUpdateTags, removeDuplicateTag } from '../services/tagHelpers'
import { handleError } from '../services/errorHandlers'
import ExtendedRequest from '../types/ExtendedRequest'
import { User, Tag } from '@prisma/client'

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
    catch (err) { handleError(res, err) }
}

export async function searchTags(req: Request, res: Response) {
    try {
        type QueryFilters = { keyword?: string; limit?: string }
        const { keyword, limit } = req.query as QueryFilters

        if (!keyword) throw Error('Search keyword required')

        const tags = await db.tag.findMany({
            select: { id: true, name: true },
            where: { name: { contains: keyword, mode: 'insensitive' } },
            orderBy: { appearance: 'desc' },
            take: Number(limit) || 15
        })

        return res.json(tags)
    }
    catch (err) { handleError(res, err) }
}

export async function trendingTags(req: ExtendedRequest, res: Response) {
    try {
        let tagByPrefrence: Partial<Tag>[] = [],
            tagByQuery: Partial<Tag>[] = [],
            globallyTrending: Partial<Tag>[] = []

        if (req.query.category) {
            tagByQuery = await db.tag.findMany({
                where: {
                    categories: {
                        some: { id: Number(req.query.category) }
                    }
                },
                orderBy: { appearance: 'desc' },
                take: 15,
                select: { id: true, name: true }
            })
        }

        const user = req.session as User

        const prefrence = await db.userPrefrence.findFirst({
            where: { user },
            include: {
                categories: { select: { id: true } }
            }
        })
        const categories = prefrence?.categories.map(c => c.id)

        if (prefrence && tagByQuery.length < 15)
            tagByPrefrence = await db.tag.findMany({
                where: {
                    categories: {
                        some: { id: { in: categories } }
                    }
                },
                orderBy: { appearance: 'desc' },
                take: 10,
                select: { id: true, name: true }
            })

        let combinedTags = tagByQuery.concat(tagByPrefrence)
        combinedTags = removeDuplicateTag(combinedTags)

        if (combinedTags.length < 15)
            globallyTrending = await db.tag.findMany({
                orderBy: { appearance: 'desc' },
                take: 15,
                select: { id: true, name: true }
            })

        combinedTags.concat(globallyTrending)
        const tags = removeDuplicateTag(combinedTags)

        return res.json(tags)
    }
    catch (err) { handleError(res, err) }
}