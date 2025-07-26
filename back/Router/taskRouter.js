import express from 'express'
import { createTask, updateTask, getAllDAta, removeTask } from '../controllers/taskController.js'

const router = express.Router()

router.get('/task', getAllDAta)
router.post('/task', createTask)
router.put('/task/:id', updateTask)
router.delete('/task/:id', removeTask)

export default router
