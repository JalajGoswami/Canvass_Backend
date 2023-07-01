import { Request, Response } from 'express'
import { handleError } from '../services/errorHandlers'
import ExtendedRequest from '../types/ExtendedRequest'
import { User } from '@prisma/client'
import db from '../prisma/db'

export async function getConversations(req: ExtendedRequest, res: Response) {
    try {
        const user = req.session as User
        let { page } = req.query
        let pageNo = isNaN(Number(page)) ? 1 : Number(page)

        const conversations = await db.message.findMany({
            where: { OR: [{ to: user }, { from: user }] },
            orderBy: { created_at: 'desc' },
            distinct: ['fromId'],
            take: 30,
            skip: (pageNo - 1) * 30
        })

        let uniqueIds: number[][] = []
        const result = conversations.filter(msg => {
            const exist = uniqueIds.some(comb =>
                (comb[0] === msg.toId &&
                    comb[1] === msg.fromId) ||
                (comb[1] === msg.toId &&
                    comb[0] === msg.fromId)
            )
            uniqueIds.push([msg.toId, msg.fromId])
            return exist ? false : true
        })

        return res.json(result)
    }
    catch (err) { handleError(res, err) }
}