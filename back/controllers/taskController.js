import mongoose from "mongoose"
import Task from "../models/Task.js"

export const getAllDAta = async (req, res) => {
  try {
    const { status, sort, search, page = 1, limit = 20, category } = req.query
    const filter = { user: req.user.userId }

    if (status) {
      filter.status = status
    }

    if (category) {
      filter.category = category
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    let query = Task.find(filter)

    if (sort) {
      const sortMap = {
        created: { createdAt: -1 },
        "created:asc": { createdAt: 1 },
        due: { dueDate: 1 },
        "due:desc": { dueDate: -1 },
        status: { status: 1 },
      }
      const sortOption = sortMap[sort] || { createdAt: -1 }
      query = query.sort(sortOption)
    } else {
      query = query.sort({ dueDate: 1, createdAt: -1 })
    }

    const pageNum = parseInt(page) || 1
    const lim = parseInt(limit) || 20
    const skip = (pageNum - 1) * lim
    query = query.skip(skip).limit(lim)

    const tasks = await query.exec()
    const total = await Task.countDocuments(filter)

    res.json({
      tasks,
      total,
      page: pageNum,
      pages: Math.ceil(total / lim),
    })
  } catch (err) {
    res
      .status(500)
      .json({ Error: "Failed To fetch tasks!", error: err.message })
    console.log(err)
  }
}

export const createTask = async (req, res) => {
  try {
    const { title, description, category, dueDate } = req.body

    const newTask = new Task({
      title,
      description,
      category,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      user: req.user.userId,
    })

    const savedTask = await newTask.save()
    res.status(201).json(savedTask)
    console.log(`New Task: ${savedTask} has been saved`)
  } catch (err) {
    res.status(500).json({ error: "Failed To Save Task" })
    console.log(err)
  }
}
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, status, category, dueDate } = req.body
    const updatePayload = { title, description, status, category }
    if (dueDate) updatePayload.dueDate = new Date(dueDate)

    const task = await Task.findById(id)
    if (!task) return res.status(404).json({ error: 'Task not found' })
    if (task.user.toString() !== req.user.userId) return res.status(403).json({ error: 'Not authorized' })

    const update = await Task.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    })
    res.status(201).json(update)
  } catch (err) {
    res.status(500).json({ Error: "Failed To Update Task" })
    console.log(err)
    console.log(req.params.id)
  }
}

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const allowed = ["pending", "in-progress", "completed"]
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ error: "No Status Provided" })
    }

    const task = await Task.findById(id)
    if (!task) return res.status(404).json({ error: "Task not found" })

    if (task.user.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this task" })
    }

    task.status = status
    const updated = await task.save()
    return res.status(200).json(updated)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Failed to update task status" })
  }
}
export const removeTask = async (req, res) => {
  try {
    const { id } = req.params
    const task = await Task.findById(id)
    if (!task) return res.status(404).json({ error: 'Task not found' })
    if (task.user.toString() !== req.user.userId) return res.status(403).json({ error: 'Not authorized' })

    await Task.findByIdAndDelete(id)
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ Error: "Failed To Remove!" })
    console.log(err)
  }
}
