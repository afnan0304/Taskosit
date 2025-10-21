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

export const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.userId

    // Get all tasks for user
    const tasks = await Task.find({ user: userId, archived: false })

    // Calculate statistics
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'completed').length
    const inProgress = tasks.filter(t => t.status === 'in-progress').length
    const pending = tasks.filter(t => t.status === 'pending').length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    // Priority breakdown
    const byPriority = {
      urgent: tasks.filter(t => t.priority === 'urgent').length,
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length,
    }

    // Category breakdown
    const categories = {}
    tasks.forEach(task => {
      if (task.category) {
        categories[task.category] = (categories[task.category] || 0) + 1
      }
    })

    // Overdue tasks
    const now = new Date()
    const overdue = tasks.filter(t => 
      t.dueDate && 
      new Date(t.dueDate) < now && 
      t.status !== 'completed'
    ).length

    // Due soon (next 7 days)
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const dueSoon = tasks.filter(t =>
      t.dueDate &&
      new Date(t.dueDate) >= now &&
      new Date(t.dueDate) <= weekFromNow &&
      t.status !== 'completed'
    ).length

    res.json({
      total,
      completed,
      inProgress,
      pending,
      completionRate,
      byPriority,
      categories,
      overdue,
      dueSoon,
    })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats", message: err.message })
    console.log(err)
  }
}

export const filterTasks = async (req, res) => {
  try {
    const { status, priority, category, startDate, endDate, archived } = req.query
    const filter = { user: req.user.userId }

    if (status) filter.status = status
    if (priority) filter.priority = priority
    if (category) filter.category = category
    if (archived !== undefined) filter.archived = archived === 'true'

    // Date range filter
    if (startDate || endDate) {
      filter.dueDate = {}
      if (startDate) filter.dueDate.$gte = new Date(startDate)
      if (endDate) filter.dueDate.$lte = new Date(endDate)
    }

    const tasks = await Task.find(filter).sort({ dueDate: 1, createdAt: -1 })
    
    res.json({
      tasks,
      count: tasks.length,
      filters: { status, priority, category, startDate, endDate, archived }
    })
  } catch (err) {
    res.status(500).json({ error: "Failed to filter tasks", message: err.message })
    console.log(err)
  }
}

export const archiveTask = async (req, res) => {
  try {
    const { id } = req.params
    const task = await Task.findById(id)
    
    if (!task) return res.status(404).json({ error: 'Task not found' })
    if (task.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    task.archived = true
    const updated = await task.save()
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: "Failed to archive task", message: err.message })
    console.log(err)
  }
}

export const unarchiveTask = async (req, res) => {
  try {
    const { id } = req.params
    const task = await Task.findById(id)
    
    if (!task) return res.status(404).json({ error: 'Task not found' })
    if (task.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    task.archived = false
    const updated = await task.save()
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: "Failed to unarchive task", message: err.message })
    console.log(err)
  }
}

export const bulkUpdateStatus = async (req, res) => {
  try {
    const { taskIds, status } = req.body
    
    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ error: 'Task IDs array required' })
    }

    const allowed = ["pending", "in-progress", "completed"]
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status" })
    }

    // Verify all tasks belong to user
    const tasks = await Task.find({ 
      _id: { $in: taskIds }, 
      user: req.user.userId 
    })

    if (tasks.length !== taskIds.length) {
      return res.status(403).json({ error: 'Some tasks not found or not authorized' })
    }

    const result = await Task.updateMany(
      { _id: { $in: taskIds }, user: req.user.userId },
      { $set: { status } }
    )

    res.json({ 
      message: 'Tasks updated successfully',
      modifiedCount: result.modifiedCount
    })
  } catch (err) {
    res.status(500).json({ error: "Failed to bulk update", message: err.message })
    console.log(err)
  }
}

