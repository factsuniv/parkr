import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  MapPin, 
  Clock, 
  Shield, 
  Smartphone, 
  Star, 
  ArrowRight,
  DollarSign,
  Car,
  Users,
  CheckCircle
} from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleGetStarted = () => {
    navigate('/app')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
      {/* Header */}
      <header className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <div className="text-2xl font-bold text-blue-600">P</div>
            </div>
            <div className="text-2xl font-bold">Parkr</div>
          </div>
          <button 
            onClick={handleGetStarted}
            className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Enter Demo
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`px-6 py-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            Premium Valet Parking
            <span className="block text-blue-200">On-Demand</span>
          </h1>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Skip the parking hassle. Our verified Parkers hold premium spots in their cars, 
            delivering luxury valet service at the touch of a button.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={handleGetStarted}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-2"
            >
              <span>Experience Parkr</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all">
              Become a Parker
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Parkr?</h2>
            <p className="text-xl text-blue-100">Premium parking experience, powered by real people</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <MapPin className="w-8 h-8" />,
                title: "Prime Locations",
                description: "Downtown Dallas, Legacy Plano, and premium districts across DFW"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Instant Booking",
                description: "Reserve your spot in seconds, with real-time availability"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Verified Parkers",
                description: "All Parkers are vetted with 4.5+ star ratings and insurance coverage"
              },
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: "Seamless Experience",
                description: "Turn-by-turn navigation and contactless handoff via our app"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-blue-200 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-blue-100">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { number: "500+", label: "Verified Parkers", icon: <Users className="w-8 h-8" /> },
              { number: "$18", label: "Average Savings", icon: <DollarSign className="w-8 h-8" /> },
              { number: "4.9★", label: "User Rating", icon: <Star className="w-8 h-8" /> }
            ].map((stat, index) => (
              <div key={index} className="space-y-4">
                <div className="text-blue-200 flex justify-center">{stat.icon}</div>
                <div className="text-5xl font-bold">{stat.number}</div>
                <div className="text-xl text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How Parkr Works</h2>
            <p className="text-xl text-blue-100">Three simple steps to premium parking</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Find & Reserve",
                description: "Browse real-time availability on the map. Select your ideal spot and duration.",
                icon: <MapPin className="w-12 h-12" />
              },
              {
                step: "2",
                title: "Navigate & Meet",
                description: "Follow GPS directions to your Parker. They'll be waiting in their car at your reserved spot.",
                icon: <Car className="w-12 h-12" />
              },
              {
                step: "3",
                title: "Park & Go",
                description: "Quick contactless handoff. Your Parker drives away, you're perfectly parked.",
                icon: <CheckCircle className="w-12 h-12" />
              }
            ].map((step, index) => (
              <div key={index} className="text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-blue-200">{step.icon}</div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="text-blue-100 text-lg leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-800 to-blue-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Skip the Parking Stress?</h2>
          <p className="text-xl text-blue-100 mb-12">
            Join thousands of satisfied customers who've discovered the future of urban parking
          </p>
          <button 
            onClick={handleGetStarted}
            className="px-12 py-6 bg-white text-blue-600 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-3 mx-auto"
          >
            <span>Start Your Parkr Experience</span>
            <ArrowRight className="w-6 h-6" />
          </button>
          <p className="text-blue-200 mt-8">No credit card required • Instant access to demo</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-blue-900/50 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="text-lg font-bold text-blue-600">P</div>
            </div>
            <div className="text-xl font-bold">Parkr</div>
          </div>
          <p className="text-blue-200">© 2024 Parkr. Premium valet parking on-demand.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
