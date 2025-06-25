import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { LoadScript } from '@react-google-maps/api'
import LandingPage from './components/LandingPage'
import MapView from './components/MapView'
import BookingFlow from './components/BookingFlow'
import UserProfile from './components/UserProfile'
import ParkerDashboard from './components/ParkerDashboard'
import Navigation from './components/Navigation'
import { AppProvider } from './contexts/AppContext'
import './App.css'

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ['places', 'geometry']

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    // Simulate app loading
    const timer = setTimeout(() => setIsLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-lg">
            <div className="text-3xl font-bold text-blue-600">P</div>
          </div>
          <div className="text-white text-xl font-medium">Loading Parkr...</div>
          <div className="mt-4">
            <div className="w-48 h-1 bg-blue-300 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCO0kKndUNlmQi3B5mxy4dblg_8WYcuKuk"
      libraries={libraries}
      loadingElement={<div>Loading Maps...</div>}
    >
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route 
                path="/app/*" 
                element={
                  <div className="flex flex-col h-screen">
                    <Navigation />
                    <main className="flex-1 overflow-hidden">
                      <Routes>
                        <Route path="/" element={<MapView />} />
                        <Route path="/booking/:spotId" element={<BookingFlow />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/parker" element={<ParkerDashboard />} />
                      </Routes>
                    </main>
                  </div>
                } 
              />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </LoadScript>
  )
}

export default App
