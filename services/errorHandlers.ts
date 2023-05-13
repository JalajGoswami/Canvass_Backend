export function getError(err: unknown, withStack = false) {
    let error = err as any

    if (error?.meta?.cause)
        return error.meta.cause

    if (error?.message) {
        let message = error.message.trim()
        const lines = message.trim().split('\n')
        if (!withStack && lines.length > 1)
            return lines[lines.length - 1]

        return message
    }

    return error
}