export const bulkDelete = async (req, res) => {
  try {
    const { taskIds } = req.body
    
    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ error: 'Task IDs array required' })
    }

    // Verify all tasks belong to user
    const tasks = await Task.find({ 
      _id: { $in: taskIds }, 
      user: req.user.userId 
    })

    if (tasks.length !== taskIds.length) {
      return res.status(403).json({ error: 'Some tasks not found or not authorized' })
    }

    const result = await Task.deleteMany({
      _id: { $in: taskIds },
      user: req.user.userId
    })

    res.json({ 
      message: 'Tasks deleted successfully',
      deletedCount: result.deletedCount
    })
  } catch (err) {
    res.status(500).json({ error: "Failed to bulk delete", message: err.message })
    console.log(err)
  }
}

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId
    const { period = '30' } = req.query // days to analyze
    
    const daysAgo = parseInt(period) || 30
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysAgo)

    // Get all tasks for user
    const allTasks = await Task.find({ user: userId, archived: false })
    const recentTasks = await Task.find({ 
      user: userId, 
      archived: false,
      createdAt: { $gte: startDate }
    })

    // Basic stats
    const total = allTasks.length
    const completed = allTasks.filter(t => t.status === 'completed').length
    const inProgress = allTasks.filter(t => t.status === 'in-progress').length
    const pending = allTasks.filter(t => t.status === 'pending').length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    // Priority breakdown
    const priorityStats = {
      urgent: allTasks.filter(t => t.priority === 'urgent').length,
      high: allTasks.filter(t => t.priority === 'high').length,
      medium: allTasks.filter(t => t.priority === 'medium').length,
      low: allTasks.filter(t => t.priority === 'low').length,
    }

    // Category breakdown
    const categoryStats = {}
    allTasks.forEach(task => {
      if (task.category) {
        if (!categoryStats[task.category]) {
          categoryStats[task.category] = { total: 0, completed: 0 }
        }
        categoryStats[task.category].total++
        if (task.status === 'completed') {
          categoryStats[task.category].completed++
        }
      }
    })

    // Time-based analytics
    const now = new Date()
    const overdue = allTasks.filter(t => 
      t.dueDate && 
      new Date(t.dueDate) < now && 
      t.status !== 'completed'
    ).length

    const dueSoon = allTasks.filter(t => {
      if (!t.dueDate || t.status === 'completed') return false
      const dueDate = new Date(t.dueDate)
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      return dueDate >= now && dueDate <= weekFromNow
    }).length

    // Completion trend (last 7 days)
    const completionTrend = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)
      
      const completedOnDay = allTasks.filter(t => {
        if (!t.updatedAt || t.status !== 'completed') return false
        const updated = new Date(t.updatedAt)
        return updated >= date && updated < nextDate
      }).length

      completionTrend.push({
        date: date.toISOString().split('T')[0],
        count: completedOnDay
      })
    }

    // Creation trend (last 7 days)
    const creationTrend = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)
      
      const createdOnDay = allTasks.filter(t => {
        if (!t.createdAt) return false
        const created = new Date(t.createdAt)
        return created >= date && created < nextDate
      }).length

      creationTrend.push({
        date: date.toISOString().split('T')[0],
        count: createdOnDay
      })
    }

    // Average completion time
    const completedTasks = allTasks.filter(t => t.status === 'completed' && t.createdAt && t.updatedAt)
    let avgCompletionTime = 0
    if (completedTasks.length > 0) {
      const totalTime = completedTasks.reduce((sum, task) => {
        const created = new Date(task.createdAt)
        const completed = new Date(task.updatedAt)
        return sum + (completed - created)
      }, 0)
      avgCompletionTime = Math.round(totalTime / completedTasks.length / (1000 * 60 * 60 * 24)) // Convert to days
    }

    // Productivity score (0-100)
    const productivityScore = Math.min(100, Math.round(
      (completionRate * 0.4) + 
      (Math.max(0, 100 - (overdue * 5)) * 0.3) +
      (Math.min(100, (completedTasks.length / Math.max(1, daysAgo)) * 10) * 0.3)
    ))

    // Recent activity summary
    const recentActivity = {
      tasksCreated: recentTasks.length,
      tasksCompleted: recentTasks.filter(t => t.status === 'completed').length,
      tasksDeleted: 0, // Would need a separate tracking mechanism
    }

    res.json({
      period: daysAgo,
      summary: {
        total,
        completed,
        inProgress,
        pending,
        completionRate,
        overdue,
        dueSoon,
        avgCompletionTime,
        productivityScore
      },
      priority: priorityStats,
      categories: categoryStats,
      trends: {
        completion: completionTrend,
        creation: creationTrend
      },
      recentActivity
    })

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch analytics", message: err.message })
    console.log(err)
  }
}
