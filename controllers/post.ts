import { Response } from 'express'
import db from '../prisma/db'
import { handleError } from '../services/errorHandlers'
import { createPostSchema } from '../schemas/post'
import ExtendedRequest from '../types/ExtendedRequest'
import { User } from '@prisma/client'
import { uploadFile } from '../services/cloudStorage'

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