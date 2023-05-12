import { Router } from 'express'
import authRouter from './auth'
import userRouter from './user'
import tagRouter from './tag'

const router = Router()

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/tag', tagRouter)


export default router