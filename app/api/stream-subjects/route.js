// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/authOptions'
import prisma from '@/lib/prisma'

// GET — fetch all subject assignments for a stream
export async function GET(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const rawStreamId = searchParams.get('streamId')
    const streamId = parseInt(rawStreamId)

    if (!rawStreamId || isNaN(streamId)) {
      return NextResponse.json({ error: 'Invalid or missing streamId' }, { status: 400 })
    }

    const assignments = await prisma.streamSubject.findMany({
      where: { streamId },
      include: { subject: true }
    })

    return NextResponse.json(assignments)
  } catch (error) {
    console.error('[GET /api/stream-subjects]', error)
    return NextResponse.json({ error: 'Failed to fetch assignments.' }, { status: 500 })
  }
}

// POST — assign a subject to a stream
export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { streamId, subjectId } = body

    if (!streamId || !subjectId) {
      return NextResponse.json(
        { error: 'streamId and subjectId are required.' },
        { status: 400 }
      )
    }

    // Confirm stream and subject exist
    const [stream, subject] = await Promise.all([
      prisma.stream.findUnique({ where: { id: streamId } }),
      prisma.subject.findUnique({ where: { id: subjectId } })
    ])

    if (!stream) {
      return NextResponse.json({ error: 'Stream not found.' }, { status: 404 })
    }
    if (!subject) {
      return NextResponse.json({ error: 'Subject not found.' }, { status: 404 })
    }

    // Prevent duplicate assignment
    const existing = await prisma.streamSubject.findFirst({
      where: { streamId, subjectId }
    })
    if (existing) {
      return NextResponse.json(
        { error: 'This subject is already assigned to this stream.' },
        { status: 409 }
      )
    }

    const assignment = await prisma.streamSubject.create({
      data: { streamId, subjectId }
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error('[POST /api/stream-subjects]', error)
    return NextResponse.json({ error: 'Failed to assign subject.' }, { status: 500 })
  }
}

// DELETE — remove a subject from a stream
export async function DELETE(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Assignment id is required.' }, { status: 400 })
    }

    // Confirm the assignment exists before deleting
    const existing = await prisma.streamSubject.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Assignment not found.' }, { status: 404 })
    }

    // Warn if scores already exist for this subject in this stream
    const relatedScores = await prisma.score.findFirst({
      where: {
        subjectId: existing.subjectId,
        student: { streamId: existing.streamId }
      }
    })
    if (relatedScores) {
      return NextResponse.json(
        {
          error: 'Cannot remove this subject — scores have already been recorded against it for students in this stream. Delete the scores first.'
        },
        { status: 409 }
      )
    }

    await prisma.streamSubject.delete({ where: { id } })

    // 204 No Content — correct status for a successful delete with no response body
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[DELETE /api/stream-subjects]', error)
    return NextResponse.json({ error: 'Failed to remove assignment.' }, { status: 500 })
  }
}