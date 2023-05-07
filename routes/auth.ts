import { Router } from 'express'
import { verifyEmail } from '../controllers/auth'

const router = Router()

router.post('/verify-email', verifyEmail)


export default router