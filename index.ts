import express, { Express } from 'express'
import dotenv from 'dotenv'
console.time('dbColdStart')
import db from './prisma/db'
import router from './routes'
import session from './middlewares/session'
console.timeEnd('dbColdStart')
dotenv.config()

const PORT = process.env.PORT ?? 5000

const app: Express = express()

async function main() {

    // body parsers
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    // static file serving
    app.use('/static', express.static('assets'))

    // session manager middleware
    app.use(session)

    // router setup
    app.use('/', router)


    app.listen(PORT, () =>
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