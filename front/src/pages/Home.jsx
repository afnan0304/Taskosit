import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FiCalendar, 
  FiTrendingUp, 
  FiCheckCircle, 
  FiClock, 
  FiAlertCircle,
  FiTarget,
  FiActivity,
  FiAward,
  FiZap,
  FiArrowRight,
  FiPlus
} from 'react-icons/fi'
import { getTasks, logout } from '../api'
import { Navigation } from '../components/Navigation'

// Statistics Card Component
// eslint-disable-next-line no-unused-vars
const StatCard = ({ icon: Icon, label, value, trend, color, bgColor }) => (
  <div className="bg-white rounded-2xl p-6 border border-surface-100 shadow-soft-sm hover:shadow-soft transition-all duration-200">
    <div className="flex items-start justify-between mb-4">
      <div className={`${bgColor} p-3 rounded-xl`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      {trend && (
        <div className={`flex items-center space-x-1 text-sm font-medium ${trend > 0 ? 'text-success-600' : 'text-error-600'}`}>
          <FiTrendingUp className={`h-4 w-4 ${trend < 0 ? 'rotate-180' : ''}`} />
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
    <div>
      <p className="text-surface-600 text-sm font-medium mb-1">{label}</p>
      <p className="text-3xl font-bold text-surface-900">{value}</p>
    </div>
  </div>
)

// Quick Action Card
// eslint-disable-next-line no-unused-vars
const QuickAction = ({ icon: Icon, title, description, onClick, color }) => (
  <button
    onClick={onClick}
    className="group bg-white rounded-xl p-5 border border-surface-200 hover:border-primary-300 hover:shadow-soft transition-all duration-200 text-left w-full"
  >
    <div className="flex items-start space-x-4">
      <div className={`${color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-surface-900 mb-1 group-hover:text-primary-600 transition-colors">
          {title}
        </h4>
        <p className="text-sm text-surface-600">{description}</p>
      </div>
      <FiArrowRight className="h-5 w-5 text-surface-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
    </div>
  </button>
)

// Recent Activity Item
const ActivityItem = ({ task, time }) => (
  <div className="flex items-start space-x-3 p-3 hover:bg-surface-50 rounded-lg transition-colors">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
      <FiCheckCircle className="h-4 w-4 text-primary-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-surface-900 truncate">{task}</p>
      <p className="text-xs text-surface-500">{time}</p>
    </div>
  </div>
)

export default function Home() {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    completionRate: 0
  })
  const navigate = useNavigate()

  const fetchDashboardData = useCallback(async () => {
    try {
      const data = await getTasks()
      setTasks(data || [])
      
      // Calculate statistics
      const total = data.length
      const completed = data.filter(t => t.status === 'completed').length
      const inProgress = data.filter(t => t.status === 'in-progress').length
      const pending = data.filter(t => t.status === 'pending').length
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

      setStats({ total, completed, inProgress, pending, completionRate })
    } catch {
      const hasAnyToken = localStorage.getItem('accessToken') || localStorage.getItem('refreshToken')
      if (!hasAnyToken) navigate('/login')
    } finally {
      setIsLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await logout(refreshToken)
      }
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      navigate('/login')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-surface-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const today = new Date()
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 18 ? 'Good afternoon' : 'Good evening'
  const recentTasks = tasks.slice(0, 5)

  return (
    <div className="min-h-screen bg-surface-50">
      <Navigation onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="font-display text-display-lg text-surface-900 mb-2">
            {greeting}! 👋
          </h1>
          <p className="text-surface-600 text-lg">
            Here's what's happening with your tasks today.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FiTarget}
            label="Total Tasks"
            value={stats.total}
            trend={12}
            color="text-primary-600"
            bgColor="bg-primary-50"
          />
          <StatCard
            icon={FiCheckCircle}
            label="Completed"
            value={stats.completed}
            trend={8}
            color="text-success-600"
            bgColor="bg-success-50"
          />
          <StatCard
            icon={FiActivity}
            label="In Progress"
            value={stats.inProgress}
            color="text-warning-600"
            bgColor="bg-warning-50"
          />
          <StatCard
            icon={FiClock}
            label="Pending"
            value={stats.pending}
            color="text-error-600"
            bgColor="bg-error-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Progress Overview */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-surface-100 shadow-soft-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-xl font-semibold text-surface-900">
                  Progress Overview
                </h3>
                <p className="text-sm text-surface-600 mt-1">Your productivity this week</p>
              </div>
              <div className="bg-primary-50 px-4 py-2 rounded-lg">
                <p className="text-sm font-medium text-primary-600">
                  {stats.completionRate}% Complete
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="h-3 bg-surface-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
                  style={{ width: `${stats.completionRate}%` }}
                ></div>
              </div>
            </div>

            {/* Task Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-success-50 rounded-xl">
                <p className="text-2xl font-bold text-success-600">{stats.completed}</p>
                <p className="text-sm text-surface-600 mt-1">Completed</p>
              </div>
              <div className="text-center p-4 bg-warning-50 rounded-xl">
                <p className="text-2xl font-bold text-warning-600">{stats.inProgress}</p>
                <p className="text-sm text-surface-600 mt-1">In Progress</p>
              </div>
              <div className="text-center p-4 bg-error-50 rounded-xl">
                <p className="text-2xl font-bold text-error-600">{stats.pending}</p>
                <p className="text-sm text-surface-600 mt-1">Pending</p>
              </div>
            </div>
          </div>

          {/* Achievement Card - Dynamic based on progress */}
          <div className={`relative rounded-2xl p-6 text-white shadow-soft-lg overflow-hidden ${
            stats.completionRate >= 80 
              ? 'bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700'
              : stats.completionRate >= 50
              ? 'bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700'
              : stats.completionRate >= 20
              ? 'bg-gradient-to-br from-orange-400 via-pink-500 to-rose-600'
              : 'bg-gradient-to-br from-slate-700 via-blue-800 to-indigo-900'
          }`}>
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -ml-12 -mb-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-3">
                  {stats.completionRate >= 80 ? (
                    <FiAward className="h-8 w-8" />
                  ) : stats.completionRate >= 50 ? (
                    <FiZap className="h-8 w-8" />
                  ) : stats.completionRate >= 20 ? (
                    <FiTrendingUp className="h-8 w-8" />
                  ) : (
                    <FiTarget className="h-8 w-8" />
                  )}
                </div>
                <div className="bg-white/25 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/30">
                  <p className="text-sm font-bold tracking-wide">{stats.completionRate}%</p>
                </div>
              </div>
              
              {/* Dynamic title and message based on completion rate */}
              {stats.completionRate >= 80 ? (
                <>
                  <h3 className="font-display text-2xl font-bold mb-2">
                    Outstanding! 🎉
                  </h3>
                  <p className="text-white/95 mb-6 leading-relaxed">
                    You've completed {stats.completed} of {stats.total} tasks! You're crushing it with an {stats.completionRate}% completion rate.
                  </p>
                </>
              ) : stats.completionRate >= 50 ? (
                <>
                  <h3 className="font-display text-2xl font-bold mb-2">
                    Great Progress! 🔥
                  </h3>
                  <p className="text-white/95 mb-6 leading-relaxed">
                    You've completed {stats.completed} of {stats.total} tasks. You're more than halfway there - keep the momentum!
                  </p>
                </>
              ) : stats.completionRate >= 20 ? (
                <>
                  <h3 className="font-display text-2xl font-bold mb-2">
                    Good Start! 💪
                  </h3>
                  <p className="text-white/95 mb-6 leading-relaxed">
                    You've completed {stats.completed} of {stats.total} tasks. You're on your way - let's finish strong!
                  </p>
                </>
              ) : stats.total > 0 ? (
                <>
                  <h3 className="font-display text-2xl font-bold mb-2">
                    Let's Begin! 🚀
                  </h3>
                  <p className="text-white/95 mb-6 leading-relaxed">
                    You have {stats.total} {stats.total === 1 ? 'task' : 'tasks'} to complete. Start checking them off one by one!
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-display text-2xl font-bold mb-2">
                    Ready to Start? 🎯
                  </h3>
                  <p className="text-white/95 mb-6 leading-relaxed">
                    Create your first task and begin your productivity journey!
                  </p>
                </>
              )}

              {/* Stats breakdown */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-xs text-white/90 mt-1 font-medium">Done</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                  <p className="text-xs text-white/90 mt-1 font-medium">Active</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-xs text-white/90 mt-1 font-medium">Todo</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="font-display text-xl font-semibold text-surface-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickAction
              icon={FiPlus}
              title="Create New Task"
              description="Add a new task to your list"
              onClick={() => navigate('/tasks')}
              color="bg-primary-600"
            />
            <QuickAction
              icon={FiCalendar}
              title="View All Tasks"
              description="See all your tasks and manage them"
              onClick={() => navigate('/tasks')}
              color="bg-success-600"
            />
            <QuickAction
              icon={FiActivity}
              title="View Analytics"
              description="Track your productivity metrics"
              onClick={() => navigate('/analytics')}
              color="bg-warning-600"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-surface-100 shadow-soft-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl font-semibold text-surface-900">
              Recent Activity
            </h3>
            <button 
              onClick={() => navigate('/tasks')}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View all
            </button>
          </div>
          <div className="space-y-2">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <ActivityItem
                  key={task._id}
                  task={task.title}
                  time={new Date(task.createdAt || Date.now()).toLocaleDateString()}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <FiAlertCircle className="h-12 w-12 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-600">No recent activity</p>
                <button
                  onClick={() => navigate('/tasks')}
                  className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Create your first task
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}