import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { FiMail, FiLock, FiUser, FiCheckCircle, FiArrowRight, FiShield, FiZap } from 'react-icons/fi'
import { register as registerUser } from '../api.js'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setIsLoading(true)

    try {
      await registerUser(form)
      toast.success('Account created successfully! 🎉')
      navigate('/login')
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Registration failed'
      const statusCode = err.response?.status
      
      if (statusCode === 409) {
        setErrors({ email: 'This email is already registered' })
      }
      toast.error(message)
      
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-mesh flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMS4xLS45LTItMi0yaC00Yy0xLjEgMC0yIC45LTIgMnY0YzAgMS4xLjkgMiAyIDJoNGMxLjEgMCAyLS45IDItMnYtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
              <FiCheckCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-display text-3xl font-bold text-white">Taskly</h1>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="font-display text-5xl font-bold text-white mb-4 leading-tight">
              Join thousands of<br />productive teams
            </h2>
            <p className="text-primary-100 text-lg leading-relaxed">
              Start your journey to better productivity. Create your free account and get organized today.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              { icon: FiCheckCircle, text: 'Free forever, no credit card required' },
              { icon: FiShield, text: 'Bank-level security and encryption' },
              { icon: FiZap, text: 'Get started in under 60 seconds' }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-3 text-white/90">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <feature.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-primary-100 text-sm">
          © 2025 Taskly. All rights reserved.
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:px-12 lg:px-16">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center space-x-2">
              <div className="bg-primary-600 p-2.5 rounded-xl">
                <FiCheckCircle className="h-6 w-6 text-white" />
              </div>
              <h1 className="font-display text-2xl font-bold text-surface-900">Taskly</h1>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-display-md text-surface-900 mb-2">
              Create your account
            </h2>
            <p className="text-surface-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="label">
                Full name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-surface-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className={`input pl-11 ${errors.name ? 'input-error' : ''}`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-error-600 flex items-center">
                  <span className="inline-block w-1 h-1 rounded-full bg-error-600 mr-1.5"></span>
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-surface-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className={`input pl-11 ${errors.email ? 'input-error' : ''}`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-error-600 flex items-center">
                  <span className="inline-block w-1 h-1 rounded-full bg-error-600 mr-1.5"></span>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-surface-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className={`input pl-11 ${errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-error-600 flex items-center">
                  <span className="inline-block w-1 h-1 rounded-full bg-error-600 mr-1.5"></span>
                  {errors.password}
                </p>
              )}
              <p className="mt-2 text-xs text-surface-500">
                Must be at least 8 characters long
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full text-base py-3.5"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </div>
              ) : (
                <>
                  Create your free account
                  <FiArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-xs text-center text-surface-500">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
