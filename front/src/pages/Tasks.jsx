import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlus, FiTrash2, FiCalendar, FiLoader, FiCheck, FiClock, FiAlertCircle, FiEdit2, FiSearch } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { getTasks, createTask, updateTask, deleteTask as removeTask, logout } from '../api.js'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Navigation } from '../components/Navigation'

const TASK_FILTERS = {
  ALL: 'all',
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
}

const STATUS_COLORS = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  'in-progress': 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

const STATUS_ICONS = {
  pending: FiClock,
  'in-progress': FiAlertCircle,
  completed: FiCheck,
}

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const fetchTasks = async () => {
    try {
      const data = await getTasks()
      setTasks(data || [])
    } catch {
      const hasAnyToken = localStorage.getItem('accessToken') || localStorage.getItem('refreshToken')
      if (!hasAnyToken) navigate('/login')
    } finally {
      setIsLoading(false)
    }
  }

  const addTask = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      await createTask({ 
        title, 
        dueDate: dueDate || undefined 
      })
      setTitle('')
      setDueDate('')
      toast.success('Task created successfully!')
      fetchTasks()
    } catch {
      toast.error('Failed to create task')
    }
  }

  const updateTaskStatus = async (id, status) => {
    try {
      await updateTask(id, { status })
      toast.success('Task status updated!')
      fetchTasks()
    } catch {
      toast.error('Failed to update task status')
    }
  }

  const handleDeleteTask = async (id) => {
    try {
      await removeTask(id)
      toast.success('Task deleted!')
      fetchTasks()
    } catch {
      toast.error('Failed to delete task')
    }
  }

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await logout(refreshToken)
      }
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      navigate('/login')
    }
  }

  useEffect(() => {
    fetchTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [filter, setFilter] = useState(TASK_FILTERS.ALL)
  
  const filteredTasks = tasks.filter(task => {
    // Filter by status
    if (filter !== TASK_FILTERS.ALL && task.status !== filter) return false
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      return (
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
      )
    }
    
    return true
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <FiLoader className="h-12 w-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Navigation onLogout={handleLogout} />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Tasks</h1>
            <p className="text-gray-600">Organize and manage your daily tasks efficiently</p>
          </div>

          {/* Task Creation Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="bg-primary-100 p-2 rounded-lg mr-3">
                <FiPlus className="h-5 w-5 text-primary-600" />
              </div>
              Create New Task
            </h2>
            <form onSubmit={addTask} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="What needs to be done?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <div className="flex gap-3">
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="h-12 flex-1"
                  />
                  <Button 
                    type="submit" 
                    className="h-12 px-6 whitespace-nowrap shadow-lg hover:shadow-xl transition-all"
                  >
                    <FiPlus className="h-5 w-5 mr-2" />
                    Add Task
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <span className="text-sm font-medium">Clear</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 inline-flex space-x-2">
              {Object.entries(TASK_FILTERS).map(([key, value]) => {
                const taskCount = value === 'all' 
                  ? tasks.length 
                  : tasks.filter(t => t.status === value).length
                
                return (
                  <button
                    key={key}
                    onClick={() => setFilter(value)}
                    className={`px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200
                      ${filter === value 
                        ? 'bg-primary-600 text-white shadow-md' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    <span>{key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold
                      ${filter === value 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {taskCount}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  {searchQuery ? (
                    <FiSearch className="h-12 w-12 text-gray-400" />
                  ) : (
                    <FiCheck className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchQuery 
                    ? "No tasks found"
                    : tasks.length === 0 
                    ? "No tasks yet" 
                    : "No tasks match the selected filter"
                  }
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery 
                    ? `No tasks match "${searchQuery}". Try a different search term.`
                    : tasks.length === 0 
                    ? "Create your first task to get started on your productivity journey!"
                    : "Try selecting a different filter to view your tasks."
                  }
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="btn btn-secondary"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTasks.map((task) => {
                  const StatusIcon = STATUS_ICONS[task.status]
                  return (
                    <div
                      key={task._id}
                      className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 group"
                    >
                      {/* Task Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="ml-3 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete task"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Task Metadata */}
                      <div className="space-y-3">
                        {/* Due Date */}
                        {task.dueDate && (
                          <div className="flex items-center text-sm text-gray-500">
                            <FiCalendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}</span>
                          </div>
                        )}

                        {/* Status Selector */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center">
                            <StatusIcon className="h-4 w-4 mr-2" />
                            <select
                              value={task.status}
                              onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                              className={`text-sm font-semibold rounded-lg px-3 py-1.5 border cursor-pointer transition-all ${STATUS_COLORS[task.status]} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Stats Footer */}
          {tasks.length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">
                    {tasks.filter(t => t.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Pending Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {tasks.filter(t => t.status === 'in-progress').length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">
                    {tasks.filter(t => t.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Completed</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
