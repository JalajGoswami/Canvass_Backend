import { Response } from 'express'
import db from '../prisma/db'
import { handleError } from '../services/errorHandlers'
import { createPostSchema } from '../schemas/post'
import ExtendedRequest from '../types/ExtendedRequest'
import { Post, User } from '@prisma/client'
import { uploadFile } from '../services/cloudStorage'
import moment from 'moment'

export async function createPost(req: ExtendedRequest, res: Response) {
    try {
        const body = createPostSchema.validateSync(req.body)
        const tags = body.tags.split(',').filter(Boolean)
            .map(name => ({ name }))

        let image: string | undefined = undefined
        let aspect_ratio: number | undefined = undefined
        if (req.file) {
            image = await uploadFile(
                req.file.path, req.file.filename, 'posts'
            )
            aspect_ratio = Number(req.body.aspect_ratio)
        }

        const data = await db.post.create({
            data: {
                ...body, image, aspect_ratio,
                tags: { connect: tags },
                authorId: (req.session as User).id
            },
            include: {
                _count: {
                    select: { likedBy: true, dislikedBy: true }
                }
            }
        })

        return res.json(data)
    }
    catch (err) { handleError(res, err) }
}

export async function getPost(req: ExtendedRequest, res: Response) {
    try {
        const { id } = req.params

        if (!id || isNaN(Number(id)))
            throw Error('Not a valid Id')

        const post = await db.post.findFirst({
            where: { id: Number(id) },
            include: {
                _count: {
                    select: { likedBy: true, dislikedBy: true }
                }
            }
        })

        if (!post)
            throw Error('Not found')

        res.json(post)
    }
    catch (err) { handleError(res, err) }
}

export async function feedPosts(req: ExtendedRequest, res: Response) {
    let { page } = req.query
    page = isNaN(Number(page)) ? '1' : page
    const user = req.session as User
    type PostResult = (Post & {
        _count: {
            likedBy: number;
            dislikedBy: number;
        };
    })[]

    const following = await db.follow.findMany({
        where: { userId: user.id },
        select: { followedUser: true }
    })
    const allowedAuthors = following.map(f => f.followedUser)
        .concat(user.id)

    const prefrences = await db.userPrefrence.findMany({
        where: { user }, select: {
            categories: {
                select: {
                    id: true, tags: { select: { id: true } }
                }
            }
        }
    })
    const allowedPrefrences = prefrences.map(p => p.categories)
        .flat().map(p => p.id)

    const allowedTags = prefrences.map(p => p.categories)
        .flat().map(p => p.tags).flat().map(t => t.id)

    const allPosts = await db.post.findMany({
        where: {
            OR: [
                { authorId: { in: allowedAuthors } },
                { categoryId: { in: allowedPrefrences } },
                { tags: { some: { id: { in: allowedTags } } } }
            ],
            created_at: {
                gte: moment().subtract(1, 'month').toISOString()
            }
        },
        select: { id: true }
    })
    const count = allPosts
        .filter((post, indx) =>
            allPosts.findIndex(p => p.id === post.id) === indx
        ).length

    const primaryPostCount = await db.post.count({
        where: { authorId: { in: allowedAuthors } }
    })

    const pages = {
        current: Number(page),
        total: Math.ceil(count / 10)
    }
    if (pages.current > pages.total)
        return res.json({ pages, data: [] })

    let primaryPosts: PostResult = []
    const primaryDiff = primaryPostCount - (pages.current - 1) * 10
    if (primaryDiff > 0)
        primaryPosts = await db.post.findMany({
            where: {
                authorId: { in: allowedAuthors },
                created_at: {
                    gte: moment().subtract(1, 'month').toISOString()
                }
            },
            include: {
                _count: {
                    select: { likedBy: true, dislikedBy: true }
                }
            },
            orderBy: { created_at: 'desc' },
            skip: (pages.current - 1) * 10,
            take: primaryDiff > 10 ? 10 : primaryDiff
        })

    let secondaryPosts: PostResult = []
    if (primaryDiff < 10)
        secondaryPosts = await db.post.findMany({
            where: {
                OR: [
                    { categoryId: { in: allowedPrefrences } },
                    { tags: { some: { id: { in: allowedTags } } } }
                ],
                authorId: { notIn: allowedAuthors },
                created_at: {
                    gte: moment().subtract(1, 'month').toISOString()
                }
            },
            distinct: ['id'],
            include: {
                _count: {
                    select: { likedBy: true, dislikedBy: true }
                }
            },
            orderBy: { likedBy: { _count: 'desc' } },
            skip: primaryDiff <= 0 ? ((pages.current - 1) * 10)
                : (((pages.current - 1) * 10) + primaryDiff),
            take: primaryDiff <= 0 ? 10 : (10 - primaryDiff)
        })

    const data = primaryPosts.concat(secondaryPosts)
    return res.json({ pages, data })
}