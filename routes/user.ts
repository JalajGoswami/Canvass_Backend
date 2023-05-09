import { Router } from 'express'
import {
    checkUserName,
    createProfile, test
} from '../controllers/user'
import { saveLocally } from '../services/cloudStorage'

const router = Router()

router.post('/create-profile', createProfile)
router.get('/check-user-name', checkUserName)
router.post('/test', saveLocally.single('test'), test)


export default router