import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

dotenv.config()

const PORT = process.env.PORT ?? 5000

const app: Express = express()

// body parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// static file serving
app.use('/static', express.static('assets'))


async function main() {

    app.listen(PORT, () =>
        console.log(`⚡️ Server running on http://localhost:${PORT}`)
    )
}

main()
    .catch((err) =>
        console.error(err)
    )
    .finally(() =>
        prisma.$disconnect()
    )