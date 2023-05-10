import { Router } from 'express'
import { login, verifyCode, verifyEmail } from '../controllers/auth'

const router = Router()

router.post('/verify-email', verifyEmail)
router.post('/verify-code', verifyCode)
router.post('/login', login)


export default router