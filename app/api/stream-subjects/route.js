// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET — fetch all subject assignments for a stream
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const streamId = parseInt(searchParams.get('streamId'))
    const assignments = await prisma.streamSubject.findMany({
      where: { streamId },
      include: { subject: true }
    })
    return NextResponse.json(assignments)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 })
  }
}

// POST — assign a subject to a stream
export async function POST(request) {
  try {
    const body = await request.json()
    const assignment = await prisma.streamSubject.create({
      data: {
        streamId: body.streamId,
        subjectId: body.subjectId
      }
    })
    return NextResponse.json(assignment)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to assign subject' }, { status: 500 })
  }
}

// DELETE — remove a subject from a stream
export async function DELETE(request) {
  try {
    const body = await request.json()
    await prisma.streamSubject.delete({
      where: { id: body.id }
    })
    return NextResponse.json({ message: 'Assignment removed' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove assignment' }, { status: 500 })
  }
}