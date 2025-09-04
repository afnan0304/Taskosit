import express from "express"
import { getMe, updateMe, updatePassword } from "../controllers/profileController.js"
import auth from "./Middlewares/auth.js"; 

const router = express.Router()

router.get("/me", auth, getMe)
router.put("/me", auth, updateMe)
router.put("/me/password", auth, updatePassword)

export default router