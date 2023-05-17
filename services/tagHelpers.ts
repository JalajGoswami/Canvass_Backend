import db from '../prisma/db'

export async function createUpdateTags(tags: string[], category: number) {
    const existingTags = await db.tag.findMany({
        where: { name: { in: tags } },
        include: { categories: { select: { id: true } } }
    })

    const unavailableTags = tags.filter(tag =>
        !existingTags.find(t => t.name == tag)
    )

    const connectedTags = existingTags.filter(tag =>
        tag.categories.find(c => c.id == category)
    ).map(tag => tag.id)

    const notConnectedTags = existingTags.filter(tag =>
        tag.categories.every(c => c.id != category)
    ).map(tag => tag.id)

    if (connectedTags.length)
        await db.tag.updateMany({
            where: { id: { in: connectedTags } },
            data: {
                appearance: { increment: 1 }
            }
        })

    notConnectedTags.forEach(async id => {
        await db.tag.update({
            where: { id },
            data: {
                appearance: { increment: 1 },
                categories: { connect: { id: category } }
            }
        })
    })

    unavailableTags.forEach(async tag => {
        await db.tag.create({
            data: {
                name: tag,
                categories: { connect: { id: category } }
            }
        })
    })
}