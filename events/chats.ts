import db from '../prisma/db'
import { WS_Socket } from '../types/WebSocketTypes'

const activeUsers: Map<string, number> = new Map()

export default function registerChatHandlers(socket: WS_Socket) {

    socket.on('new_user', id => {
        id = Number(id)
        activeUsers.set(socket.id, id)

        socket.broadcast.emit('user_joined', id)

        const users = Array.from(activeUsers.values()).toString()
        socket.emit('active_users', users)

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