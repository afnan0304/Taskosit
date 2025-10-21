#!/usr/bin/env node
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// Load environment variables from back/.env
dotenv.config({ path: join(__dirname, '../.env') })
// Simple models (no need to import the full models)
const UserSchema = new mongoose.Schema({}, { strict: false })
const TaskSchema = new mongoose.Schema({}, { strict: false })
const User = mongoose.model('User', UserSchema)
const Task = mongoose.model('Task', TaskSchema)
async function inspectDatabase() {
  try {
    console.log('🔍 Connecting to MongoDB...\n')
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected successfully!\n')
    console.log('=' .repeat(60))
    // Users Summary
    console.log('\n📊 USERS COLLECTION')
    console.log('=' .repeat(60))
    const userCount = await User.countDocuments()
    console.log(`Total Users: ${userCount}`)
    if (userCount > 0) {
      const users = await User.find({}, { password: 0, refreshToken: 0 }).limit(10)
      console.log('\nUser Details:')
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name}`)
        console.log(`   Email: ${user.email}`)
        console.log(`   ID: ${user._id}`)
        console.log(`   Created: ${user.createdAt?.toLocaleDateString() || 'N/A'}`)
      })
      if (userCount > 10) {
        console.log(`\n... and ${userCount - 10} more users`)
      }
    }
    
    // Tasks Summary
    console.log('\n\n' + '='.repeat(60))
    console.log('📋 TASKS COLLECTION')
    console.log('=' .repeat(60))
    const taskCount = await Task.countDocuments()
    console.log(`Total Tasks: ${taskCount}`)
    if (taskCount > 0) {
      // Status breakdown
      const statusBreakdown = await Task.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
      console.log('\nBy Status:')
      statusBreakdown.forEach(item => {
        console.log(`   ${item._id || 'unknown'}: ${item.count}`)
      })
      // Priority breakdown
      const priorityBreakdown = await Task.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ])
      console.log('\nBy Priority:')
      priorityBreakdown.forEach(item => {
        console.log(`   ${item._id || 'unknown'}: ${item.count}`)
      })
      // Category breakdown
      const categoryBreakdown = await Task.aggregate([
        { $match: { category: { $ne: null, $ne: '' } } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
      if (categoryBreakdown.length > 0) {
        console.log('\nTop Categories:')
        categoryBreakdown.forEach(item => {
          console.log(`   ${item._id}: ${item.count}`)
        })
      }
      
      // Recent tasks
      const recentTasks = await Task.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email')
      console.log('\n\nRecent Tasks:')
      recentTasks.forEach((task, index) => {
        console.log(`\n${index + 1}. ${task.title}`)
        console.log(`   Status: ${task.status || 'N/A'}`)
        console.log(`   Priority: ${task.priority || 'N/A'}`)
        console.log(`   Category: ${task.category || 'N/A'}`)
        console.log(`   User: ${task.user?.name || 'Unknown'} (${task.user?.email || 'N/A'})`)
        console.log(`   Due: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}`)
        console.log(`   Created: ${task.createdAt?.toLocaleDateString() || 'N/A'}`)
      })
      if (taskCount > 5) {
        console.log(`\n... and ${taskCount - 5} more tasks`)
      }
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('\n✨ Inspection complete!\n')
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    console.error('\nMake sure:')
    console.error('1. MongoDB is running')
    console.error('2. MONGO_URI is set correctly in back/.env')
    console.error('3. You have network access to the database\n')
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB\n')
  }
}

inspectDatabase()
