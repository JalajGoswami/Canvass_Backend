import { Router } from 'express'
import {
    checkUserName,
    createProfile
} from '../controllers/user'
import { saveFile } from '../services/cloudStorage'

const router = Router()

router.post(
    '/create-profile',
    saveFile.single('profile_pic'), createProfile
)
router.get('/check-user-name', checkUserName)


export default router