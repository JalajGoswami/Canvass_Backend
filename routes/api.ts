import { Router } from 'express'
import { sessionRequired } from '../middlewares/session'
import { searchUserAndTags } from '../controllers/api'

const router = Router()

router.use(sessionRequired)
router.get('/search', searchUserAndTags)

export default router