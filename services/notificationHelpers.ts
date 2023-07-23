import db from "../prisma/db";

export async function getNotification(id: number) {
    const result = await db.notification.findFirst({
        where: { id },
        include: {
            taggedUser: { select: { user_name: true } },
            post: { select: { image: true } },
            comment: { select: { body: true } }
        }
    })
    return result
}