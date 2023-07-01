import { Router } from 'express'
import { getConversations } from '../controllers/chat'
import { sessionRequired } from '../middlewares/session'

const router = Router()

router.use(sessionRequired)
router.get('/conversations', getConversations)


export default router