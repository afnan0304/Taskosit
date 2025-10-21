#!/usr/bin/env node
import 'dotenv/config'
import mongoose from 'mongoose'
import readline from 'node:readline'
import User from '../models/User.js'
import Task from '../models/Task.js'
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve))
}

async function main() {
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.error('MONGO_URI is not set. Create back/.env with MONGO_URI or set it in your environment.')
    process.exit(1)
  }
  await mongoose.connect(uri)
  const userCount = await User.countDocuments()
  const taskCount = await Task.countDocuments()
  console.log('--- WARNING: This will permanently delete all user and task data! ---')
  console.log(`Users to delete: ${userCount}`)
  console.log(`Tasks to delete: ${taskCount}`)
  const answer = await ask('Type YES to confirm: ')
  if (answer !== 'YES') {
    console.log('Aborted. No data was deleted.')
    rl.close()
    await mongoose.disconnect()
    process.exit(0)
  }

  const userRes = await User.deleteMany({})
  const taskRes = await Task.deleteMany({})
  console.log(`Deleted ${userRes.deletedCount} users and ${taskRes.deletedCount} tasks.`)
  rl.close()
  await mongoose.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
