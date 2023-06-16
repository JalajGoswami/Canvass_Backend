import express, { Express } from 'express'
import dotenv from 'dotenv'
import db from './prisma/db'
import router from './routes'
import session from './middlewares/session'
import { Server as wsServer } from 'socket.io'
import { createServer } from 'http'
import { WS_Server } from './types/WebSocketTypes'

dotenv.config()

const PORT = process.env.PORT ?? 5000

const app: Express = express()

async function main() {

    const server = createServer(app)
    const ws: WS_Server = new wsServer(server)

    ws.on('connection', (socket) => {
        socket.emit('basicEmit', `Welcome !`)
        socket.on('new_user', id => socket.emit('basicEmit', `Hello ${id}`))
    })


    // body parsers
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    // static file serving
    app.use('/static', express.static('assets'))

    // session manager middleware
    app.use(session)

    // router setup
    app.use('/', router)

    server.listen(PORT, () =>
        console.log(`⚡️ Server running on http://localhost:${PORT}`)
    )
}

main()
    .catch((err) =>
        console.error(err)
    )
    .finally(() =>
        db.$disconnect()
    )