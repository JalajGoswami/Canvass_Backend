import { Router } from 'express'
import { getCategories, updateTags } from '../controllers/tag'

const router = Router()

router.get('/categories', getCategories)
router.post('/update-tags', updateTags)

export default router