import { Server } from 'socket.io'
import { WS_Server } from '../types/WebSocketTypes'
import registerHandlers from './chats'

const ws: WS_Server = new Server({ cors: { origin: '*' } })

ws.on('connection', (socket) => {
    socket.emit('basicEmit', `Welcome !`)
    socket.on('new_user', id => socket.emit('basicEmit', `Hello ${id}`))
    registerHandlers(ws, socket)
})

ws.listen(8000)
console.log('🚀 WebSocket server running on ws://localhost:8000')