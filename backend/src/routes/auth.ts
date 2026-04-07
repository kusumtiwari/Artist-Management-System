import express from 'express'
import { AuthController } from '../controllers/auth'
import { authenticateToken } from '../middleware/auth'

const router = express.Router()

router.post('/signup', AuthController.signup)
router.post('/login', AuthController.login)
router.get('/me', authenticateToken, AuthController.me)
router.post('/logout', authenticateToken, AuthController.logout)

export default router