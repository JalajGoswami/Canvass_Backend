import { Router } from 'express'
import {
    checkUserName,
    createProfile,
    updateProfile
} from '../controllers/user'
import { saveFile } from '../services/cloudStorage'

const router = Router()

router.post(
    '/create-profile',
    saveFile.single('profile_pic'), createProfile
)
router.get('/check-user-name', checkUserName)
router.patch('/update-profile/:id',
    saveFile.single('profile_pic'), updateProfile
)

export default router