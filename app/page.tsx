import { Experience } from '@/types'
import { Star, MapPin, Clock, Users } from 'lucide-react'

// TEMPORARY HARDCODED DATA
const experience: Experience = {
  id: 1,
  title: "Sunset Sailing Adventure",
  description: "Enjoy a breathtaking sunset while sailing through the beautiful coastline. Perfect for couples and small groups. This experience includes a guided tour, refreshments, and photo opportunities.",
  price: 89,
  imageUrl: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=500",
  location: "Miami Beach, FL",
  duration: "3 hours",
  category: "Adventure",
  rating: 4.8,
  reviewCount: 124,
  slots: [
    {
      id: 1,
      experienceId: 1,
      date: "2024-10-30T00:00:00.000Z",
      startTime: "09:00",
      endTime: "12:00",
      availableSeats: 10
    },
    {
      id: 2,
      experienceId: 1,
      date: "2024-10-31T00:00:00.000Z",
      startTime: "14:00",
      endTime: "17:00",
      availableSeats: 8
    }
  ]
}

export default function ExperienceDetail() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">{experience.title}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Experience Details */}
          <div>
            <img
              src={experience.imageUrl}
              alt={experience.title}
              className="w-full h-96 object-cover rounded-2xl mb-6"
            />
            
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this experience</h2>
              <p className="text-gray-600 mb-6">{experience.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{experience.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{experience.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Group experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-gray-600">
                    {experience.rating} ({experience.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-8">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-gray-900">${experience.price}</div>
              <div className="text-gray-500">per person</div>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-gray-900">Available Slots</h3>
              {experience.slots.length > 0 ? (
                <div className="space-y-2">
                  {experience.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900">
                            {new Date(slot.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {slot.startTime} - {slot.endTime}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            {slot.availableSeats} seats left
                          </div>
                          <a
                            href={`/checkout?experienceId=${experience.id}&slotId=${slot.id}`}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Book Now
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No available slots at the moment
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}