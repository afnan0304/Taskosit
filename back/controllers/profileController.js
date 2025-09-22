import User from "../models/User.js"
import bcrypt from "bcryptjs"


export const getMe = async ( req, res ) => {
    try{
        const user = await User.findById(req.user.userId).select("-password")
        if (!user) return res.status(404).json({ message: "User not found"})
        res.json(user)
    }
    catch(err){
        res.status(500).json({ message: "Failed to fetch user data", error: err.message })
    }
}

export const updateMe = async ( req, res ) => {
    try {
        const updates = { ...req.body }
        delete updates.password

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            updates,
            { new: true, runValidators: true, select: "-password"}
        )
        if (!user) return res.status(404).json({ message: "User not found"})
        res.json(user)
    }
    catch(err){
        res.status(500).json({ message: "Failed to update profile", error: err.message })
    }
}

export const updatePassword = async ( req, res ) => {
    try {
        const { currentPassword, newPassword } = req.body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Both Passwords are required" })
        }

        const user = await User.findById(req.user.userId)
        if (!user) return res.status(404).json({ error: "User not found" })

        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) return res.status(400).json({ error: "Invalid Password" })

        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()
        res.json({ message: "Password updated successfully" })
    }catch(err){
        res.status(500).json({ error: "Failed to change password"})
    }
}

