import { Router } from 'express'
import { getConversations, getMessages } from '../controllers/chat'
import { sessionRequired } from '../middlewares/session'

const router = Router()

router.use(sessionRequired)
router.get('/conversations', getConversations)
router.get('/messages/:id', getMessages)


export default router