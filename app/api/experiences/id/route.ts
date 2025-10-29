import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma?: PrismaClient }
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const experience = await prisma.experience.findUnique({
      where: { id: parseInt(id) },
      include: {
        slots: {
          where: {
            date: {
              gte: new Date()
            },
            availableSeats: {
              gt: 0
            }
          },
          orderBy: {
            date: 'asc'
          }
        }
      }
    })

    if (!experience) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(experience)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch experience' },
      { status: 500 }
    )
  }
}