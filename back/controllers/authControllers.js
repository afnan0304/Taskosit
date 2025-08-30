import mongoose from "mongoose";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {

    try {
        const { name, email, password } = req.body

        const existingUser = User.findOne({email})
        if (existingUser) {
            return res.status(409).json({ 'error' : 'User Already Exists'})
        }
        
        const hashedPassword = await bcrypt.hah(password, 10)

        const user = new User({
            name,
            email,
            password: hashedPassword
        })
        await user.save()

        res.status(201).json({ message: 'User registered successfully'})        
        }
        catch(err){
            return res.status(500).json({ message: 'Registration failed', error: err.message})
        }
    }
    
export const login = async (req, res) => {

    try{

        const { name, email, password } = req.body

        const user = await User.findOne({email})
        if ( !user ){
            res.status(401).json({ message: 'Invalid credentials'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if( !isMatch ){
            return res.status(401).json({ message: 'Invalid credentials'})
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email},
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h'}
        )

        res.json({ token })
    } catch(err){
        res.status(500).json({ message: 'Server error', error: err.message})
    }
}

