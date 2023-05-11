import { User } from '@prisma/client'
import { Request } from 'express'

export default interface ExtendedRequest extends Request {
    session?: User;
    sessionError?: Error;
}