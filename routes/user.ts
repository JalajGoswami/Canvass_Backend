import { Router } from 'express'
import {
    checkUserName,
    createProfile,
    updateProfile,
    getProfile,
    createPrefrence
} from '../controllers/user'
import { saveFile } from '../services/cloudStorage'
import { sessionRequired } from '../middlewares/session'

const router = Router()

router.get(
    '/profile', sessionRequired, getProfile
)
router.post(
    '/profile',
    saveFile.single('profile_pic'), createProfile
)
router.patch(
    '/profile', sessionRequired,
    saveFile.single('profile_pic'), updateProfile
)
router.get('/check-user-name', checkUserName)
router.post('/prefrence', createPrefrence)

export default router