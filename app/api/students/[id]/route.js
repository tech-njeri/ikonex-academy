// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import prisma from '@/lib/prisma'

export async function GET(request, context) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const params = await context.params
    const rawId = params.id
    const id = parseInt(rawId)

    if (!rawId || isNaN(id)) {
      return NextResponse.json({ error: 'Invalid or missing student id.' }, { status: 400 })
    }

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        stream: true,
        scores: {
          include: { subject: true }
        }
      }
    })

    // Return 404 if student doesn't exist instead of returning null
    if (!student) {
      return NextResponse.json({ error: 'Student not found.' }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error('[GET /api/students/[id]]', error)
    return NextResponse.json({ error: 'Failed to fetch student.' }, { status: 500 })
  }
}