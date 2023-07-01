import { Server } from 'socket.io'
import { WS_Server } from '../types/WebSocketTypes'
import registerChatHandlers from './chats'

const ws: WS_Server = new Server({ cors: { origin: '*' } })

ws.on('connection', (socket) => {

    registerChatHandlers(socket)

})

ws.listen(8000)
console.log('🚀 WebSocket server running on ws://localhost:8000')