import { Router } from 'express'
import authRouter from './auth'
import userRouter from './user'
import tagRouter from './tag'
import postRouter from './post'
import apiRouter from './api'
import chatRouter from './chat'

const router = Router()

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/tag', tagRouter)
router.use('/post', postRouter)
router.use('/api', apiRouter)
router.use('/chat', chatRouter)


export default router