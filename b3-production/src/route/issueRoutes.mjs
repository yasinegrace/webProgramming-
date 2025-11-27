import express from 'express'
import { listIssues, homepage, handleWebhook  } from '../controller/issueController.mjs'

const router = express.Router()
router.get('/', homepage)
router.get('/issues', listIssues)
router.post('/webhook', handleWebhook)
export default router