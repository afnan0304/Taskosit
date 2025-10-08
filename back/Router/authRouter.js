import express from "express"
import { login, register, refreshToken, logout } from "../controllers/authControllers.js"
import { validate, authValidators } from "../Middlewares/validators.js"
import rateLimit from 'express-rate-limit'

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	message: { error: 'Too many auth requests, please try again later.' },
})

const router = express.Router()

router.post('/register', authLimiter, validate(authValidators.register), register)
router.post('/login', authLimiter, validate(authValidators.login), login)
router.post('/refresh-token', refreshToken)
router.post('/logout', logout)

export default router