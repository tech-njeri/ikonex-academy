// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request, context) {
  try {
    const params = await context.params
    const id = parseInt(params.id)
    
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        stream: true,
        scores: {
          include: { subject: true }
        }
      }
    })
    return NextResponse.json(student)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}