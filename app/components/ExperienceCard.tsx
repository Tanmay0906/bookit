import Link from 'next/link'
import { Experience } from '../types'
import { Star, MapPin, Clock } from 'lucide-react'

interface ExperienceCardProps {
  experience: Experience
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Link 
      href={`/experiences/${experience.id}`}
      className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      {/* Normal img tag use karo - Next.js Image ki jagah */}
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={experience.imageUrl}
          alt={experience.title}
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">
          {experience.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {experience.description}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{experience.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{experience.duration}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-medium text-gray-900">
              {experience.rating || 'New'}
            </span>
            {experience.rating && (
              <span className="text-gray-500">
                ({experience.reviewCount} reviews)
              </span>
            )}
          </div>
          
          <div className="text-right">
            <div className="font-bold text-lg text-gray-900">
              ${experience.price}
            </div>
            <div className="text-sm text-gray-500">per person</div>
          </div>
        </div>
      </div>
    </Link>
  )
}