import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { 
  ArrowLeft,
  Clock,
  MapPin,
  Star,
  DollarSign,
  Shield,
  Car,
  Phone,
  Navigation2,
  CheckCircle,
  CreditCard,
  Calendar
} from 'lucide-react'
import type { ParkingSpot, Booking } from '../contexts/AppContext'

const BookingFlow = () => {
  const { spotId } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDuration, setSelectedDuration] = useState(2) // hours
  const [isLoading, setIsLoading] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState('')

  // Find the selected spot
  const spot = [...state.parkingSpots.downtown_dallas, ...state.parkingSpots.legacy_plano]
    .find(s => s.id === spotId)

  useEffect(() => {
    if (!spot) {
      navigate('/app')
      return
    }
    dispatch({ type: 'SELECT_SPOT', payload: spot })
  }, [spot, navigate, dispatch])

  const calculateTotal = () => {
    if (!spot) return 0
    const basePrice = spot.price * selectedDuration
    const serviceFee = Math.round(basePrice * 0.08 * 100) / 100
    return basePrice + serviceFee + 2.99 // base fee
  }

  const handleBooking = async () => {
    if (!spot) return
    
    setIsLoading(true)
    
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const booking: Booking = {
      id: `BK${Date.now()}`,
      spot_id: spot.id,
      user_id: 'demo_user',
      parker_name: spot.parker_name,
      location: spot.location.name,
      start_time: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      end_time: new Date(Date.now() + selectedDuration * 60 * 60 * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      total_price: calculateTotal(),
      status: 'upcoming',
      confirmation_code: `PKR${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    }

    setConfirmationCode(booking.confirmation_code)
    dispatch({ type: 'ADD_BOOKING', payload: booking })
    dispatch({ type: 'SET_CURRENT_BOOKING', payload: booking })
    dispatch({ type: 'UPDATE_SPOT_STATUS', payload: { spotId: spot.id, status: 'reserved' } })
    
    setIsLoading(false)
    setBookingConfirmed(true)
    setCurrentStep(4)
  }

  const handleContactParker = () => {
    // Simulate opening phone app
    alert(`Calling ${spot?.parker_name} at +1 (214) 555-${Math.floor(1000 + Math.random() * 9000)}`)
  }

  const handleNavigation = () => {
    if (!spot) return
    // Simulate opening maps app
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${spot.location.lat},${spot.location.lng}`
    window.open(mapsUrl, '_blank')
  }

  if (!spot) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900">Spot not found</div>
          <button 
            onClick={() => navigate('/app')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Map
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate('/app')}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {bookingConfirmed ? 'Booking Confirmed!' : 'Reserve Parking Spot'}
            </h1>
            <p className="text-gray-600">{spot.location.name}</p>
          </div>
        </div>

        {/* Progress Steps */}
        {!bookingConfirmed && (
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Spot Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Parking Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{spot.location.name}</h3>
                  <p className="text-gray-600">{spot.location.address}</p>
                  <p className="text-sm text-gray-500 mt-1">{spot.distance_walk}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Available Hours</h3>
                  <p className="text-gray-600">{spot.availability.start} - {spot.availability.end}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {spot.parker_name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{spot.parker_name}</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-600">{spot.parker_rating}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">${spot.earnings} earned</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {spot.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {amenity.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Form / Confirmation */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {bookingConfirmed ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-6">Your parking spot is reserved</p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="text-sm text-gray-600 mb-1">Confirmation Code</div>
                  <div className="text-2xl font-bold text-gray-900">{confirmationCode}</div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleNavigation}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Navigation2 className="w-5 h-5" />
                    <span>Navigate to Spot</span>
                  </button>
                  
                  <button
                    onClick={handleContactParker}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Contact Parker</span>
                  </button>
                </div>

                <div className="mt-8 text-left space-y-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Car className="w-4 h-4" />
                    <span>Your parker will be waiting in their car</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Show confirmation code for quick handoff</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Please arrive within 10 minutes</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h2>
                
                {/* Duration Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Duration
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 6, 8].map((hours) => (
                      <button
                        key={hours}
                        onClick={() => setSelectedDuration(hours)}
                        className={`p-3 rounded-lg border text-center transition-colors ${
                          selectedDuration === hours
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">{hours}h</div>
                        <div className="text-sm text-gray-500">${spot.price * hours}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Price Breakdown</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Parking ({selectedDuration}h @ ${spot.price}/h)</span>
                      <span>${spot.price * selectedDuration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Fee (8%)</span>
                      <span>${Math.round(spot.price * selectedDuration * 0.08 * 100) / 100}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Booking Fee</span>
                      <span>$2.99</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${calculateTotal()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="border border-gray-200 rounded-lg p-4 flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-gray-400" />
                    <div>
                      <div className="font-medium">•••• •••• •••• 4242</div>
                      <div className="text-sm text-gray-500">Expires 12/25</div>
                    </div>
                  </div>
                </div>

                {/* Confirm Booking Button */}
                <button
                  onClick={handleBooking}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Confirm Booking - ${calculateTotal()}</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 mt-3 text-center">
                  By booking, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingFlow
