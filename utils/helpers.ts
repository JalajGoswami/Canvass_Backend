import { Request } from 'express'

export function getIdParam(req: Request, paramName: string) {
    const id = req.params[paramName]
    
    if (!id || isNaN(Number(id)))
        throw Error('Not a valid Id')
    
    return Number(id)
}