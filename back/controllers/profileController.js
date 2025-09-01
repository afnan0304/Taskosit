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

