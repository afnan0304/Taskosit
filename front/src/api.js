import axios from 'axios'

// Base URL prefers env (Vite) and falls back to '/api' (proxied in vite.config.js)
const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE || '/api' })

// Attach access token
API.interceptors.request.use((req) => {
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) req.headers.Authorization = `Bearer ${accessToken}`
  return req
})

// Auto refresh on 401
let isRefreshing = false
let pendingRequests = []

const processQueue = (error, token = null) => {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  pendingRequests = []
}

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({
            resolve: (token) => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token
              resolve(API(originalRequest))
            },
            reject,
          })
        })
      }

      isRefreshing = true
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) throw new Error('No refresh token')
        const resp = await axios.post('/api/auth/refresh-token', { token: refreshToken })
        const { accessToken, refreshToken: newRefresh } = resp.data
        if (accessToken) localStorage.setItem('accessToken', accessToken)
        if (newRefresh) localStorage.setItem('refreshToken', newRefresh)
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken
        processQueue(null, accessToken)
        return API(originalRequest)
      } catch (err) {
        processQueue(err, null)
        // Clean up tokens and redirect to login optionally
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

// Tasks
export const getTasks = async () => {
  const response = await API.get('/task')
  return response.data.tasks
}

export const createTask = async (taskData) => {
  const response = await API.post('/task', taskData)
  return response.data.task
}

export const updateTask = async (taskId, taskData) => {
  const response = await API.patch(`/task/${taskId}/status`, taskData)
  return response.data.task
}

export const deleteTask = async (taskId) => {
  const response = await API.delete(`/task/${taskId}`)
  return response.data
}

// Auth
export const login = async (credentials) => {
  const response = await API.post('/auth/login', credentials)
  return response.data
}

export const register = async (userData) => {
  const response = await API.post('/auth/register', userData)
  return response.data
}

export const logout = async (refreshToken) => {
  const response = await API.post('/auth/logout', { token: refreshToken })
  return response.data
}

// Profile
export const getProfile = async () => {
  const response = await API.get('/user/me')
  return response.data
}

export const updateProfile = async (profileData) => {
  const response = await API.put('/user/me', profileData)
  return response.data
}

export const updatePassword = async (passwordData) => {
  const response = await API.put('/user/me/password', passwordData)
  return response.data
}

// Analytics
export const getAnalytics = async (period = '30') => {
  const response = await API.get(`/task/analytics?period=${period}`)
  return response.data
}

export const getTaskStats = async () => {
  const response = await API.get('/task/stats')
  return response.data
}
