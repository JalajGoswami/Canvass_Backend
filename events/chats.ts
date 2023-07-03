import db from '../prisma/db'
import { WS_Socket } from '../types/WebSocketTypes'

const activeUsers: Map<string, number> = new Map()

export default function registerChatHandlers(socket: WS_Socket) {

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

    socket.on('disconnect', () => {
        socket.broadcast.emit('user_left', activeUsers.get(socket.id))
        socket.leave('room.' + activeUsers.get(socket.id))

        activeUsers.delete(socket.id)
    })
}