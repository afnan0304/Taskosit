import express from "express"
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from "./config/db.js"
import taskRoutes from "./Router/taskRouter.js"

dotenv.config()

const app = express()
connectDB()
app.use(cors())
app.use(express.json())
app.use('/api', taskRoutes)




const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`server listening on port: ${PORT} `)
})