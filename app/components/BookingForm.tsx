'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Slot {
  id: number
  availableSeats: number
}

interface BookingFormProps {
  experienceId: number
  slot: Slot
  price: number
}

export function BookingForm({ experienceId, slot, price }: BookingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [promoError, setPromoError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      experienceId,
      slotId: slot.id,
      customerName: formData.get('name') as string,
      customerEmail: formData.get('email') as string,
      customerPhone: formData.get('phone') as string,
      guests: parseInt(formData.get('guests') as string),
      promoCode: promoCode || undefined
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const booking = await response.json()
        router.push(`/booking-result?success=true&id=${booking.id}`)
      } else {
        const error = await response.json()
        router.push(`/booking-result?success=false&error=${encodeURIComponent(error.error)}`)
      }
    } catch {
      router.push(`/booking-result?success=false&error=Network error`)
    } finally {
      setLoading(false)
    }
  }

  const validatePromo = async () => {
    if (!promoCode) return

    try {
      const response = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: promoCode,
          totalAmount: price
        }),
      })

      const result = await response.json()
      
      if (result.valid) {
        setDiscount(result.discount)
        setPromoError('')
      } else {
        setDiscount(0)
        setPromoError(result.error)
      }
    } catch (error) {
      console.error(error)
      setPromoError('Failed to validate promo code')
    }
  }

  const finalPrice = price - discount

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
          Number of Guests *
        </label>
        <select
          id="guests"
          name="guests"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {Array.from({ length: slot.availableSeats }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-1">
          Promo Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="promoCode"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            onBlur={validatePromo}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter promo code"
          />
          <button
            type="button"
            onClick={validatePromo}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Apply
          </button>
        </div>
        {promoError && (
          <p className="text-red-600 text-sm mt-1">{promoError}</p>
        )}
      </div>

      <div className="border-t pt-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Price</span>
            <span>${price}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${discount}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${finalPrice}</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Complete Booking'}
      </button>
    </form>
  )
}