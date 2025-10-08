import express from "express"
import { getMe, updateMe, updatePassword } from "../controllers/profileController.js"
import auth from "../Middlewares/auth.js" 
import { validate, profileValidators } from "../Middlewares/validators.js"

const router = express.Router()

router.get("/me", auth, getMe)
router.put("/me", auth, validate(profileValidators.update), updateMe)
router.put("/me/password", auth, validate(profileValidators.passwordChange), updatePassword)

export default router