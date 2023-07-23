import { Server } from 'socket.io'
import { Store, WS_Server } from '../types/WebSocketTypes'
import registerChatHandlers from './chats'
import registerNotificationHandlers from './notifications'

const store: Store = {
    activeUsers: new Map()
}

const ws: WS_Server = new Server({ cors: { origin: '*' } })

ws.on('connection', (socket) => {

    registerChatHandlers(socket, store)

    registerNotificationHandlers(socket)
})

ws.listen(8000)
console.log('🚀 WebSocket server running on ws://localhost:8000')