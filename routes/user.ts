import { Router } from 'express'
import {
    createProfile
} from '../controllers/user'

const router = Router()

router.get('/create-profile', createProfile)


export default router