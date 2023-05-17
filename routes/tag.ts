import { Router } from 'express'
import { getCategories, searchTags, updateTags } from '../controllers/tag'
import { sessionRequired } from '../middlewares/session'

const router = Router()

router.use(sessionRequired)
router.get('/categories', getCategories)
router.post('/update-tags', updateTags)
router.get('/search-tags', searchTags)

export default router