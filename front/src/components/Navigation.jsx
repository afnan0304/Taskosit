import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import {
  FiLogOut,
  FiCheckSquare,
  FiCheckCircle,
  FiUser,
  FiSettings,
  FiShield,
  FiChevronDown,
  FiHome,
  FiBarChart2,
} from "react-icons/fi"
import { getProfile } from "../api"

export function Navigation({ onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [userData, setUserData] = useState({ name: "", email: "" })
  const dropdownRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Fetch user profile data
  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const data = await getProfile()
      setUserData({ name: data.name, email: data.email })
    } catch {
      setUserData({ name: "User", email: "Loading..." })
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const mainLinks = [
    { name: "Dashboard", href: "/", icon: FiHome },
    { name: "Tasks", href: "/tasks", icon: FiCheckSquare },
    { name: "Analytics", href: "/analytics", icon: FiBarChart2 },
  ]

  const userMenuItems = [
    { name: "My Profile", href: "/profile?tab=profile", icon: FiUser },
    {
      name: "Account Settings",
      href: "/profile?tab=preferences",
      icon: FiSettings,
    },
    { name: "Security", href: "/profile?tab=security", icon: FiShield },
  ]

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <nav className="bg-white border-b border-surface-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-xl shadow-soft-sm group-hover:shadow-soft transition-all duration-200">
                <FiCheckCircle className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-surface-900">
                Taskly
              </span>
            </Link>

            {/* Main Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {mainLinks.map(({ name, href, icon }) => {
                const IconEl = icon
                const isActive = location.pathname === href
                return (
                  <Link
                    key={name}
                    to={href}
                    className={`
                      inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? "bg-primary-50 text-primary-700"
                          : "text-surface-600 hover:text-surface-900 hover:bg-surface-50"
                      }
                    `}
                  >
                    <IconEl className="h-4 w-4 mr-2" />
                    {name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right side - User Profile */}
          <div className="flex items-center">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-surface-50 transition-all duration-200 group"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white text-sm font-semibold shadow-soft-sm">
                  {getInitials(userData.name)}
                </div>

                {/* User Info - Hidden on mobile */}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-surface-900">
                    {userData.name || "User"}
                  </p>
                  <p className="text-xs text-surface-500">
                    {userData.email || "Loading..."}
                  </p>
                </div>

                {/* Chevron */}
                <FiChevronDown
                  className={`h-4 w-4 text-surface-400 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-soft-lg border border-surface-200 overflow-hidden z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 bg-surface-50 border-b border-surface-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white text-sm font-semibold">
                        {getInitials(userData.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-surface-900 truncate">
                          {userData.name || "User"}
                        </p>
                        <p className="text-xs text-surface-600 truncate">
                          {userData.email || "Loading..."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {userMenuItems.map(({ name, href, icon }) => {
                      const IconEl = icon
                      return (
                        <button
                          key={name}
                          onClick={() => {
                            navigate(href)
                            setIsDropdownOpen(false)
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-surface-50 flex items-center space-x-3 transition-colors duration-150"
                        >
                          <IconEl className="h-4 w-4 text-surface-600" />
                          <span className="text-sm font-medium text-surface-700">
                            {name}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Logout Button */}
                  <div className="border-t border-surface-200 p-2">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false)
                        onLogout()
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium text-error-600 hover:bg-error-50 rounded-lg flex items-center space-x-3 transition-colors duration-150"
                    >
                      <FiLogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
