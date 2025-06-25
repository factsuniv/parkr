import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { 
  MapPin, 
  User, 
  Car, 
  Menu, 
  X,
  Clock,
  DollarSign,
  Star
} from 'lucide-react'

const Navigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = useApp()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { path: '/app', icon: <MapPin className="w-5 h-5" />, label: 'Find Parking' },
    { path: '/app/profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
    { path: '/app/parker', icon: <Car className="w-5 h-5" />, label: 'Become Parker' },
  ]

  const isActive = (path: string) => {
    if (path === '/app') {
      return location.pathname === '/app' || location.pathname === '/app/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/app')}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <div className="text-lg font-bold text-white">P</div>
            </div>
            <div className="text-xl font-bold text-gray-900">Parkr</div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* User Info & Stats */}
          <div className="hidden md:flex items-center space-x-6">
            {state.isAuthenticated && (
              <>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">4.8</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">47 trips</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">Alex Johnson</div>
                    <div className="text-xs text-gray-500">Premium Member</div>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    AJ
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-6 space-y-4">
            {/* User Info Mobile */}
            {state.isAuthenticated && (
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  AJ
                </div>
                <div>
                  <div className="font-medium text-gray-900">Alex Johnson</div>
                  <div className="text-sm text-gray-500">Premium Member</div>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>4.8 rating</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-blue-500" />
                      <span>47 trips</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Navigation Items */}
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                  setIsMenuOpen(false)
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current Booking Banner */}
      {state.currentBooking && (
        <div className="bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium">Active Booking: {state.currentBooking.location}</span>
                <span className="text-blue-200">• Ends at {state.currentBooking.end_time}</span>
              </div>
              <button 
                onClick={() => navigate(`/app/booking/${state.currentBooking.spot_id}`)}
                className="text-blue-200 hover:text-white font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation
