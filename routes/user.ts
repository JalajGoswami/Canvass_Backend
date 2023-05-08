import { Router } from 'express'
import {
    checkUserName,
    createProfile
} from '../controllers/user'

const router = Router()

router.post('/create-profile', createProfile)
router.get('/check-user-name', checkUserName)


export default router