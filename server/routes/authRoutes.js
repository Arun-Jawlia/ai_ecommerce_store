import express from "express";
import { getUser, loginUser, logoutUser, registerUser } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Example route for user login

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', isAuthenticated, getUser)
router.post('/logout', isAuthenticated, logoutUser)

export default router