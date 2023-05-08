export function getError(err: unknown) {
    let error = err as any
    error = error?.meta?.cause ?? error?.message ?? error
    return error
}