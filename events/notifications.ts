import { getNotification } from '../services/notificationHelpers'
import { WS_Socket } from '../types/WebSocketTypes'

export default function registerNotificationHandlers(socket: WS_Socket) {

    socket.on('user_action', async (notificationId) => {
        const id = Number(notificationId)

        const notification = await getNotification(id)
        if (!notification) return;

        socket.to('room.' + notification.userId)
            .emit('notification', notification)
    })
}