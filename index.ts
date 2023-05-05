import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT ?? 5000

const app: Express = express()

// body parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// static file serving
app.use('/static', express.static('assets'))


// basic initial route
app.get('/', (req: Request, res: Response) => {

    return res.json({ msg: 'Project initialized' })

})

app.listen(PORT, () =>
    console.log(`⚡️ Server running on http://localhost:${PORT}`)
)