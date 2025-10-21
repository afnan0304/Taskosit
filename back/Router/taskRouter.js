import express from 'express'
import { 
  createTask, 
  updateTask, 
  getAllDAta, 
  removeTask, 
  updateTaskStatus,
  getTaskStats,
  filterTasks,
  archiveTask,
  unarchiveTask,
  bulkUpdateStatus,
  bulkDelete,
  getAnalytics
} from '../controllers/taskController.js'
import auth from '../Middlewares/auth.js'
import { validate, taskValidators } from '../Middlewares/validators.js'

const router = express.Router()

// Core CRUD operations
router.get('/task', auth, getAllDAta)
router.post('/task', auth, validate(taskValidators.create), createTask)
router.put('/task/:id', auth, validate(taskValidators.update), updateTask)
router.patch('/task/:id/status', auth, validate(taskValidators.statusOnly), updateTaskStatus)
router.delete('/task/:id', auth, removeTask)

// Statistics & Analytics
router.get('/task/stats', auth, getTaskStats)
router.get('/task/analytics', auth, getAnalytics)

// Filtering
router.get('/task/filter', auth, filterTasks)

// Archive operations
router.patch('/task/:id/archive', auth, archiveTask)
router.patch('/task/:id/unarchive', auth, unarchiveTask)

// Bulk operations
router.post('/task/bulk/status', auth, bulkUpdateStatus)
router.post('/task/bulk/delete', auth, bulkDelete)

export default router
