import { Router } from 'express'
import authRouter from './auth'
import userRouter from './user'
import tagRouter from './tag'
import postRouter from './post'

const router = Router()

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/tag', tagRouter)
router.use('/post', postRouter)


export default router