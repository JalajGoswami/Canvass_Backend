export function getError(err: unknown) {
    let error = err as any
    error = error?.message ?? error
    return error
}