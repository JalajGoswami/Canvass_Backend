import { Router } from 'express'
import { saveFile } from '../services/cloudStorage'
import { createPost, getPost } from '../controllers/post'
import { sessionRequired } from '../middlewares/session'

const router = Router()

router.post(
    '/', sessionRequired,
    saveFile.single('image'), createPost
)
router.get(
    '/:id', sessionRequired, getPost
)

export default router