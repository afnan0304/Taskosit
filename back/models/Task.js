import mongoose from "mongoose"
const { Schema } = mongoose

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, trim: true },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model("Task", taskSchema)
