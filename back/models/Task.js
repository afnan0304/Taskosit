import mongoose from "mongoose"
const { Schema } = mongoose


const taskSchema = new Schema({
    title: String,
    description: String,
    status: {type: String, default:'pending'},
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

export default mongoose.model('Task', taskSchema)