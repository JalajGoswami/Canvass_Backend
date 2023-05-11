import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import ExtendedRequest from '../types/ExtendedRequest'
import db from '../prisma/db'
import { getError } from '../services/errorHandlers'

export default async function session(
    req: ExtendedRequest, res: Response, next: NextFunction
) {
    const { authorization } = req.headers

    if (!authorization) {
        req.sessionError = Error('Auth Header not provided')
        return next()
    }

    if (!authorization.match(/Bearer \S+$/)) {
        req.sessionError = Error('Auth Header not in valid format')
        return next()
    }

    const token = authorization.split(' ')[1]

    try {
        type decodedObj = { id: number; email: string }
        const decoded = jwt.verify(
            token, process.env.HASH_SECRET ?? 'secret'
        ) as decodedObj

        const user = await db.user.findFirst({
            where: { id: decoded.id, email: decoded.email }
        })

        if (!user) {
            req.sessionError = Error('User not exist for this token')
            return next()
        }

        req.session = user
        next()
    }
    catch (err) {
        req.sessionError = Error('Token is not valid')
        next()
    }
}

export async function sessionRequired(
    req: ExtendedRequest, res: Response, next: NextFunction
) {
    try {
        if (!req.session) {
            if (req.sessionError)
                throw req.sessionError
            else
                throw Error('Error occured while validating User')
        }
        next()
    }
    catch (err) {
        const error = getError(err)
        res.status(401).json({ error })
    }
}