import { useState, useCallback, useEffect } from 'react'
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star,
  Navigation2,
  Car,
  Shield
} from 'lucide-react'
import type { ParkingSpot } from '../contexts/AppContext'

const mapStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  }
]

const mapOptions = {
  styles: mapStyles,
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
}

const MapView = () => {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const [selectedMarker, setSelectedMarker] = useState<ParkingSpot | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    maxPrice: 30,
    spotType: 'all',
    amenities: [] as string[]
  })

  // Get current location spots
  const currentSpots = state.currentLocation === 'downtown_dallas' 
    ? state.parkingSpots.downtown_dallas 
    : state.parkingSpots.legacy_plano

  // Filter spots based on search and filters
  const filteredSpots = currentSpots.filter(spot => {
    const matchesSearch = spot.location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         spot.location.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = spot.price <= filters.maxPrice
    const matchesType = filters.spotType === 'all' || spot.spot_type === filters.spotType
    
    return matchesSearch && matchesPrice && matchesType
  })

  const onMapLoad = useCallback((map: google.maps.Map) => {
    // Map is ready
  }, [])

  const handleLocationChange = (location: string) => {
    dispatch({ type: 'SET_LOCATION', payload: location })
    if (state.config?.locations[location]) {
      dispatch({ 
        type: 'SET_MAP_CENTER', 
        payload: state.config.locations[location].center 
      })
    }
  }

  const handleSpotClick = (spot: ParkingSpot) => {
    setSelectedMarker(spot)
    dispatch({ type: 'SELECT_SPOT', payload: spot })
  }

  const handleBookSpot = (spot: ParkingSpot) => {
    navigate(`/app/booking/${spot.id}`)
  }

  const getMarkerIcon = (spot: ParkingSpot) => {
    const color = spot.availability.status === 'available' ? '#10B981' : 
                 spot.availability.status === 'reserved' ? '#F59E0B' : '#EF4444'
    
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      scale: 8,
    }
  }

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Randomly update some spot statuses for demo
      const randomSpot = filteredSpots[Math.floor(Math.random() * filteredSpots.length)]
      if (randomSpot && Math.random() > 0.95) {
        const newStatus = randomSpot.availability.status === 'available' ? 'reserved' : 'available'
        dispatch({ 
          type: 'UPDATE_SPOT_STATUS', 
          payload: { spotId: randomSpot.id, status: newStatus } 
        })
      }
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [filteredSpots, dispatch])

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-1/3 min-w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Find Parking</h1>
          
          {/* Location Selector */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => handleLocationChange('downtown_dallas')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                state.currentLocation === 'downtown_dallas'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Downtown Dallas
            </button>
            <button
              onClick={() => handleLocationChange('legacy_plano')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                state.currentLocation === 'legacy_plano'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Legacy/Plano
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="font-semibold text-green-800">{filteredSpots.filter(s => s.availability.status === 'available').length} Available</div>
              <div className="text-green-600">Ready to book</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="font-semibold text-blue-800">
                ${Math.round(filteredSpots.reduce((sum, s) => sum + s.price, 0) / filteredSpots.length || 0)} Avg
              </div>
              <div className="text-blue-600">Price per spot</div>
            </div>
          </div>
        </div>

        {/* Spots List */}
        <div className="flex-1 overflow-y-auto">
          {filteredSpots.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No parking spots found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {filteredSpots.map((spot) => (
                <div
                  key={spot.id}
                  className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedMarker?.id === spot.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSpotClick(spot)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{spot.location.name}</h3>
                      <p className="text-sm text-gray-500">{spot.location.address}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">${spot.price}</div>
                      <div className={`text-xs font-medium ${
                        spot.availability.status === 'available' ? 'text-green-600' : 
                        spot.availability.status === 'reserved' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {spot.availability.status.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{spot.availability.start} - {spot.availability.end}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Navigation2 className="w-4 h-4" />
                      <span>{spot.distance_walk}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {spot.parker_name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{spot.parker_name}</div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-gray-600">{spot.parker_rating}</span>
                        </div>
                      </div>
                    </div>

                    {spot.availability.status === 'available' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleBookSpot(spot)
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Book Now
                      </button>
                    )}
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {spot.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                      >
                        {amenity.replace('_', ' ')}
                      </span>
                    ))}
                    {spot.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                        +{spot.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={state.mapCenter}
          zoom={14}
          onLoad={onMapLoad}
          options={mapOptions}
        >
          {filteredSpots.map((spot) => (
            <Marker
              key={spot.id}
              position={{ lat: spot.location.lat, lng: spot.location.lng }}
              onClick={() => handleSpotClick(spot)}
              icon={getMarkerIcon(spot)}
            />
          ))}

          {selectedMarker && (
            <InfoWindow
              position={{ lat: selectedMarker.location.lat, lng: selectedMarker.location.lng }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="p-3 max-w-sm">
                <h3 className="font-semibold text-gray-900 mb-2">{selectedMarker.location.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-bold text-lg">${selectedMarker.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span>{selectedMarker.availability.start} - {selectedMarker.availability.end}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Parker:</span>
                    <div className="flex items-center space-x-1">
                      <span>{selectedMarker.parker_name}</span>
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>{selectedMarker.parker_rating}</span>
                    </div>
                  </div>
                  {selectedMarker.availability.status === 'available' && (
                    <button
                      onClick={() => handleBookSpot(selectedMarker)}
                      className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Book This Spot
                    </button>
                  )}
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {/* Map Overlay - Live Updates */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">Live Updates</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapView
