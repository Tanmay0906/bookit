import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function POST(request: Request) {
  try {
    const { code, totalAmount } = await request.json()

    const promo = await prisma.promoCode.findFirst({
      where: {
        code,
        isActive: true,
        validFrom: { lte: new Date() },
        validUntil: { gte: new Date() }
      }
    })

    if (!promo) {
      return NextResponse.json(
        { valid: false, error: 'Invalid or expired promo code' }
      )
    }

    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      return NextResponse.json(
        { valid: false, error: 'Promo code usage limit exceeded' }
      )
    }

    if (promo.minAmount && totalAmount < promo.minAmount) {
      return NextResponse.json(
        { valid: false, error: `Minimum amount ${promo.minAmount} required` }
      )
    }

    let discount = 0
    if (promo.discountType === 'percentage') {
      discount = (totalAmount * promo.discountValue) / 100
      if (promo.maxDiscount && discount > promo.maxDiscount) {
        discount = promo.maxDiscount
      }
    } else {
      discount = promo.discountValue
    }

    return NextResponse.json({
      valid: true,
      discount,
      finalAmount: totalAmount - discount,
      promoCode: promo.code
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to validate promo code' },
      { status: 500 }
    )
  }
}