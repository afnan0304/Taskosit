import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiSave, 
  FiShield, 
  FiSettings, 
  FiKey,
  FiBell,
  FiGlobe,
  FiEye,
  FiCamera,
  FiCheck
} from 'react-icons/fi'
import { Navigation } from '../components/Navigation'
import { getProfile, updateProfile, updatePassword, logout } from '../api'

// Profile Avatar Component
const ProfileAvatar = ({ name, onUpload }) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
  
  return (
    <div className="relative group">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold shadow-soft-lg">
        {initials}
      </div>
      <button
        onClick={onUpload}
        className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-soft border border-surface-200 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <FiCamera className="h-4 w-4 text-surface-600" />
      </button>
    </div>
  )
}

// Settings Toggle Component
const SettingsToggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-start justify-between py-4">
    <div className="flex-1">
      <p className="font-medium text-surface-900">{label}</p>
      <p className="text-sm text-surface-600 mt-1">{description}</p>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-primary-600' : 'bg-surface-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
)

export default function Profile() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile')
  const [isSaving, setIsSaving] = useState(false)
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    taskReminders: true
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  // Update tab from URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['profile', 'security', 'preferences'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const fetchProfile = async () => {
    try {
      const data = await getProfile()
      setProfile({ name: data.name, email: data.email })
    } catch {
      toast.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateProfile(profile)
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsSaving(true)
    try {
      await updatePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      })
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      toast.success('Password updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update password')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = () => {
    toast.info('Avatar upload coming soon!')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="text-surface-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    )
  }

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

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setSearchParams({ tab: tabId })
  }

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'preferences', label: 'Preferences', icon: FiSettings },
  ]

  return (
    <div className="min-h-screen bg-surface-50">
      <Navigation onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-display-md text-surface-900 mb-2">Account Settings</h1>
          <p className="text-surface-600">Manage your profile, security, and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft-sm border border-surface-100 overflow-hidden sticky top-8">
              {/* Profile Summary */}
              <div className="p-6 border-b border-surface-100">
                <div className="flex flex-col items-center text-center">
                  <ProfileAvatar name={profile.name} onUpload={handleAvatarUpload} />
                  <h3 className="font-semibold text-surface-900 mt-4">{profile.name}</h3>
                  <p className="text-sm text-surface-600 mt-1">{profile.email}</p>
                  <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-success-50 text-success-700 text-xs font-medium">
                    <FiCheck className="h-3 w-3 mr-1" />
                    Verified Account
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="p-2">
                {/* eslint-disable-next-line no-unused-vars */}
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleTabChange(id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                      activeTab === id
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-soft-sm border border-surface-100 p-8">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="bg-primary-50 p-2 rounded-lg">
                        <FiUser className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-surface-900">Personal Information</h2>
                        <p className="text-sm text-surface-600">Update your personal details</p>
                      </div>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="label">Full Name</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <FiUser className="h-5 w-5 text-surface-400" />
                            </div>
                            <input
                              id="name"
                              type="text"
                              value={profile.name}
                              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                              className="input pl-11"
                              placeholder="John Doe"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="email" className="label">Email Address</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <FiMail className="h-5 w-5 text-surface-400" />
                            </div>
                            <input
                              id="email"
                              type="email"
                              value={profile.email}
                              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                              className="input pl-11"
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="btn btn-primary"
                        >
                          {isSaving ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <FiSave className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="bg-error-50 p-2 rounded-lg">
                        <FiKey className="h-5 w-5 text-error-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-surface-900">Change Password</h2>
                        <p className="text-sm text-surface-600">Update your password to keep your account secure</p>
                      </div>
                    </div>

                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                      <div>
                        <label htmlFor="currentPassword" className="label">Current Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-surface-400" />
                          </div>
                          <input
                            id="currentPassword"
                            type="password"
                            value={passwords.currentPassword}
                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                            className="input pl-11"
                            placeholder="Enter current password"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="newPassword" className="label">New Password</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <FiLock className="h-5 w-5 text-surface-400" />
                            </div>
                            <input
                              id="newPassword"
                              type="password"
                              value={passwords.newPassword}
                              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                              className="input pl-11"
                              placeholder="Enter new password"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="confirmPassword" className="label">Confirm Password</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <FiLock className="h-5 w-5 text-surface-400" />
                            </div>
                            <input
                              id="confirmPassword"
                              type="password"
                              value={passwords.confirmPassword}
                              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                              className="input pl-11"
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-warning-50 border border-warning-200 rounded-xl p-4">
                        <p className="text-sm text-warning-800 font-medium mb-2">Password Requirements:</p>
                        <ul className="text-sm text-warning-700 space-y-1">
                          <li>• At least 8 characters long</li>
                          <li>• Include uppercase and lowercase letters</li>
                          <li>• Include at least one number</li>
                        </ul>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="btn btn-primary"
                        >
                          {isSaving ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Updating...
                            </>
                          ) : (
                            <>
                              <FiKey className="w-4 h-4 mr-2" />
                              Update Password
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="pt-8 border-t border-surface-200">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="bg-success-50 p-2 rounded-lg">
                        <FiShield className="h-5 w-5 text-success-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-surface-900">Two-Factor Authentication</h2>
                        <p className="text-sm text-surface-600">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <button className="btn btn-secondary">
                      <FiShield className="w-4 h-4 mr-2" />
                      Enable 2FA (Coming Soon)
                    </button>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="bg-primary-50 p-2 rounded-lg">
                        <FiBell className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-surface-900">Notifications</h2>
                        <p className="text-sm text-surface-600">Manage how you receive notifications</p>
                      </div>
                    </div>

                    <div className="divide-y divide-surface-200">
                      <SettingsToggle
                        label="Email Notifications"
                        description="Receive email updates about your tasks"
                        checked={preferences.emailNotifications}
                        onChange={(val) => setPreferences({ ...preferences, emailNotifications: val })}
                      />
                      <SettingsToggle
                        label="Push Notifications"
                        description="Get push notifications on your device"
                        checked={preferences.pushNotifications}
                        onChange={(val) => setPreferences({ ...preferences, pushNotifications: val })}
                      />
                      <SettingsToggle
                        label="Weekly Report"
                        description="Receive a weekly summary of your productivity"
                        checked={preferences.weeklyReport}
                        onChange={(val) => setPreferences({ ...preferences, weeklyReport: val })}
                      />
                      <SettingsToggle
                        label="Task Reminders"
                        description="Get reminded about upcoming task deadlines"
                        checked={preferences.taskReminders}
                        onChange={(val) => setPreferences({ ...preferences, taskReminders: val })}
                      />
                    </div>
                  </div>

                  {/* Language & Region */}
                  <div className="pt-8 border-t border-surface-200">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="bg-success-50 p-2 rounded-lg">
                        <FiGlobe className="h-5 w-5 text-success-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-surface-900">Language & Region</h2>
                        <p className="text-sm text-surface-600">Set your language and timezone preferences</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="label">Language</label>
                        <select className="input">
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                        </select>
                      </div>
                      <div>
                        <label className="label">Timezone</label>
                        <select className="input">
                          <option value="UTC">UTC</option>
                          <option value="EST">Eastern Time</option>
                          <option value="PST">Pacific Time</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Privacy */}
                  <div className="pt-8 border-t border-surface-200">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="bg-warning-50 p-2 rounded-lg">
                        <FiEye className="h-5 w-5 text-warning-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-surface-900">Privacy</h2>
                        <p className="text-sm text-surface-600">Control your privacy settings</p>
                      </div>
                    </div>
                    <button className="btn btn-secondary">
                      <FiEye className="w-4 h-4 mr-2" />
                      Manage Privacy Settings
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}