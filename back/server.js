import express from "express"
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from "./config/db.js"
import taskRoutes from "./Router/taskRouter.js"
import authRoutes from "./Router/authRouter.js"
import userRoutes from "./Router/userRouter.js"
import errorHandler from './Middlewares/errorHandler.js'

dotenv.config()

const app = express()
connectDB()
const allowedOrigin = process.env.FRONTEND_URL || '*'
app.use(cors({ origin: allowedOrigin }))
app.use(express.json())
import rateLimit from 'express-rate-limit'
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
})
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Too many requests, please try again later.' },
})
app.use(globalLimiter)
app.use('/api', taskRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use(errorHandler)


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`server listening on port: ${PORT} `)
})