'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, X, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function BookingResultPage() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success') === 'true'
  const bookingId = searchParams.get('id')
  const error = searchParams.get('error')
  
  const [booking, setBooking] = useState<any>(null)

  useEffect(() => {
    if (bookingId) {
      // In a real app, you'd fetch booking details from API
      setBooking({ id: bookingId })
    }
  }, [bookingId])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          {success ? (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Booking Confirmed!
              </h1>
              <p className="text-gray-600 mb-6">
                Your booking has been successfully confirmed. You will receive a confirmation email shortly.
              </p>
              {booking && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="text-sm text-gray-600">Booking Reference</div>
                  <div className="font-mono font-bold text-gray-900">{booking.id}</div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Booking Failed
              </h1>
              <p className="text-gray-600 mb-6">
                {error || 'There was an error processing your booking. Please try again.'}
              </p>
            </>
          )}
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}