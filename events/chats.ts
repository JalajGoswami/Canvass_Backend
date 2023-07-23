import db from '../prisma/db'
import { Store, WS_Socket } from '../types/WebSocketTypes'

export default function registerChatHandlers(socket: WS_Socket, store: Store) {
    const activeUsers = store.activeUsers

    socket.on('new_user', async id => {
        id = Number(id)
        activeUsers.set(socket.id, id)

        socket.broadcast.emit('user_joined', id)

        const followings = (await db.follow.findMany({
            where: { followedUser: id },
            select: { userId: true }
        })).map(v => v.userId)

        let users: number[] = []
        activeUsers.forEach(user =>
            followings.includes(user) && users.push(user)
        )

        socket.emit('active_users', users.toString())

        socket.join('room.' + id)
    })

    socket.on('message_sent', async (to, msgId) => {
        to = Number(to)
        msgId = Number(msgId)

        const message = await db.message
            .findFirst({ where: { id: msgId } })

        socket.to('room.' + to)
            .emit('message_received', message)
    })

    socket.on('message_seen', async (from, msgIds) => {
        await db.message.updateMany({
            where: { id: { in: msgIds.split(',').map(Number) } },
            data: { status: 'seen' }
        })

        const user = activeUsers.get(socket.id) as number
        socket.to('room.' + from).emit('message_seen', user, msgIds)
    })

    socket.on('disconnect', () => {
        const user = activeUsers.get(socket.id) as number
        socket.broadcast.emit('user_left', user)
        socket.leave('room.' + user)

        activeUsers.delete(socket.id)
    })
}