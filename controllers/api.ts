import { Request, Response } from 'express'
import db from '../prisma/db';
import ExtendedRequest from '../types/ExtendedRequest';
import { Tag, User } from '@prisma/client';
import { handleError } from '../services/errorHandlers';

export async function searchUserAndTags(req: ExtendedRequest, res: Response) {
    try {
        const keyword = req.query.keyword as string

        if (!keyword) throw Error('Search keyword required')
        if (keyword.length < 3) throw Error('Keyword too short')

        const user = req.session as User

        const friends = (await db.user.findFirst({
            where: { id: user.id },
            select: { follows: { select: { followedUser: true } } }
        }))?.follows ?? []

        const network = [user.id].concat(friends.map(d => d.followedUser))

        const userFromNetwork = await db.user.findMany({
            where: {
                followedBy: {
                    some: { userId: { in: network } }
                },
                OR: [
                    { user_name: { contains: keyword, mode: 'insensitive' } },
                    { full_name: { contains: keyword, mode: 'insensitive' } }
                ]
            },
            orderBy: { followedBy: { _count: 'desc' } },
            select: {
                id: true, user_name: true, full_name: true, profile_pic: true
            },
            take: 20
        })

        type UserData = typeof userFromNetwork[0]

        type Result = {
            type: string;
            user: UserData | null;
            tag: Tag | null;
        }

        let otherUsers: UserData[] = []
        if (userFromNetwork.length < 20) {
            otherUsers = await db.user.findMany({
                where: {
                    followedBy: {
                        some: { userId: { notIn: network } }
                    },
                    OR: [
                        { user_name: { contains: keyword, mode: 'insensitive' } },
                        { full_name: { contains: keyword, mode: 'insensitive' } }
                    ]
                },
                orderBy: { followedBy: { _count: 'desc' } },
                select: {
                    id: true, user_name: true, full_name: true, profile_pic: true
                },
                take: 20 - userFromNetwork.length
            })
        }

        const tags = await db.tag.findMany({
            where: { name: { contains: keyword, mode: 'insensitive' } },
            orderBy: { appearance: 'desc' },
            take: 20
        })

        let data: Result[] = []

        let i = 0, j = 0
        for (let k = 0; k < (otherUsers.length + tags.length); k++) {
            // create randomized array
            if (i < otherUsers.length && Math.round(Math.random())) {
                data.push({ type: 'user', user: otherUsers[i], tag: null })
                i++
            }
            else {
                data.push({ type: 'tag', tag: tags[j], user: null })
                j++
            }
        }

        data.unshift(...userFromNetwork
            .map(user => ({ type: 'user', user, tag: null })))

        return res.json(data)
    }
    catch (err) { handleError(res, err) }
}