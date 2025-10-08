import express from 'express'
import { createTask, updateTask, getAllDAta, removeTask, updateTaskStatus } from '../controllers/taskController.js'
import auth from './Middlewares/auth.js'
import { validate, taskValidators } from '../Middlewares/validators.js'

const router = express.Router()

router.get('/task', auth, getAllDAta)
router.post('/task', auth, validate(taskValidators.create), createTask)
router.put('/task/:id', auth, validate(taskValidators.update), updateTask)
router.patch('/task/:id/status', auth, validate(taskValidators.statusOnly), updateTaskStatus)
router.delete('/task/:id', auth, removeTask)

export default router
