import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

declare global {
  // allow global 'prisma' to be reused across module reloads in development
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { experienceId, slotId, customerName, customerEmail, customerPhone, guests, promoCode } = body

    // Check slot availability
    const slot = await prisma.slot.findFirst({
      where: {
        id: slotId,
        availableSeats: {
          gte: guests
        }
      }
    })

    if (!slot) {
      return NextResponse.json(
        { error: 'Selected slot is not available' },
        { status: 400 }
      )
    }

    // Calculate price
    const experience = await prisma.experience.findUnique({
      where: { id: experienceId }
    })

    if (!experience) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      )
    }

    const totalPrice = experience.price * guests
    let discountAmount = 0
    let finalPrice = totalPrice

    // Apply promo code if provided
    if (promoCode) {
      const promo = await prisma.promoCode.findFirst({
        where: {
          code: promoCode,
          isActive: true,
          validFrom: { lte: new Date() },
          validUntil: { gte: new Date() },
          OR: [
            { usageLimit: null },
            { usedCount: { lt: prisma.promoCode.fields.usageLimit } }
          ]
        }
      })

      if (promo) {
        if (promo.discountType === 'percentage') {
          discountAmount = (totalPrice * promo.discountValue) / 100
          if (promo.maxDiscount && discountAmount > promo.maxDiscount) {
            discountAmount = promo.maxDiscount
          }
        } else {
          discountAmount = promo.discountValue
        }
        
        finalPrice = totalPrice - discountAmount
        
        // Update promo code usage
        await prisma.promoCode.update({
          where: { id: promo.id },
          data: { usedCount: { increment: 1 } }
        })
      }
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        experienceId,
        slotId,
        customerName,
        customerEmail,
        customerPhone,
        guests,
        totalPrice,
        promoCode,
        discountAmount,
        finalPrice,
        status: 'confirmed'
      }
    })

    // Update slot availability
    await prisma.slot.update({
      where: { id: slotId },
      data: { availableSeats: { decrement: guests } }
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}