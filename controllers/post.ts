import { Response } from 'express'
import db from '../prisma/db'
import { getError } from '../services/errorHandlers'
import { createPostSchema } from '../schemas/post'
import ExtendedRequest from '../types/ExtendedRequest'
import { User } from '@prisma/client'
import { uploadFile } from '../services/cloudStorage'

export async function createPost(req: ExtendedRequest, res: Response) {
    try {
        const body = createPostSchema.validateSync(req.body)
        const tags = body.tags.map(id => ({ id: id as number }))

        let image: string | undefined = undefined
        if (req.file) {
            image = await uploadFile(
                req.file.path, req.file.filename, 'images'
            )
        }

        const data = await db.post.create({
            data: {
                ...body, image,
                tags: { connect: tags },
                authorId: (req.session as User).id
            }
        })

        return res.json(data)
    }
    catch (err) {
        const error = getError(err)
        return res.status(400).json({ error })
    }
}