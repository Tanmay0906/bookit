import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      include: {
        slots: {
          where: {
            date: {
              gte: new Date()
            },
            availableSeats: {
              gt: 0
            }
          }
        }
      }
    })
    
    return NextResponse.json(experiences)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    )
  }
}