import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FiTrendingUp, 
  FiTrendingDown,
  FiTarget,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiAward,
  FiActivity,
  FiCalendar,
  FiPieChart,
  FiBarChart2
} from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { Navigation } from '../components/Navigation'
import { logout, getAnalytics } from '../api'

// eslint-disable-next-line no-unused-vars
const StatCard = ({ icon: Icon, label, value, subtitle, color, bgColor, trend }) => (
  <div className="bg-white rounded-2xl p-6 border border-surface-100 shadow-soft-sm">
    <div className="flex items-start justify-between mb-4">
      <div className={`${bgColor} p-3 rounded-xl`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      {trend && (
        <div className={`flex items-center space-x-1 text-sm font-medium ${
          trend > 0 ? 'text-success-600' : trend < 0 ? 'text-error-600' : 'text-surface-600'
        }`}>
          {trend > 0 ? <FiTrendingUp className="h-4 w-4" /> : trend < 0 ? <FiTrendingDown className="h-4 w-4" /> : null}
          {trend !== 0 && <span>{Math.abs(trend)}%</span>}
        </div>
      )}
    </div>
    <div>
      <p className="text-surface-600 text-sm font-medium mb-1">{label}</p>
      <p className="text-3xl font-bold text-surface-900 mb-1">{value}</p>
      {subtitle && <p className="text-xs text-surface-500">{subtitle}</p>}
    </div>
  </div>
)

const ProgressBar = ({ label, value, max, color }) => {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-surface-700">{label}</span>
        <span className="text-sm font-semibold text-surface-900">{value}</span>
      </div>
      <div className="h-3 bg-surface-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

const ChartBar = ({ label, value, maxValue, color }) => {
  const height = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-full h-32 flex items-end">
        <div 
          className={`w-full ${color} rounded-t-lg transition-all duration-500 flex items-center justify-center`}
          style={{ height: `${Math.max(height, 5)}%` }}
        >
          {value > 0 && (
            <span className="text-xs font-bold text-white">{value}</span>
          )}
        </div>
      </div>
      <span className="text-xs font-medium text-surface-600">{label}</span>
    </div>
  )
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState('30')
  const navigate = useNavigate()

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getAnalytics(period)
      setAnalytics(data)
    } catch (err) {
      toast.error('Failed to load analytics')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

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
      <div className="min-h-screen bg-surface-50">
        <Navigation onLogout={handleLogout} />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-surface-600 font-medium">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-surface-50">
        <Navigation onLogout={handleLogout} />
        <div className="flex items-center justify-center h-screen">
          <p className="text-surface-600">No analytics data available</p>
        </div>
      </div>
    )
  }

  const { summary, priority, categories, trends } = analytics
  const maxCompletionValue = Math.max(...trends.completion.map(d => d.count), 1)
  const maxCreationValue = Math.max(...trends.creation.map(d => d.count), 1)

  return (
    <div className="min-h-screen bg-surface-50">
      <Navigation onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-display-lg text-surface-900 mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-surface-600 text-lg">
                Insights into your productivity and task management
              </p>
            </div>
            
            {/* Period Selector */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-surface-700">Period:</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-2 rounded-lg border border-surface-200 bg-white text-sm font-medium text-surface-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FiAward}
            label="Productivity Score"
            value={summary.productivityScore}
            subtitle="Based on completion rate & consistency"
            color="text-primary-600"
            bgColor="bg-primary-50"
          />
          <StatCard
            icon={FiCheckCircle}
            label="Completion Rate"
            value={`${summary.completionRate}%`}
            subtitle={`${summary.completed} of ${summary.total} tasks`}
            color="text-success-600"
            bgColor="bg-success-50"
          />
          <StatCard
            icon={FiClock}
            label="Avg. Completion Time"
            value={summary.avgCompletionTime}
            subtitle="days per task"
            color="text-warning-600"
            bgColor="bg-warning-50"
          />
          <StatCard
            icon={FiAlertCircle}
            label="Overdue Tasks"
            value={summary.overdue}
            subtitle={`${summary.dueSoon} due soon`}
            color="text-error-600"
            bgColor="bg-error-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Task Status Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-surface-100 shadow-soft-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-primary-50 p-2 rounded-lg">
                <FiPieChart className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-surface-900">
                  Task Status
                </h3>
                <p className="text-sm text-surface-600">Current status breakdown</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <ProgressBar
                label="Completed"
                value={summary.completed}
                max={summary.total}
                color="bg-success-600"
              />
              <ProgressBar
                label="In Progress"
                value={summary.inProgress}
                max={summary.total}
                color="bg-warning-600"
              />
              <ProgressBar
                label="Pending"
                value={summary.pending}
                max={summary.total}
                color="bg-error-600"
              />
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-surface-100 shadow-soft-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-error-50 p-2 rounded-lg">
                <FiTarget className="h-5 w-5 text-error-600" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-surface-900">
                  Priority Breakdown
                </h3>
                <p className="text-sm text-surface-600">Tasks by priority level</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <ProgressBar
                label="Urgent"
                value={priority.urgent}
                max={summary.total}
                color="bg-error-600"
              />
              <ProgressBar
                label="High"
                value={priority.high}
                max={summary.total}
                color="bg-warning-600"
              />
              <ProgressBar
                label="Medium"
                value={priority.medium}
                max={summary.total}
                color="bg-primary-600"
              />
              <ProgressBar
                label="Low"
                value={priority.low}
                max={summary.total}
                color="bg-success-600"
              />
            </div>
          </div>
        </div>

        {/* Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Completion Trend */}
          <div className="bg-white rounded-2xl p-6 border border-surface-100 shadow-soft-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-success-50 p-2 rounded-lg">
                <FiBarChart2 className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-surface-900">
                  Completion Trend
                </h3>
                <p className="text-sm text-surface-600">Tasks completed per day (last 7 days)</p>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {trends.completion.map((day, index) => (
                <ChartBar
                  key={index}
                  label={new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  value={day.count}
                  maxValue={maxCompletionValue}
                  color="bg-gradient-to-t from-success-600 to-success-400"
                />
              ))}
            </div>
          </div>

          {/* Creation Trend */}
          <div className="bg-white rounded-2xl p-6 border border-surface-100 shadow-soft-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-primary-50 p-2 rounded-lg">
                <FiActivity className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-surface-900">
                  Creation Trend
                </h3>
                <p className="text-sm text-surface-600">Tasks created per day (last 7 days)</p>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {trends.creation.map((day, index) => (
                <ChartBar
                  key={index}
                  label={new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  value={day.count}
                  maxValue={maxCreationValue}
                  color="bg-gradient-to-t from-primary-600 to-primary-400"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Categories Performance */}
        {Object.keys(categories).length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-surface-100 shadow-soft-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-warning-50 p-2 rounded-lg">
                <FiCalendar className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-surface-900">
                  Category Performance
                </h3>
                <p className="text-sm text-surface-600">Completion rate by category</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(categories).map(([category, stats]) => {
                const completion = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
                return (
                  <div key={category} className="p-4 bg-surface-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-surface-900">{category}</h4>
                      <span className="text-sm font-bold text-primary-600">{completion}%</span>
                    </div>
                    <p className="text-sm text-surface-600 mb-3">
                      {stats.completed} of {stats.total} completed
                    </p>
                    <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
