'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Experience, Slot } from '@/types'
import { BookingForm } from '@/components/BookingForm'

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const experienceId = searchParams.get('experienceId')
  const slotId = searchParams.get('slotId')
  
  const [experience, setExperience] = useState<Experience | null>(null)
  const [slot, setSlot] = useState<Slot | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (experienceId && slotId) {
      fetch(`/api/experiences/${experienceId}`)
        .then(res => res.json())
        .then(data => {
          setExperience(data)
          const selectedSlot = data.slots.find((s: Slot) => s.id === parseInt(slotId))
          setSlot(selectedSlot)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [experienceId, slotId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!experience || !slot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Booking</h1>
          <p className="text-gray-600">Please select a valid experience and slot.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Booking</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h2>
              
              <img
                src={experience.imageUrl}
                alt={experience.title}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              
              <h3 className="font-semibold text-gray-900 mb-2">{experience.title}</h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <strong>Date:</strong> {new Date(slot.date).toLocaleDateString()}
                </div>
                <div>
                  <strong>Time:</strong> {slot.startTime} - {slot.endTime}
                </div>
                <div>
                  <strong>Location:</strong> {experience.location}
                </div>
                <div>
                  <strong>Price:</strong> ${experience.price} per person
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Your Information</h2>
              <BookingForm
                experienceId={experience.id}
                slot={slot}
                price={experience.price}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}