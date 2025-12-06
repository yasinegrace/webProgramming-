import express from "express"
import { registerUser, loginUser, logoutUser, getUserDetails } from '../controllers/userController.mjs'


const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/logout', logoutUser)
router.get('/user/profile', getUserDetails)

export default router