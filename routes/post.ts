import { Router } from 'express'
import { saveFile } from '../services/cloudStorage'
import { createPost } from '../controllers/post'

const router = Router()

router.post('/', saveFile.single('image'), createPost)

export default router