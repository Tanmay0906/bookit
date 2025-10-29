export interface Experience {
  id: number
  title: string
  description: string
  price: number
  imageUrl: string
  location: string
  duration: string
  category: string
  rating?: number
  reviewCount: number
  slots: Slot[]
}

export interface Slot {
  id: number
  experienceId: number
  date: string
  startTime: string
  endTime: string
  availableSeats: number
}

export interface Booking {
  id: number
  experienceId: number
  slotId: number
  customerName: string
  customerEmail: string
  customerPhone?: string
  guests: number
  totalPrice: number
  promoCode?: string
  discountAmount: number
  finalPrice: number
  status: string
}

export interface PromoValidation {
  valid: boolean
  discount?: number
  finalAmount?: number
  promoCode?: string
  error?: string
}