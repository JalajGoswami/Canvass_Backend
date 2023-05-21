import { Router } from 'express'
import { saveFile } from '../services/cloudStorage'
import { createPost, feedPosts, getPost } from '../controllers/post'
import { sessionRequired } from '../middlewares/session'

const router = Router()

router.use(sessionRequired)
router.post(
    '/', saveFile.single('image'), createPost
)
router.get('/feed', feedPosts)
router.get('/:id', getPost)

export default router