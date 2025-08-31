import express from 'express'
import { createTask, updateTask, getAllDAta, removeTask } from '../controllers/taskController.js'
import auth from './Middlwares/auth.js'

const router = express.Router()

router.get('/task', auth, getAllDAta)
router.post('/task', auth, createTask)
router.put('/task/:id', auth, updateTask)
router.delete('/task/:id', auth, removeTask)

export default router
