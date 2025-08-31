import mongoose from "mongoose"
const { Schema } = mongoose


const taskSchema = new Schema({
    title: { type: String, required: true},
    description: String,
    status: {type: String, enum: [ 'pending', 'in-progress', 'completed' ], default:'pending'},
    user: {
        type: Schema.Types.ObjectId,
        ref: "User", required: true
    }
})

export default mongoose.model('Task', taskSchema)