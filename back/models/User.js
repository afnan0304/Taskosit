import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
    ,
    refreshTokens: [{ type: String }]
})

const User = mongoose.model('User', userSchema)

export default User