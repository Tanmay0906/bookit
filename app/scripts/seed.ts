import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.booking.deleteMany()
  await prisma.slot.deleteMany()
  await prisma.experience.deleteMany()
  await prisma.promoCode.deleteMany()

  // Create experiences
  const experiences = await prisma.experience.createMany({
    data: [
      {
        title: 'Sunset Sailing Adventure',
        description: 'Enjoy a breathtaking sunset while sailing through the beautiful coastline. Perfect for couples and small groups.',
        price: 89,
        imageUrl: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=500',
        location: 'Miami Beach, FL',
        duration: '3 hours',
        category: 'Adventure',
        rating: 4.8,
        reviewCount: 124
      },
      {
        title: 'Wine Tasting Tour',
        description: 'Explore local vineyards and taste exquisite wines with expert sommeliers in a scenic countryside setting.',
        price: 65,
        imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=500',
        location: 'Napa Valley, CA',
        duration: '4 hours',
        category: 'Food & Drink',
        rating: 4.9,
        reviewCount: 89
      },
      {
        title: 'Mountain Hiking Expedition',
        description: 'Challenge yourself with this guided hiking tour through stunning mountain trails with panoramic views.',
        price: 45,
        imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500',
        location: 'Rocky Mountains, CO',
        duration: '6 hours',
        category: 'Adventure',
        rating: 4.7,
        reviewCount: 203
      }
    ]
  })

  const createdExperiences = await prisma.experience.findMany()

  // Create slots for each experience
  for (const experience of createdExperiences) {
    const slots = []
    const today = new Date()
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      slots.push(
        {
          experienceId: experience.id,
          date: date,
          startTime: '09:00',
          endTime: '12:00',
          availableSeats: 10
        },
        {
          experienceId: experience.id,
          date: date,
          startTime: '14:00',
          endTime: '17:00',
          availableSeats: 8
        }
      )
    }
    
    await prisma.slot.createMany({
      data: slots
    })
  }

  // Create promo codes
  await prisma.promoCode.createMany({
    data: [
      {
        code: 'SAVE10',
        discountType: 'percentage',
        discountValue: 10,
        minAmount: 50,
        maxDiscount: 20,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        usageLimit: 100
      },
      {
        code: 'FLAT100',
        discountType: 'fixed',
        discountValue: 100,
        minAmount: 200,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        usageLimit: 50
      },
      {
        code: 'WELCOME15',
        discountType: 'percentage',
        discountValue: 15,
        minAmount: 30,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        usageLimit: 200
      }
    ]
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
