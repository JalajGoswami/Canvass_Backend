import { Router } from 'express'
import {
    getCategories, searchTags, trendingTags,
    updateTags
} from '../controllers/tag'
import { sessionRequired } from '../middlewares/session'

const router = Router()

router.get('/categories', getCategories)
router.use(sessionRequired)
router.post('/update-tags', updateTags)
router.get('/search-tags', searchTags)
router.get('/trending-tags', trendingTags)

export default router