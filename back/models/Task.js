import mongoose from "mongoose"
const { Schema } = mongoose

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, trim: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    archived: {
      type: Boolean,
      default: false,
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
