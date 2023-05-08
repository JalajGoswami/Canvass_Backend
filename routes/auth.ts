import { Router } from 'express'
import { verifyCode, verifyEmail } from '../controllers/auth'

const router = Router()

router.post('/verify-email', verifyEmail)
router.post('/verify-code', verifyCode)


export default router